'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var ServiceAddModalControl = function ServiceAddModalControl($scope, $modalInstance, $filter, $http, $timeout, shareDataService, dataTableUtils) {
    _classCallCheck(this, ServiceAddModalControl);

    var FIELD_TYPE_SELECT_BOX_ID = 4;
    var DATA_TYPE_SELECT_BOX_ID = 5;

    $scope.regexCharactersOnly = shareDataService.common.getCharactersOnlyRegex();

    $scope.language = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

    $scope.organizations = undefined;
    $scope.fieldTypes = undefined;
    $scope.dataTypes = undefined;

    $scope.selectedOrganization = {};
    $scope.selectedFieldType = {};
    $scope.selectedDataType = {};

    $scope.svcName = undefined;

    $scope.fields = {
        svcSysName        : undefined,
        svcModuleName     : undefined,
        svcSysAlias       : undefined,
        svcFunctionName   : undefined,
        svcDescriptionZhCn: undefined,
        svcDescriptionEn  : undefined,
        orgId             : undefined,
        svcOperatorId     : sessionStorage.getItem('userId')
    };

    $scope.svcFieldItem = {
        svcName             : undefined,
        fieldOrder          : undefined,
        fieldName           : undefined,
        fieldType           : undefined,
        fieldLength         : 1,
        fieldIOType         : undefined,
        fieldIOTypeDes      : undefined,
        fieldDescriptionZhCn: undefined,
        fieldDescriptionEn  : undefined,
        fieldOperatorId     : sessionStorage.getItem('userId'),
        fieldOperations     : '<button class="btn m-b-xs btn-default btn-sm btn-danger btn-addon">' + $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_REMOVE') + '<i class="fa fa-minus"></i></button>'
    };

    $scope.svcFieldItems = [];

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.alertsInAddingFields = [];

    $scope.isFormDisabled = false;

    $scope.isTableHidden = true;

    $scope.dataTableParms = {
        searching   : false, // Disable built-in searching
        serverSide  : false, // Enables the server-side processing
        processing  : true, // Enables the "Processing..." indicator
        autoWidth   : false, // Disable column width auto determining
        pageLength  : -1, // Display all items
        lengthChange: false, // Disable changing page length
        paging      : false, // Disable paging
        language    : {
            // I18n options, see https://datatables.net/reference/option/ for details
            emptyTable  : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_EMPTY_TABLE'),
            info        : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO'),
            infoFiltered: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO_FILTERED'),
            infoEmpty   : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_EMPTY')
        },
        data        : $scope.svcFieldItems,
        columns     : [{
            className     : 'details-control',
            orderable     : false,
            data          : null,
            defaultContent: ''
        },
            // Specify which property to pick for the corresponding column
            {data: 'fieldOrder', visible: true}, {data: 'fieldName', visible: true}, {data: 'fieldType', visible: true}, {data: 'fieldIOType', visible: false}, {data: 'fieldIOTypeDes', visible: true}, {data: 'fieldLength', visible: true}, {data: 'fieldOperations', visible: true}],
        order       : [[1, 'asc']], // Order by the index column ascending
        rowReorder  : {
            enable  : true, // Enable drag-and-drop re-ordering
            update  : true, // Disable updating after re-ordered
            selector: 'td:nth-child(2)', // Drag handler is on the 2nd column of the table
            dataSrc : 'fieldOrder' // Update the index after re-ordering
        }
    };

    /**
     * Generates the child row for the selected row
     * @param data Data of the selected row
     * @returns {string} The HTML of the child row
     */
    function formatChildRow(data) {
        return '<div class="col-lg-6 form-group">' + '<h5>' + $filter('translate')('pages.sm.service.SERVICE_MGMT_COLUMN_TITLES.SERVICE_MGMT_COLUMN_TITLE_DESCRIPTION_ZH_CN') + '</h5>' + '<div id="descZhCn" class="well b bg-light lter wrapper-sm">' + data.fieldDescriptionZhCn + '</div>' + '</div>' + '<div class="col-lg-6 form-group">' + '<h5>' + $filter('translate')('pages.sm.service.SERVICE_MGMT_COLUMN_TITLES.SERVICE_MGMT_COLUMN_TITLE_DESCRIPTION_EN') + '</h5>' + '<div id="descEn" class="well b bg-light lter wrapper-sm">' + data.fieldDescriptionEn + '</div>' + '</div>';
    }

    /**
     * Alert when operation is successful
     */
    function addSuccessAlert() {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_ADD_SUCCESSFUL')
        });
    }

    /**
     * Adding red alert box
     * @param {string} message The message
     * @param {boolean} isInAddingFieldPanel Is this alert box for the adding field panel
     */
    function addFailAlert(message, isInAddingFieldPanel) {
        if (isInAddingFieldPanel) {
            $scope.alertsInAddingFields.push({
                type: 'danger',
                msg : message
            });
        } else {
            $scope.alerts.push({
                type: 'danger',
                msg : message
            });
        }
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
     * Check if the field being inserted is unique
     * @param _fieldName Name of the field being inserted
     * @returns {boolean} True if the field name is NOT unique, otherwise false
     */
    function chkIsFieldNameUnique(_fieldName) {
        var DATA_TYPE_STRING = '1';
        var DATA_TYPE_LIST = '2';

        var data = $('#tblServiceFields').DataTable().rows().data();

        for (var item in data) {
            if (data.hasOwnProperty(item) && data[item].fieldType === DATA_TYPE_STRING && data[item].fieldName === _fieldName) {
                return true;
            }
        }
        return false;
    }

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
     * Fetch the list of field types such as input field, output field, and I/O field
     * @property responseData The data part of the response
     * @property responseData.optValueList[] Items inside the specified option
     * @property responseData.optValueList[].key Key of the option item
     * @property responseData.optValueList[].value Value of the option
     */
    function fetchFieldTypes() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: FIELD_TYPE_SELECT_BOX_ID
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.fieldTypes = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    /**
     * Fetch the list of data types, like STRING or LIST
     */
    function fetchDataTypes() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: DATA_TYPE_SELECT_BOX_ID
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.dataTypes = responseData.optValueList;
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
        fetchFieldTypes();
        fetchDataTypes();
    }

    /**
     * Add a service. If success, add fields then
     */
    $scope.performAddService = function () {
        $scope.alertsInAddingFields = [];
        $scope.isFormDisabled = true;

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'svc/addNewServiceInfo',
            params: {
                'serviceRequiredVo.svcSysName'        : $scope.fields.svcSysName,
                'serviceRequiredVo.svcModuleName'     : $scope.fields.svcModuleName,
                'serviceRequiredVo.svcSysAlias'       : $scope.fields.svcSysAlias,
                'serviceRequiredVo.svcFunctionName'   : $scope.fields.svcFunctionName,
                'serviceRequiredVo.svcDescriptionZhCn': $scope.fields.svcDescriptionZhCn,
                'serviceRequiredVo.svcDescriptionEn'  : $scope.fields.svcDescriptionEn,
                'serviceRequiredVo.orgId'             : $scope.fields.orgId,
                'serviceRequiredVo.svcOperatorId'     : $scope.fields.svcOperatorId
            }
        }).then(function (response) {
            if (response.data.flag === 'success') {
                return $scope.performAddServiceFields();
            } else {
                $scope.isFormDisabled = false;

                var message = '';
                if ($scope.language === 'zh_CN') {
                    message = response.data.messageZhCn;
                } else if ($scope.language === 'en') {
                    message = response.data.messageEn;
                }

                addFailAlert(message ? message : $filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_ADD_FAILED'), true);
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            return false;
        });
    };

    /**
     * Add fields
     */
    $scope.performAddServiceFields = function () {
        var jsonStr = JSON.stringify($scope.svcFieldItems);

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'svc/addNewFieldsWithBatch',
            params: {
                svcName   : [$scope.fields.svcSysName, $scope.fields.svcModuleName, $scope.fields.svcSysAlias, $scope.fields.svcFunctionName].join('.'),
                fieldsJson: jsonStr
            }
        }).then(function (response) {
            if (response.data.flag === 'success') {
                addSuccessAlert();

                $scope.isFormDisabled = true;

                dataTableUtils.reloadDataTable($('#tblService'));

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

                addFailAlert(message ? message : $filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_ADD_FAILED'), true);
            }
        }, function () {
            return false;
        });
    };

    /**
     * When the organization select box changed
     */
    $scope.orgSelectOnChange = function () {
        $scope.fields.orgId = $scope.selectedOrganization.orgId;
    };

    /**
     * When the field type select box changed
     */
    $scope.fieldTypeSelectOnChange = function () {
        $scope.svcFieldItem.fieldIOType = $scope.selectedFieldType.item.key;
        $scope.svcFieldItem.fieldIOTypeDes = $scope.selectedFieldType.item.value;
    };

    /**
     * When the data type select box changed
     */
    $scope.dataTypeSelectOnChange = function () {
        $scope.svcFieldItem.fieldType = $scope.selectedDataType.item.value;
    };

    // $scope.addService = () => {
    //     if (performAddService()) {
    //         addSuccessAlert();
    //     } else {
    //         addFailAlert($filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_ADD_FAILED'), true);
    //     }
    // };

    /**
     * When the add field button clicked
     * @param form The form of adding fields
     */
    $scope.addField = function (form) {
        var dataTableSelector = $('#tblServiceFields');
        var dataTable = dataTableSelector.DataTable();

        $scope.alertsInAddingFields = [];

        if (chkIsFieldNameUnique($scope.svcFieldItem.fieldName)) {
            addFailAlert($filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_DUPLICATE_FIELD_NAME'), true);
            return;
        }

        $scope.svcFieldItem.fieldOrder = dataTableUtils.getLastIndex(angular.element('#tblServiceFields')) + 1;

        $scope.svcFieldItems.push(Object.assign({}, $scope.svcFieldItem));

        // Clear fields after successsfully inserted
        $scope.svcFieldItem.fieldOrder = undefined;
        $scope.svcFieldItem.fieldName = undefined;
        $scope.svcFieldItem.fieldType = undefined;
        $scope.svcFieldItem.fieldLength = 1;
        $scope.svcFieldItem.fieldIOType = undefined;
        $scope.svcFieldItem.fieldIOTypeDes = undefined;
        $scope.svcFieldItem.fieldDescriptionZhCn = undefined;
        $scope.svcFieldItem.fieldDescriptionEn = undefined;
        $scope.selectedFieldType = {};
        $scope.selectedDataType = {};

        // Then reset its validation state
        form.$setPristine();
        form.$setValidity();

        angular.element('#tblServiceFields').DataTable().clear().rows.add($scope.svcFieldItems).draw();

        dataTableSelector.find('tr').find('td.details-control').removeClass('details-control').addClass('fa fa-plus');

        var tbody = dataTableSelector.find('tbody');

        // Cancel all listeners before binding any
        tbody.off();

        // Bind click listener on the delete button
        tbody.on('click', 'button', function () {
            var data = dataTable.row($(this).parents('tr')).data();

            if ($scope.svcFieldItems.length > 1) {
                $scope.svcFieldItems.splice(data.fieldOrder, 1);
            } else {
                $scope.svcFieldItems = [];
            }

            dataTable.clear().rows.add($scope.svcFieldItems).draw();
        });

        // Bind click listener on the details button
        tbody.on('click', 'td.fa', function () {
            var td = $(this).closest('td');
            var tr = td.closest('tr');
            var row = dataTable.row(tr);

            if (row.child.isShown()) {
                row.child.hide();
                td.removeClass('fa-minus').addClass('fa-plus');
            } else {
                row.child(formatChildRow(row.data())).show();
                td.removeClass('fa-plus').addClass('fa-minus');
            }
        });
    };

    // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    angular.element(function () {
        performInitAjaxes();

        var dataTable = angular.element('#tblServiceFields');
        dataTableUtils.enableIndexColumn(dataTable);
    });
};

var AddServiceModalInstanceCtrl = function AddServiceModalInstanceCtrl($scope, $modal) {
    _classCallCheck(this, AddServiceModalInstanceCtrl);

    $scope.showAddServicePopup = function () {
        $modal.open({
            backdrop   : 'static',
            templateUrl: 'addServiceModal.html',
            controller : 'ServiceAddModalControl',
            size       : 'lg'
        });
    };
};

app.controller('AddServiceModalInstanceCtrl', AddServiceModalInstanceCtrl);
app.controller('ServiceAddModalControl', ServiceAddModalControl);

//# sourceMappingURL=service_add_modal_ctrl.js.map