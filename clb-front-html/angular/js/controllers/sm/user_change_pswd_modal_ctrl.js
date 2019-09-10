'use strict';

app.controller('UserChangePswdModalCtrl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService, toasterUtils) {

    $scope.fields = {
        userId           : undefined,
        oldPassword      : undefined,
        newPassword      : undefined,
        newPasswordRepeat: undefined,
        userOperatorId   : sessionStorage.getItem('userId')
    };

    $scope.showAlert = false;
    $scope.canSubmit = false;

    $scope.responseData = {
        flag   : ''
    };

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.isFormDisabled = false;

    // Alert when operation is successful
    var addSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.user.USER_MGMT_ALERTS.USER_MGMT_ALERT_PASSWORD_CHANGED')
        });
    };

    // Alert when operation failed
    var addFailAlert = function (message) {
        $scope.alerts.push({
            type: 'danger',
            msg : message
        });
    };

    // Close the alert
    var closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.chkIsPswdDisagree = function () {
        $scope.showAlert = !(!$scope.fields.newPassword && !$scope.fields.newPasswordRepeat);

        if (($scope.fields.newPassword && $scope.fields.newPasswordRepeat)
            && ($scope.fields.newPassword === $scope.fields.newPasswordRepeat)) {
            $scope.showAlert = false;
            $scope.canSubmit = true;
        } else {
            $scope.showAlert = true;
            $scope.canSubmit = false;
        }
    };

    /**
     * Add new user
     */
    $scope.changePassword = function () {
        // Clear alerts
        $scope.alerts = [];

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'user/editUserPassword',
            params: {
                'userId'                       : $scope.fields.userId,
                'oldPassword'                  : $scope.fields.oldPassword,
                'userRequiredVo.password'      : $scope.fields.newPassword,
                'userRequiredVo.userOperatorId': $scope.fields.userOperatorId
            }
        }).then(function successCallback(response) {
            $scope.responseData = response.data;

            if ($scope.responseData.flag === 'failed') {
                addFailAlert($filter('translate')('pages.sm.user.USER_MGMT_ALERTS.USER_MGMT_ALERT_PASSWORD_NOT_CHANGED'));

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            } else {
                // Display an alert
                addSuccessAlert();
                // Disable the form
                $scope.isFormDisabled = true;
                // Close the modal 2 seconds later
                $timeout(function () {
                    $modalInstance.dismiss('cancel');
                }, 2000);
            }

        }, function errorCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            $timeout(function () {
                $modalInstance.dismiss('cancel');
            }, 3000);
        });
    };

    // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    angular.element(function () {
        $scope.fields.userId = shareDataService.common.getSelectedRowItems().userId;
    });

});

app.controller('ChangePasswordModalInstanceCtrl', function ($scope, $modal, $filter, shareDataService, toasterUtils) {
    $scope.showChangePswdPopup = function () {
        var table = angular.element('#tblUsers').DataTable();

        if (table.row('.active').length === 1) {
            shareDataService.common.setSelectedRowItems(table.row('.active').data());

            $modal.open({
                backdrop   : 'static',
                templateUrl: 'changePasswordModal.html',
                controller : 'UserChangePswdModalCtrl',
                size       : 'lg'
            });

        } else {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
        }
    };
});
