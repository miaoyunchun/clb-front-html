'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var ServiceInfoEditModalControl = function ServiceInfoEditModalControl($scope, $modalInstance, $filter, $http, $timeout, shareDataService, dataTableUtils) {
    _classCallCheck(this, ServiceInfoEditModalControl);

    $scope.selectedItem = shareDataService.common.getSelectedRowItems();

    $scope.regexCharactersOnly = shareDataService.common.getCharactersOnlyRegex();

    $scope.language = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

    $scope.organizations = undefined;

    $scope.selectedOrganization = {};

    $scope.fields = {
        svcId             : undefined,
        svcSysName        : undefined,
        svcModuleName     : undefined,
        svcSysAlias       : undefined,
        svcFunctionName   : undefined,
        svcDescriptionZhCn: undefined,
        svcDescriptionEn  : undefined,
        orgId             : undefined,
        svcOperatorId     : sessionStorage.getItem('userId')
    };

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.isFormDisabled = false;

    /**
     * Alert when operation is successful
     */
    function addSuccessAlert() {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_INFO_EDIT_SUCCESSFUL')
        });
    }

    /**
     * Adding red alert box
     * @param {string} message The message
     */
    function addFailAlert(message) {
        $scope.alerts.push({
            type: 'danger',
            msg : message
        });
    }

    /**
     * Close the alert
     * @param index Index of the alert
     * @param isInAddingFieldPanel Is this alert in the adding service panel
     */
    $scope.closeAlert = function (index, isInAddingFieldPanel) {
        if (isInAddingFieldPanel) {
            $scope.alertsInAddingFields.splice(index, 1);
        } else {
            $scope.alerts.splice(index, 1);
        }
    };

    /**
     * Fetch the list of organizations
     */
    function fetchOrganizations() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOrganizationName'
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.organizations = responseData.organizationInfo;

                if (responseData.organizationInfo.length === 1) {
                    $scope.selectedOrganization.orgId = responseData.organizationInfo[0].orgId;
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    /**
     * Perform the initialization AJAXes
     */
    function performInitAjaxes() {
        fetchOrganizations();
    }

    $scope.editService = function (form) {
        $scope.alerts = [];
        $scope.isFormDisabled = true;

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'svc/editeServiceInfo',
            params: {
                'svcId'                               : $scope.fields.svcId,
                'serviceRequiredVo.svcSysName'        : $scope.fields.svcSysName,
                'serviceRequiredVo.svcModuleName'     : $scope.fields.svcModuleName,
                'serviceRequiredVo.svcSysAlias'       : $scope.fields.svcSysAlias,
                'serviceRequiredVo.svcFunctionName'   : $scope.fields.svcFunctionName,
                'serviceRequiredVo.svcDescriptionZhCn': $scope.fields.svcDescriptionZhCn,
                'serviceRequiredVo.svcDescriptionEn'  : $scope.fields.svcDescriptionEn,
                'serviceRequiredVo.orgId'             : $scope.fields.orgId,
                'serviceRequiredVo.svcOperatorId'     : $scope.fields.svcOperatorId,
                'isEdited'                            : form.$dirty
            }
        }).then(function (response) {
            if (response.data.flag === 'success') {
                addSuccessAlert();
                dataTableUtils.reloadDataTable($('#tblServices'));
                $timeout(function () {
                    $modalInstance.dismiss('cancel');
                }, 2000);
            } else {
                $scope.isFormDisabled = false;

                var message = '';
                if ($scope.language === 'zh_CN') {
                    message = response.data.messageZhCn;
                } else if ($scope.language === 'en') {
                    message = response.data.messageEn;
                }

                addFailAlert(message ? message : $filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_INFO_EDIT_FAILED'));
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };

    /**
     * When the organization select box changed
     */
    $scope.orgSelectOnChange = function () {
        $scope.fields.orgId = $scope.selectedOrganization.orgId;
    };

    // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    angular.element(function () {
        $scope.isFormDisabled = true;

        performInitAjaxes();

        $scope.fields.svcId = $scope.selectedItem.svcId;
        $scope.fields.svcSysName = $scope.selectedItem.svcSysName;
        $scope.fields.svcModuleName = $scope.selectedItem.svcModuleName;
        $scope.fields.svcSysAlias = $scope.selectedItem.svcSysAlias;
        $scope.fields.svcFunctionName = $scope.selectedItem.svcFunctionName;
        $scope.fields.svcDescriptionZhCn = $scope.selectedItem.svcDescriptionZhCn;
        $scope.fields.svcDescriptionEn = $scope.selectedItem.svcDescriptionEn;
        $scope.fields.orgId = $scope.selectedItem.orgId;
        $scope.selectedOrganization.orgId = $scope.selectedItem.orgId;

        $scope.isFormDisabled = false;
    });
};

var EditServiceInfoModalInstanceCtrl = function EditServiceInfoModalInstanceCtrl($scope, $modal, $filter, toasterUtils, shareDataService) {
    _classCallCheck(this, EditServiceInfoModalInstanceCtrl);

    $scope.showEditServiceInfoPopup = function () {
        var table = angular.element('#tblServices').DataTable();

        if (table.row('.active').length === 1) {
            shareDataService.common.setSelectedRowItems(table.row('.active').data());

            $modal.open({
                backdrop   : 'static',
                templateUrl: 'editServiceInfoModal.html',
                controller : 'ServiceInfoEditModalControl',
                size       : 'lg'
            });
        } else {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
        }
    };
};

app.controller('EditServiceInfoModalInstanceCtrl', EditServiceInfoModalInstanceCtrl);
app.controller('ServiceInfoEditModalControl', ServiceInfoEditModalControl);

//# sourceMappingURL=service_info_edit_modal_ctrl.js.map