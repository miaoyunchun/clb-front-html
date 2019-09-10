'use strict';

app.controller('OrgEditModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService, formUtils) {

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

    $scope.originalOrgCode = $scope.fields.orgCode;

    $scope.stakeholders = shareDataService.org.getStakeholder();

    $scope.isEnabled = shareDataService.org.getIsEnabled();

    $scope.company = shareDataService.org.getLogo();

    var initChosenIntervalTask = $interval(function () {

        // If all 3 select boxes are ready
        if (angular.element('#editOrgPanel').find('select').length === 3) {
            angular.element('#orgPer').val($scope.fields.orgPrincipalId).trigger('chosen:updated');
            angular.element('#isEnabled').val($scope.fields.orgActive).trigger('chosen:updated');
            angular.element('#companyId').val($scope.fields.orgCompanyId).trigger('chosen:updated');

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

    $scope.responseData = {
        flag: '',
        data: {},
        message: ''
    };

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.isFormDisabled = false;

    /**
     * Check if the organization name already exists
     */
    $scope.chkOrgNameExistence = function (inputOrgName) {
        // Only perform the check when input is valid
        // and the new code is different with the original code
        if (inputOrgName.$valid && $scope.fields.orgCode !== $scope.originalOrgCode) {
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
        } else {
            // If the new code is same as the original code
            // then make the input valid
            inputOrgName.$setValidity('codeAvailable', true);
        }
    };

    /**
     * Perform edit
     */
    $scope.edit = function () {
        $http({
            method: 'POST',
            url: CLB_FRONT_BASE_URL + 'org/editOrgs',
            params: formUtils.getFormData(angular.element('#formEditOrg'))
        }).then(function successCallback(response) {
            $scope.responseData = response.data;

            if ($scope.responseData.flag === 'failed') {
                editFailAlert($scope.responseData.message);

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            } else {
                editSuccessAlert();
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
    var editSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg: $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_EDIT_SUCCESSFUL')
        });
    };

    // Alert when operation failed
    var editFailAlert = function (message) {
        if (message === '' || message === null || message === undefined) {
            message = $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_EDIT_FAILED');
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

app.controller('EditOrgModalInstanceCtrl', function ($scope, $modal, $timeout, $filter, toaster, shareDataService) {
    $scope.showEditOrgPopup = function () {
        var table = $('#tblOrganizations').DataTable();

        // If a row is selected
        if (table.row('.active').length === 1) {
            shareDataService.common.setSelectedRowItems(table.row('.active').data());

            $modal.open({
                backdrop: 'static',
                templateUrl: 'editOrgModal.html',
                controller: 'OrgEditModalControl',
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
