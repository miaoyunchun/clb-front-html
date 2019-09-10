'use strict';

app.controller('UserDeleteModalCtrl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService, toasterUtils) {

    $scope.regexUsername = shareDataService.common.getRegexUsername();
    $scope.regexTelNbr = shareDataService.common.getRegexTelNbr();

    // Initialize data and placeholders
    $scope.placeholders = shareDataService.org.getPlaceHolders();
    $scope.organizations = undefined;
    $scope.departments = undefined;
    $scope.positions = undefined;
    $scope.status = undefined;

    // Models
    $scope.selectedStatus = {};
    $scope.selectedOrg = {};
    $scope.selectedDep = {};
    $scope.selectedPos = {};

    $scope.fields = {
        userId        : undefined,
        username      : undefined,
        telNbr        : undefined,
        status        : undefined,
        orgName       : undefined,
        depName       : undefined,
        posName       : undefined,
        userOperatorId: sessionStorage.getItem('userId')
    };

    $scope.responseData = {
        flag   : '',
        data   : {},
        message: ''
    };

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.isFormDisabled = false;

    $scope.isOrgSelectDisabled = false;
    $scope.isDepSelectDisabled = false;
    $scope.isPosSelectDisabled = false;

    /**
     * Fetch positions with given parameters
     * @param orgId ID of associated organization
     * @param depId ID of associated department
     */
    var fetchPositions = function (orgId, depId) {
        $scope.isPosSelectDisabled = true;

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryPositionName',
            params: {
                orgId: orgId ? orgId : undefined,
                depId: depId ? depId : undefined
            }
        }).then(function successCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.positions = responseData.posInfo;

                if ($scope.positions.length === 1) {
                    $scope.selectedPos.selected = $scope.positions[0];
                    $scope.fields.posId = $scope.selectedPos.selected.posId;
                }
            }

            $scope.isPosSelectDisabled = false;
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            $scope.isPosSelectDisabled = false;
        });
    };

    /**
     * Fetch departments with given parameters
     * @param orgId ID of associated organization
     * @param posId ID of associated position
     */
    var fetchDepartments = function (orgId, posId) {
        $scope.isDepSelectDisabled = true;

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryDepartmentName',
            params: {
                orgId: orgId ? orgId : undefined,
                posId: posId ? posId : undefined
            }
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.departments = responseData.departmentInfo;

                if ($scope.departments.length === 1) {
                    $scope.selectedDep.selected = $scope.departments[0];
                    $scope.fields.depId = $scope.selectedDep.selected.depId;
                }
            }

            $scope.isDepSelectDisabled = false;
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            $scope.isDepSelectDisabled = false;
        });
    };

    /**
     * Fetch organizations with given paramenters
     * @param posId ID of associated position
     * @param depId ID of associated department
     */
    var fetchOrganizations = function (posId, depId) {
        $scope.isOrgSelectDisabled = true;

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOrganizationName',
            params: {
                posId: posId ? posId : undefined,
                depId: depId ? depId : undefined
            }
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.organizations = responseData.organizationInfo;

                if ($scope.organizations.length === 1) {
                    $scope.selectedOrg.selected = $scope.organizations[0];
                    $scope.fields.orgId = $scope.selectedOrg.selected.orgId;
                }
            }

            $scope.isOrgSelectDisabled = false;
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            $scope.isOrgSelectDisabled = false;
        });
    };

    var performInitialAjaxes = function () {

        // Fetch positions
        fetchPositions(undefined, undefined);

        // Fetch departments
        fetchDepartments(undefined, undefined);

        // Fetch organizations
        fetchOrganizations(undefined, undefined);

        // Fetch status
        $http({
            method: 'GET',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.status = responseData.active;

                // $scope.selectedStatus.selected = $scope.status[1];
                //
                $scope.statusSelectOnChange();
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };

    // Alert when operation is successful
    var addSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.user.USER_MGMT_ALERTS.USER_MGMT_ALERT_USER_DELETE_SUCCESSFUL')
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

    $scope.statusSelectOnChange = function () {
        $scope.fields.userActive = $scope.selectedStatus.selected;
    };

    $scope.orgIdSelectOnChange = function () {
        var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected : undefined;
        var posId = $scope.selectedPos.selected ? $scope.selectedPos.selected : undefined;
        var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected : undefined;

        fetchDepartments(orgId, posId);
        fetchPositions(orgId, depId);

        $scope.fields.orgId = $scope.selectedOrg.selected;
    };

    $scope.depIdSelectOnChange = function () {
        var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected : undefined;
        var posId = $scope.selectedPos.selected ? $scope.selectedPos.selected : undefined;
        var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected : undefined;

        fetchOrganizations(posId, depId);
        fetchPositions(orgId, depId);

        $scope.fields.depId = $scope.selectedDep.selected;
    };

    $scope.posIdSelectOnChange = function () {
        var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected : undefined;
        var posId = $scope.selectedPos.selected ? $scope.selectedPos.selected : undefined;
        var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected : undefined;

        fetchOrganizations(posId, depId);
        fetchDepartments(orgId, posId);

        $scope.fields.posId = $scope.selectedPos.selected;
    };

    $scope.clearSelect = function () {
        $scope.selectedOrg.selected = undefined;
        $scope.selectedDep.selected = undefined;
        $scope.selectedPos.selected = undefined;

        performInitialAjaxes();
    };

    $scope.clearStatusSelect = function () {
        $scope.selectedStatus.selected = undefined;
        $scope.fields.userActive = undefined;
    };

    /**
     * Check if the organization name already exists
     */
    $scope.chkUsernameExistence = function (inputUsername) {

        if ($scope.fields.username === $scope.originalUserName) {
            inputUsername.$setValidity('usernameAvailable', true);
            $scope.alerts = [];
            return;
        }

        $scope.alerts = [];

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'user/isUserNameExisted',
            params: {
                'userRequiredVo.username': $scope.fields.username,
                'isEdited'               : inputUsername.$dirty
            }
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            inputUsername.$setValidity('usernameAvailable', responseData.flag === 'success');
            if (responseData.flag !== 'success') {
                addFailAlert($filter('translate')('pages.sm.user.USER_MGMT_ALERTS.USER_MGMT_ALERT_INVALID_USERNAME'));
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };

    /**
     * Delete user
     */
    $scope.delete = function () {
        // Clear alerts
        $scope.alerts = [];

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'user/deleteUserInfo',
            params: {
                'userId'                       : $scope.fields.userId,
                'userRequiredVo.userOperatorId': $scope.fields.userOperatorId
            }
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
                angular.element('#tblUsers').DataTable().ajax.reload(null, false);
                // Close the modal 5 seconds later
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

    /**
     * Load data after the page is ready
     *
     * @param selectedRowItems The selected row in the DataTables
     * @param selectedRowItems.userId User ID
     * @param selectedRowItems.username Username
     * @param selectedRowItems.phoneNumber Telephone number
     * @param selectedRowItems.userActiveStatus The status text
     * @param selectedRowItems.orgName Name of the associated organization
     * @param selectedRowItems.depName Name of the associated department
     * @param selectedRowItems.posName Name of the associated position
     */
    angular.element(
        function () {
            performInitialAjaxes();

            var selectedRowItems = shareDataService.common.getSelectedRowItems();

            $scope.fields.userId = selectedRowItems.userId;
            $scope.fields.username = selectedRowItems.username;
            $scope.fields.phoneNumber = selectedRowItems.phoneNumber;
            $scope.fields.status = selectedRowItems.userActiveStatus;
            $scope.fields.orgName = selectedRowItems.orgName;
            $scope.fields.depName = selectedRowItems.depName;
            $scope.fields.posName = selectedRowItems.posName;

            $scope.posIdSelectOnChange();
        });

});

app.controller('DeleteUserModalInstanceCtrl', function ($scope, $modal, $filter, toasterUtils, shareDataService) {
    $scope.showEditUserPopup = function () {
        var table = angular.element('#tblUsers').DataTable();

        if (table.row('.active').length === 1) {
            shareDataService.common.setSelectedRowItems(table.row('.active').data());

            // debugger;

            $modal.open({
                backdrop   : 'static',
                templateUrl: 'deleteUserModal.html',
                controller : 'UserDeleteModalCtrl',
                size       : 'lg'
            });
        } else {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
        }
    };
});
