'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var ServiceFieldsEditModalControl = function ServiceFieldsEditModalControl($scope, $modalInstance, $filter, $http, $timeout, $interval, $window, shareDataService, dataTableUtils, objectUtils, toasterUtils) {
    _classCallCheck(this, ServiceFieldsEditModalControl);

    var FIELD_TYPE_SELECT_BOX_ID = 4;
    var DATA_TYPE_SELECT_BOX_ID = 5;

    // language=HTML
    var operationsHtml = '<a class="fa fa-arrow-up" style="padding-right: 15px;"/><a class="fa fa-arrow-down" style="padding-right: 15px;"/><a class="fa fa-times"/>';

    $scope.regexCharactersOnly = shareDataService.common.getCharactersOnlyRegex();

    $scope.selectedRowItems = shareDataService.common.getSelectedRowItems();

    $scope.language = localStorage.getItem('NG_TRANSLATE_LANG_KEY');

    $scope.fieldTypes = undefined;
    $scope.dataTypes = undefined;
    $scope.svcFields = undefined;

    $scope.selectedFieldType = {};
    $scope.selectedDataType = {};
    $scope.selectedSvcField = {};

    $scope.svcName = undefined;

    $scope.isEditing = false;

    $scope.fields = {
        'svcId'               : undefined,
        'svcName'             : undefined,
        'fieldId'             : undefined,
        'fieldName'           : undefined,
        'fieldIOType'         : undefined,
        'fieldType'           : undefined,
        'fieldLength'         : undefined,
        'fieldOrder'          : undefined,
        'fieldDescriptionZhCn': undefined,
        'fieldDescriptionEn'  : undefined,
        'fieldOperatorId'     : sessionStorage.getItem('userId')
    };

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.isFormDisabled = false;

    $scope.dataTableParms = {
        searching : false, // Disable built-in searching
        serverSide: true, // Enables the server-side processing
        processing: true, // Enables the "Processing..." indicator
        autoWidth : false, // Disable column width auto determining
        pagingType: 'full_numbers', // Paging buttons contains "First", "Last", "Previous", "Next", and numbers
        language  : {
            // I18n options, see https://datatables.net/reference/option/ for details
            paginate    : {
                previous: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_PREV_PAGE'),
                next    : $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_NEXT_PAGE'),
                first   : $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_FIRST_PAGE'),
                last    : $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_LAST_PAGE')
            },
            emptyTable  : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_EMPTY_TABLE'),
            info        : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO'),
            infoFiltered: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO_FILTERED'),
            infoEmpty   : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_EMPTY'),
            lengthMenu  : $filter('translate')('pages.common.COMMON_FIELDS.COMMON_FIELD_LENGTH_MENU'),
            processing  : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PROCESSING')
        },
        ajax      : {
            url    : CLB_FRONT_BASE_URL + 'svc/querySvcFieldInfo',
            data   : {
                'svcId': $scope.selectedRowItems.svcId
            },
            dataSrc: 'data',
            type   : 'POST'
        },
        columns   : [{data: 'seq', visible: true}, {data: 'svcId', visible: false}, {data: 'svcName', visible: true}, {data: 'fieldId', visible: false}, {data: 'fieldName', visible: true}, {data: 'fieldIOType', visible: false}, {data: 'fieldIOTypeDesc', visible: true}, {data: 'fieldType', visible: true}, {data: 'fieldLength', visible: true}, {data: 'fieldOrder', visible: false, sortable: false}],
        columnDefs: [{
            targets       : 10,
            data          : null,
            defaultContent: operationsHtml
        }],
        order     : [[0, 'asc']]
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
     * Handles how data is displayed when a row is selected
     * When data contains something, then we assume a row has been selected.
     * And when data is null or undefined, we assume the user performed a de-select.
     * @param data Data of the selected row.
     */
    function selectRowHandler(data) {
        if (data) {
            $scope.fields = Object.assign({}, data);
            $scope.selectedFieldType.key = String($scope.fields.fieldIOType);
            $scope.selectedDataType.item = objectUtils.getPropertyByValue($scope.dataTypes, $scope.fields.fieldType, 'value');
            $scope.selectedSvcField.order = objectUtils.getPropertyByValue($scope.svcFields, $scope.fields.fieldOrder, 'fieldOrder');
            $scope.isEditing = true;
        } else {
            $scope.fields.svcId = undefined;
            $scope.fields.svcName = undefined;
            $scope.fields.fieldId = undefined;
            $scope.fields.fieldName = undefined;
            $scope.fields.fieldIOType = undefined;
            $scope.fields.fieldIOTypeDes = undefined;
            $scope.fields.fieldType = undefined;
            $scope.fields.fieldLength = undefined;
            $scope.fields.fieldOrder = undefined;
            $scope.fields.fieldDescriptionZhCn = undefined;
            $scope.fields.fieldDescriptionEn = undefined;
            $scope.selectedFieldType.key = undefined;
            $scope.selectedDataType.item = undefined;
            $scope.selectedSvcField.order = undefined;
            $scope.isEditing = false;
        }
    }

    /**
     * Alert when operation is successful
     * @param type Type of the alert, add, edit, delete, or other
     * @param message Message for the alert box when the box type is other
     */
    function addSuccessAlert(type, message) {
        switch (type) {
            case 'add':
                $scope.alerts.push({
                    type: 'success',
                    msg : $filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_ADD_SUCCESSFUL')
                });
                break;
            case 'edit':
                $scope.alerts.push({
                    type: 'success',
                    msg : $filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_FIELD_EDIT_SUCCESSFUL')
                });
                break;
            case 'delete':
                $scope.alerts.push({
                    type: 'success',
                    msg : $filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_FIELD_DELETE_SUCCESSFUL')
                });
                break;
            case 'other':
                $scope.alerts.push({
                    type: 'success',
                    msg : message
                });
                break;
        }
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
     */
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    /**
     * Check if the field being inserted is unique
     * @param _fieldName Name of the field being inserted
     * @returns {boolean} True if the field name is NOT unique, otherwise false
     */
    function chkIsFieldNameUnique(_fieldName) {
        var DATA_TYPE_STRING = 'STRING';
        var DATA_TYPE_LIST = 'LIST';

        var data = $('#tblServiceFields').DataTable().rows().data();

        for (var item in data) {
            if (data.hasOwnProperty(item) && data[item].fieldType === DATA_TYPE_STRING && data[item].fieldName === _fieldName) {
                return true;
            }
        }
        return false;
    }

    function moveFieldPosition(fieldId, fieldOrder, svcId) {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'svc/editSvcFieldOrder',
            params: {
                fieldId        : fieldId,
                fieldOrder     : fieldOrder,
                fieldOperatorId: sessionStorage.getItem('userId'),
                svcId          : svcId
            }
        }).then(function (response) {
            if (response.data.flag === 'success') {
                dataTableUtils.reloadDataTable($('#tblServiceFields'));
            } else {
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

    function fetchFieldsForSelectBox() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/querysvcFieldsName',
            params: {
                svcId: $scope.selectedRowItems.svcId
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.svcFields = responseData['svcFieldsName'];
            } else {
                $scope.svcFields = [];
            }

            $scope.svcFields.push({
                svcId     : -1,
                fieldOrder: 'last',
                fieldName : $filter('translate')('pages.sm.service.SERVCE_MGMT_SELECT_ITEMS.SERVICE_MGMT_SELECT_ITEM_POSITION_LAST')
            });

            if ($scope.svcFields.length === 1) {
                $scope.selectedSvcField.order = $scope.svcFields[0].fieldOrder;
                $scope.fields.fieldOrder = $scope.svcFields[0].fieldOrder;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    /**
     * Perform the initialization AJAXes
     */
    function performInitAjaxes() {
        fetchFieldTypes();
        fetchDataTypes();
        fetchFieldsForSelectBox();
    }

    /**
     * Add fields
     */
    $scope.addField = function (form) {
        $scope.alerts = [];

        $scope.isFormDisabled = true;

        if (chkIsFieldNameUnique($scope.fields.fieldName)) {
            addFailAlert($filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_DUPLICATE_FIELD_NAME'));
            $scope.isFormDisabled = false;
            return;
        }

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'svc/addNewSvcFieldWithOne',
            params: {
                'svcId'                                  : $scope.fields.svcId,
                'svcFieldRequiredVo.svcName'             : $scope.fields.svcName,
                'svcFieldRequiredVo.fieldName'           : $scope.fields.fieldName,
                'svcFieldRequiredVo.fieldType'           : $scope.fields.fieldType,
                'svcFieldRequiredVo.fieldLength'         : $scope.fields.fieldLength,
                'svcFieldRequiredVo.fieldIOType'         : $scope.fields.fieldIOType,
                'svcFieldRequiredVo.fieldDescriptionZhCn': $scope.fields.fieldDescriptionZhCn,
                'svcFieldRequiredVo.fieldDescriptionEn'  : $scope.fields.fieldDescriptionEn,
                'svcFieldRequiredVo.fieldOrder'          : $scope.fields.fieldOrder,
                'svcFieldRequiredVo.fieldOperatorId'     : sessionStorage.getItem('userId')
            }
        }).then(function (response) {
            if (response.data.flag === 'success') {
                addSuccessAlert('add');

                $scope.isFormDisabled = false;

                dataTableUtils.reloadDataTable($('#tblServiceFields'));

                fetchFieldsForSelectBox();

                selectRowHandler();
                form.$setPristine();
                form.$setValidity();
            } else {
                $scope.isFormDisabled = false;

                var message = '';
                if ($scope.language === 'zh_CN') {
                    message = response.data['messageZhCn'];
                } else if ($scope.language === 'en') {
                    message = response.data['messageEn'];
                }

                addFailAlert(message ? message : $filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_FIELD_ADD_FAILED'));
            }
        }, function () {
            return false;
        });
    };

    $scope.editField = function (form) {
        $scope.alerts = [];

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'svc/editSvcField',
            params: {
                'fieldId'                                : $scope.fields.fieldId,
                'isEdited'                               : form.$dirty,
                'svcId'                                  : $scope.fields.svcId,
                'svcFieldRequiredVo.svcName'             : $scope.fields.svcName,
                'svcFieldRequiredVo.fieldName'           : $scope.fields.fieldName,
                'svcFieldRequiredVo.fieldType'           : $scope.fields.fieldType,
                'svcFieldRequiredVo.fieldLength'         : $scope.fields.fieldLength,
                'svcFieldRequiredVo.fieldIOType'         : $scope.fields.fieldIOType,
                'svcFieldRequiredVo.fieldDescriptionZhCn': $scope.fields.fieldDescriptionZhCn,
                'svcFieldRequiredVo.fieldDescriptionEn'  : $scope.fields.fieldDescriptionEn,
                'svcFieldRequiredVo.fieldOrder'          : $scope.fields.fieldOrder,
                'svcFieldRequiredVo.fieldOperatorId'     : sessionStorage.getItem('userId')
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                addSuccessAlert('edit');
                dataTableUtils.reloadDataTable($('#tblServiceFields'));
                // Clear fields by "unselecting"
                selectRowHandler();
                // Then reset its validation state
                form.$setPristine();
                form.$setValidity();
            } else {
                if ($scope.language === 'zh_CN') {
                    addFailAlert(responseData['messageZhCn']);
                } else {
                    addFailAlert(responseData['messageEn']);
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };

    /**
     * When the field type select box changed
     */
    $scope.fieldTypeSelectOnChange = function () {
        $scope.fields.fieldIOType = $scope.selectedFieldType.key;
    };

    /**
     * When the data type select box changed
     */
    $scope.dataTypeSelectOnChange = function () {
        $scope.fields.fieldType = $scope.selectedDataType.item.value;
    };

    $scope.svcFieldSelectOnChange = function () {
        $scope.fields.fieldOrder = $scope.selectedSvcField.order;
    };

    // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    angular.element(function () {
        performInitAjaxes();

        $scope.fields.svcId = $scope.selectedRowItems.svcId;
        $scope.fields.svcName = $scope.selectedRowItems.svcName;

        $timeout(function () {
            var table = $('#tblServiceFields');
            dataTableUtils.enableSingleSelect(table, true, formatChildRow, selectRowHandler);

            var dataTable = void 0;

            var intervalTask = $interval(function () {
                if ($.fn.dataTable.isDataTable(table)) {
                    dataTable = table.DataTable();
                    $interval.cancel(intervalTask);
                }
            }, 100);

            // Move upwards
            table.find('tbody').on('click', 'a.fa-arrow-up', function (e) {
                e.stopPropagation();
                e.preventDefault();

                $scope.alerts = [];

                var previousRow = $(this).parents('tr').prev();

                if (previousRow.length !== 0) {
                    var data = dataTable.row($(this).parents('tr')).data();
                    var previousRowData = dataTable.row($(this).parents('tr').prev()).data();

                    var svcId = data.svcId;
                    var fieldId = data.fieldId;
                    var fieldOrder = previousRowData.fieldOrder;

                    moveFieldPosition(fieldId, fieldOrder, svcId);
                } else {
                    $timeout(function () {
                        addFailAlert($filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_CANNOT_MOVE_UPWARD'));
                    }, 0);
                }
            });

            // Move downwards
            table.find('tbody').on('click', 'a.fa-arrow-down', function (e) {
                e.stopPropagation();
                e.preventDefault();

                $scope.alerts = [];

                var nextRow = $(this).parents('tr').next();

                if (nextRow.length !== 0) {

                    var data = dataTable.row($(this).parents('tr')).data();

                    var nextNextRow = nextRow.next();
                    if (nextNextRow.length !== 0) {
                        // If there is a row below its next row
                        // Get that row's order number
                        // and move

                        var targetData = dataTable.row(nextNextRow).data();

                        var fieldId = data.fieldId;
                        var fieldOrder = targetData.fieldOrder;
                        var svcId = data.svcId;

                        moveFieldPosition(fieldId, fieldOrder, svcId);
                    } else {
                        // If there is nothing below its next row
                        // Move this row to the "last" position

                        var _fieldId = data.fieldId;
                        var _fieldOrder = 'last';
                        var _svcId = data.svcId;

                        moveFieldPosition(_fieldId, _fieldOrder, _svcId);
                    }
                } else {
                    $timeout(function () {
                        addFailAlert($filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_CANNOT_MOVE_DOWNWARD'));
                    }, 0);
                }
            });

            // Delete
            table.find('tbody').on('click', 'a.fa-times', function (e) {
                e.stopPropagation();
                e.preventDefault();

                $scope.alerts = [];

                var confirmDelete = $window.confirm($filter('translate')('pages.sm.service.SERVICE_MGMT_NOTIFICATIONS.SERVICE_MGMT_NOTIFICATION_DELETE_FIELD_CONFIRMATION'));

                if (confirmDelete) {
                    var data = dataTable.row($(this).parents('tr')).data();

                    $http({
                        method: 'POST',
                        url   : CLB_FRONT_BASE_URL + 'svc/deleteSvcFieldInfo',
                        params: {
                            'fieldId'                           : data.fieldId,
                            'svcFieldRequiredVo.fieldOperatorId': sessionStorage.getItem('userId')
                        }
                    }).then(function (response) {
                        var responseData = response.data;

                        if (responseData.flag === 'success') {
                            addSuccessAlert('delete');
                            dataTableUtils.reloadDataTable($('#tblServiceFields'));
                            fetchFieldsForSelectBox();
                        } else {
                            if ($scope.language === 'zh_CN') {
                                addFailAlert(responseData['messageZhCn']);
                            } else {
                                addFailAlert(responseData['messageEn']);
                            }
                        }
                    }, function () {
                        toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
                    });
                }
            });
        }, 0);
    });
};

var EditServiceFieldsModalInstanceCtrl = function EditServiceFieldsModalInstanceCtrl($scope, $modal, $filter, shareDataService, toasterUtils) {
    _classCallCheck(this, EditServiceFieldsModalInstanceCtrl);

    $scope.showEditServiceFieldsPopup = function () {

        var table = $('#tblServices').DataTable();

        if (table.row('.active').length === 1) {
            shareDataService.common.setSelectedRowItems(table.row('.active').data());

            $modal.open({
                backdrop   : 'static',
                templateUrl: 'editServiceFieldsModal.html',
                controller : 'ServiceFieldsEditModalControl',
                size       : 'lg'
            });
        } else {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
        }
    };
};

app.controller('EditServiceFieldsModalInstanceCtrl', EditServiceFieldsModalInstanceCtrl);
app.controller('ServiceFieldsEditModalControl', ServiceFieldsEditModalControl);

//# sourceMappingURL=service_edit_fields_modal_ctrl.js.map