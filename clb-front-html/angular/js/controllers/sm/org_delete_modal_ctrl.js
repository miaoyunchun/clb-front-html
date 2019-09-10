'use strict';

app.controller('OrgDeleteModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService) {

    // Prototypes
    $scope.fields = {
        companyName: undefined,
        orgActive: undefined,
        orgActiveId: undefined,
        orgCode: undefined,
        orgCompanyId: undefined,
        orgCreateTime: undefined,
        orgDescription: undefined,
        orgId: undefined,
        orgName: undefined,
        orgPrincipalId: undefined,
        userId: undefined
    };

    // Initialize data and placeholders
    $scope.orgOperator = sessionStorage.getItem('userId');

    $scope.placeholders = shareDataService.org.getPlaceHolders();

    $scope.fields = shareDataService.common.getSelectedRowItems();

    $scope.stakeholders = shareDataService.org.getStakeholder();

    $scope.isEnabled = shareDataService.org.getIsEnabled();

    $scope.company = shareDataService.org.getLogo();

    $scope.responseData = {
        flag: '',
        data: {},
        message: ''
    };

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.isFormDisabled = false;

    // Add new organization
    $scope.remove = function () {
        $http({
            method: 'POST',
            url: CLB_FRONT_BASE_URL + 'org/deleteOrgs',
            params: {
                'orgId': $scope.fields.orgId,
                'orgRequiredVo.orgOperatorId': $scope.orgOperator
            }
        }).then(function successCallback(response) {
            $scope.responseData = response.data;

            if ($scope.responseData.flag === 'failed') {
                deleteFailAlert($scope.responseData.message);

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            } else {
                deleteSuccessAlert();
                $scope.isFormDisabled = true;
                // Refresh the data table
                angular.element('#tblOrganizations').DataTable().ajax.reload(null, false);
                $timeout(function () {
                    $modalInstance.dismiss('cancel');
                }, 2000);
            }

        }, function errorCallback(response) {
            console.error('error ' + response);
            $modalInstance.dismiss('cancel');
        });
    };

    // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // Alert when operation is successful
    var deleteSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg: $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_DELETE_SUCCESSFUL')
        });
    };

    // Alert when operation failed
    var deleteFailAlert = function (message) {
        if (message === '' || message === null || message === undefined) {
            message = $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_DELETE_FAILED');
        }

        $scope.alerts.push({
            type: 'danger',
            msg: message
        });
    };

    // Close the alert
    var closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

});

app.controller('DeleteOrgModalInstanceCtrl', function ($scope, $modal, $timeout, $filter, toaster, shareDataService) {
    $scope.showDeleteOrgPopup = function () {
        var table = $('#tblOrganizations').DataTable();

        // If a row is selected
        if (table.row('.active').length === 1) {
            shareDataService.common.setSelectedRowItems(table.row('.active').data());

            $modal.open({
                backdrop: 'static',
                templateUrl: 'deleteOrgModal.html',
                controller: 'OrgDeleteModalControl',
                size: 'lg'
            });
        } else {
            $timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.common.COMMON_TOAST_TITLES.COMMON_TOAST_TITLE_ERROR'),
                    $filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW')
                );
            }, 0);
        }

    };
});
