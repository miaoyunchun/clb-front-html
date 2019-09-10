'use strict';

app.controller('OrgAddModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService, formUtils) {

    // Initialize data and placeholders
    $scope.placeholders = shareDataService.org.getPlaceHolders();

    $scope.stakeholders = [{
        userId: '',
        username: ''
    }];

    $scope.fields = {
        orgCode     : undefined,
        orgPrincipal: undefined,
        active      : undefined,
        companyId   : undefined,
        orgName     : undefined,
        orgDes      : undefined,
        orgOperator : sessionStorage.getItem('userId')
    };

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

    var initChosenIntervalTask = $interval(function () {

        // If all 3 select boxes are ready
        if (angular.element('#addOrgPanel').find('select').length === 3) {
            angular.element('#isEnabled').val(1).trigger('chosen:updated');

            $interval.cancel(initChosenIntervalTask);
        }
    }, 100);

    var fixChosenItemIntervalTask = $interval(function () {
        if (angular.element('#orgPer').chosen !== undefined
            && angular.element('#isEnabled').chosen !== undefined
            && angular.element('#companyId').chosen !== undefined) {

            angular.element('#orgPer').chosen({allow_single_deselect: true});
            angular.element('#isEnabled').chosen({allow_single_deselect: true});
            angular.element('#companyId').chosen({allow_single_deselect: true});

            $interval.cancel(fixChosenItemIntervalTask);
        }
    }, 100);

    /**
     * Check if the organization name already exists
     */
    $scope.chkOrgNameExistence = function (inputOrgName) {
        // Only perform the check when input is valid
        if (inputOrgName.$valid) {
            $http({
                method: 'POST',
                url: CLB_FRONT_BASE_URL + 'org/isOrgCodeExisted',
                params: {
                    'orgRequiredVo.orgCode': $scope.fields.orgCode,
                    'isEdited': inputOrgName.$dirty
                }
            }).then(function successCallback(response) {
                $scope.responseData = response.data;

                // 'success' means the organization is not existed
                inputOrgName.$setValidity('codeAvailable', $scope.responseData.flag === 'success');
            })
        }
    };

    /**
     * Add new organization
     */
    $scope.add = function () {
        // Clear alerts
        $scope.alerts = [];

        $http({
            method: 'POST',
            url: CLB_FRONT_BASE_URL + 'org/addNewOrg',
            params: formUtils.getFormData(angular.element('#formAddOrg'))
        }).then(function successCallback(response) {
            $scope.responseData = response.data;

            if ($scope.responseData.flag === 'failed') {
                addFailAlert($scope.responseData.message);

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            } else {
                // Display an alert
                addSuccessAlert();
                // Disable the form
                $scope.isFormDisabled = true;
                // Refresh the data table
                angular.element('#tblOrganizations').DataTable().ajax.reload(null, false);
                // Close the modal 5 seconds later
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
    var addSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg: $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_ADD_SUCCESSFUL')
        });
    };

    // Alert when operation failed
    var addFailAlert = function (message) {
        $scope.alerts.push({
            type: 'danger',
            msg: message
        });
    };

    // Close the alert
    var closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    // $scope.closeAlert = closeAlert;

});

app.controller('AddOrgModalInstanceCtrl', function ($scope, $modal) {
    $scope.showAddOrgPopup = function () {

        $modal.open({
            backdrop: 'static',
            templateUrl: 'addOrgModal.html',
            controller: 'OrgAddModalControl',
            size: 'lg'
        });

    };
});
