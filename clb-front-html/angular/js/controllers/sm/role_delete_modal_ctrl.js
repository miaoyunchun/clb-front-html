'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var RoleDeleteModalControl = function RoleDeleteModalControl($scope, $modalInstance, $filter, $timeout, $http, dataTableUtils, shareDataService) {
    _classCallCheck(this, RoleDeleteModalControl);

    // Initialize data and placeholders
    $scope.placeholders = shareDataService.role.getRolePlaceholders();

    $scope.fields = {
        roleId         : undefined,
        roleName       : undefined,
        roleDescription: undefined,
        status         : undefined,
        position       : undefined,
        roleOperatorId : sessionStorage.getItem('userId')
    };

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.isFormDisabled = false;

    // Alert when operation is successful
    function deleteSuccessAlert() {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.role.ROLE_MGMT_ALERTS.ROLE_MGMT_ALERT_ROLE_DELETE_SUCCESSFUL')
        });
    }

    // Alert when operation failed
    function deleteFailAlert(message) {
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
     * Fill in fields from the selected row in the table
     * @property selectedRowItems The selected row in the table
     * @property selectedRowItems.roleId The ID of the selected role
     * @property selectedRowItems.roleName The name of the selected role
     * @property selectedRowItems.roleDescription The description of the selected role
     * @property selectedRowItems.roleActiveStatus The status of the selected role
     * @property selectedRowItems.posName The name of the associated position of the selected role
     */
    function setFields() {
        var selectedRowItems = shareDataService.common.getSelectedRowItems();

        $scope.fields.roleId = selectedRowItems.roleId;
        $scope.fields.roleName = selectedRowItems.roleName;
        $scope.fields.roleDescription = selectedRowItems.roleDescription;
        $scope.fields.status = selectedRowItems.roleActiveStatus;
        $scope.fields.position = selectedRowItems.posName;
    }

    /**
     * Edit role
     */
    $scope.delete = function () {
        // Clear alerts
        $scope.alerts = [];

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'role/deleteRoleInfo',
            params: {
                'roleId'                       : $scope.fields.roleId,
                'roleRequiredVo.roleOperatorId': $scope.fields.roleOperatorId
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'failed') {
                deleteFailAlert(responseData.message);

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            } else {
                // Display an alert
                deleteSuccessAlert();
                // Disable the form
                $scope.isFormDisabled = true;
                // Refresh the data table
                dataTableUtils.reloadDataTable(angular.element('#tblRoles'));
                // Close the modal 5 seconds later
                $timeout(function () {
                    $modalInstance.dismiss('cancel');
                }, 2000);
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };

    // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    angular.element(function () {
        setFields();
    });
};

var DeleteRoleModalInstanceCtrl = function DeleteRoleModalInstanceCtrl($scope, $modal, $filter, toasterUtils, shareDataService) {
    _classCallCheck(this, DeleteRoleModalInstanceCtrl);

    $scope.showDeleteRolePopup = function () {

        var table = angular.element('#tblRoles').DataTable();

        if (table.row('.active').length === 1) {
            shareDataService.common.setSelectedRowItems(table.row('.active').data());

            $modal.open({
                backdrop   : 'static',
                templateUrl: 'deleteRoleModal.html',
                controller : 'RoleDeleteModalControl',
                size       : 'lg'
            });
        } else {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
        }
    };
};

app.controller('DeleteRoleModalInstanceCtrl', DeleteRoleModalInstanceCtrl);
app.controller('RoleDeleteModalControl', RoleDeleteModalControl);

//# sourceMappingURL=role_delete_modal_ctrl.js.map