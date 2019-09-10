class RoleEditModalControl {
    constructor($scope, $modalInstance, $filter, $timeout, $http, toasterUtils, dataTableUtils, shareDataService) {

        // Initialize data and placeholders
        $scope.placeholders = shareDataService.role.getRolePlaceholders();

        $scope.statuses = undefined;
        $scope.positions = undefined;

        $scope.selectedStatus = {};
        $scope.selectedPos = {};

        $scope.fields = {
            roleId         : undefined,
            roleName       : undefined,
            roleDescription: undefined,
            roleActive     : undefined,
            posId          : undefined,
            roleOperatorId : sessionStorage.getItem('userId')
        };

        $scope.alerts = [
            // { type: 'danger', msg: '' }
        ];

        $scope.isFormDisabled = false;

        // Alert when operation is successful
        function editSuccessAlert() {
            $scope.alerts.push({
                type: 'success',
                msg : $filter('translate')('pages.sm.role.ROLE_MGMT_ALERTS.ROLE_MGMT_ALERT_ROLE_EDIT_SUCCESSFUL')
            });
        }

        // Alert when operation failed
        function editFailAlert(message) {
            $scope.alerts.push({
                type: 'danger',
                msg : message
            });
        }

        // Close the alert
        function closeAlert(index) {
            $scope.alerts.splice(index, 1);
        }

        /**
         * Fetch statuses and its ID
         */
        function fetchStatuses() {
            $http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'select/queryActive'
            }).then((response) => {
                let responseData = response.data;

                if (responseData.flag === 'success') {
                    $scope.statuses = responseData.active;

                    if (responseData.active.length === 1) {
                        $scope.selectedStatus.value = responseData.active[0].value;
                    }
                }
            }, () => {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            });
        }

        function fetchPosWithNoRole() {
            $http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'select/queryPosNameWithNoRole',
                params: {
                    'roleId': $scope.fields.roleId
                }
            }).then((response) => {
                let responseData = response.data;

                if (responseData.flag === 'success') {
                    $scope.positions = responseData.posInfo;

                    if (responseData.posInfo.length === 1) {
                        $scope.selectedPos.posId = responseData.posInfo[0].value;
                    }
                }
            }, () => {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            });
        }

        function performInitAjaxes() {
            fetchStatuses();
            fetchPosWithNoRole();
        }

        $scope.statusSelectOnChange = () => {
            $scope.fields.roleActive = $scope.selectedStatus.value;
        };

        $scope.posIdSelectOnChange = () => {
            $scope.fields.posId = $scope.selectedPos.id;
        };

        /**
         * Edit role
         */
        $scope.edit = (formEditRole) => {
            // Clear alerts
            $scope.alerts = [];

            $http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'role/editRoleInfo',
                params: {
                    'roleId'                        : $scope.fields.roleId,
                    'isEdited'                      : formEditRole.$dirty,
                    'roleRequiredVo.roleName'       : $scope.fields.roleName,
                    'roleRequiredVo.roleDescription': $scope.fields.roleDescription,
                    'roleRequiredVo.roleActive'     : $scope.fields.roleActive,
                    'roleRequiredVo.posId'          : $scope.fields.posId,
                    'roleRequiredVo.roleOperatorId' : $scope.fields.roleOperatorId
                }
            }).then((response) => {
                let responseData = response.data;

                if (responseData.flag === 'failed') {
                    editFailAlert(responseData.message);

                    $timeout(function () {
                        closeAlert(0);
                    }, 5000);
                } else {
                    // Display an alert
                    editSuccessAlert();
                    // Disable the form
                    $scope.isFormDisabled = true;
                    // Refresh the data table
                    dataTableUtils.reloadDataTable(angular.element('#tblRoles'));
                    // Close the modal 5 seconds later
                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 2000);
                }

            }, () => {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            });
        };

        // Close modal
        $scope.cancel = () => {
            $modalInstance.dismiss('cancel');
        };

        angular.element(() => {
            let selectedRowItems = shareDataService.common.getSelectedRowItems();

            $scope.fields.roleId = selectedRowItems.roleId;
            $scope.fields.roleName = selectedRowItems.roleName;
            $scope.fields.roleDescription = selectedRowItems.roleDescription;
            $scope.fields.roleActive = selectedRowItems.roleActive;
            $scope.fields.posId = selectedRowItems.posId;

            $scope.selectedPos.id = $scope.fields.posId;
            $scope.selectedStatus.value = String($scope.fields.roleActive);

            performInitAjaxes();
        });
    }
}

class EditRoleModalInstanceCtrl {
    constructor($scope, $modal, $filter, toasterUtils, shareDataService) {
        $scope.showEditRolePopup = () => {

            let table = angular.element('#tblRoles').DataTable();

            if (table.row('.active').length === 1) {
                shareDataService.common.setSelectedRowItems(table.row('.active').data());

                $modal.open({
                    backdrop   : 'static',
                    templateUrl: 'editRoleModal.html',
                    controller : 'RoleEditModalControl',
                    size       : 'lg'
                });
            } else {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
            }
        };
    }
}

app.controller('EditRoleModalInstanceCtrl', EditRoleModalInstanceCtrl);
app.controller('RoleEditModalControl', RoleEditModalControl);