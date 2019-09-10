class RoleAddModalControl {
    constructor($scope, $modalInstance, $filter, $timeout, $http, shareDataService) {

        // Initialize data and placeholders
        $scope.placeholders = shareDataService.role.getRolePlaceholders();

        $scope.statuses = undefined;
        $scope.positions = undefined;

        $scope.selectedStatus = {};
        $scope.selectedPos = {};

        $scope.fields = {
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
        function addSuccessAlert() {
            $scope.alerts.push({
                type: 'success',
                msg : $filter('translate')('pages.sm.role.ROLE_MGMT_ALERTS.ROLE_MGMT_ALERT_ROLE_ADD_SUCCESSFUL')
            });
        }

        // Alert when operation failed
        function addFailAlert(message) {
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
                url   : CLB_FRONT_BASE_URL + 'select/queryPosNameWithNoRole'
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
         * Add new role
         */
        $scope.add = () => {
            // Clear alerts
            $scope.alerts = [];

            $http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'role/addNewRoleInfo',
                params: {
                    'roleRequiredVo.roleName'       : $scope.fields.roleName,
                    'roleRequiredVo.roleDescription': $scope.fields.roleDescription,
                    'roleRequiredVo.roleActive'     : $scope.fields.roleActive,
                    'roleRequiredVo.posId'          : $scope.fields.posId,
                    'roleRequiredVo.roleOperatorId' : $scope.fields.roleOperatorId
                }
            }).then((response) => {
                let responseData = response.data;

                if (responseData.flag === 'failed') {
                    addFailAlert(responseData.message);

                    $timeout(function () {
                        closeAlert(0);
                    }, 5000);
                } else {
                    // Display an alert
                    addSuccessAlert();
                    // Disable the form
                    $scope.isFormDisabled = true;
                    // Refresh the data table
                    angular.element('#tblRoles').DataTable().ajax.reload(null, false);
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
            performInitAjaxes();
        });
    }
}

class AddRoleModalInstanceCtrl {
    constructor($scope, $modal) {
        $scope.showAddRolePopup = function () {

            $modal.open({
                backdrop   : 'static',
                templateUrl: 'addRoleModal.html',
                controller : 'RoleAddModalControl',
                size       : 'lg'
            });

        };
    }
}

app.controller('AddRoleModalInstanceCtrl', AddRoleModalInstanceCtrl);
app.controller('RoleAddModalControl', RoleAddModalControl);