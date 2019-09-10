'use strict';

function OptionEditInfoModalControl($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService, toasterUtils, dataTableUtils, arrayUtils, formUtils) {
    const OPERATIONS_COLUMN = '<button class="btn m-b-xs btn-default btn-sm btn-danger btn-addon">' + $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_REMOVE') + '<i class="fa fa-minus"></i></button>';

    var selectedItem = shareDataService.common.getSelectedRowItems();

    $scope.alerts = [];

    $scope.fields = {
        optId         : undefined,
        optName       : undefined,
        optActive     : undefined,
        optDescription: undefined,
        itemKey       : undefined,
        itemValue     : undefined
    };

    $scope.statuses = undefined;
    $scope.selectedStatus = {};

    $scope.items = [];

    $scope.isEditingItem = true;

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
        data        : $scope.items,
        columns     : [
            // Specify which property to pick for the corresponding column
            {data: 'itemKey', visible: true},
            {data: 'itemValue', visible: true},
            {data: 'operations', visible: true, sortable: false}
        ],
        order       : [[1, 'asc']] // Order by the index column ascending
    };

    function selectRowHandler(data) {
        if (data) {
            $scope.fields.itemKey = data.itemKey;
            $scope.fields.itemValue = data.itemValue;
            $scope.isEditingItem = true;
        } else {
            $scope.fields.itemKey = undefined;
            $scope.fields.itemValue = undefined;
            $scope.isEditingItem = false;
        }
    }

    function addSuccessAlert() {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.options.OPTION_MGMT_ALERTS.OPTION_MGMT_ALERT_OPTION_ADD_SUCCESSFUL')
        });
    }

    function addErrorAlert(msg) {
        $scope.alerts.push({
            type: 'danger',
            msg : msg ? msg : $filter('translate')('pages.sm.options.OPTION_MGMT_ALERTS.OPTION_MGMT_ALERT_OPTION_ADD_FAILED')
        });
    }

    function getStatuses() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(
            function successCallback(response) {
                if (response.data.flag === 'success') {
                    $scope.statuses = response.data.active;
                } else {
                    addErrorAlert(response.data.message);
                }
            },
            function errorCallback() {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            }
        );
    }

    function getOptionBoxInfo() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'opt/queryOneOptValue',
            params: {
                optId: $scope.fields.optId
            }
        }).then(
            function successfulCallback(response) {
                if (response.data.flag === 'success') {
                    $scope.fields.optName = response['data']['optInfo']['optName'];
                    $scope.fields.optActive = response['data']['optInfo']['optActive'];
                    $scope.fields.optDescription = response['data']['optInfo']['optDescription'];

                    $scope.selectedStatus.id = String($scope.fields.optActive);

                    $.each(response['data']['optValueInfo'], function(index, item) {
                        $scope.items.push({
                            itemKey   : item['key'],
                            itemValue : item['value'],
                            operations: OPERATIONS_COLUMN
                        });
                    });

                    $('#tblOptionItems').DataTable().clear().rows.add($scope.items).draw();
                } else {
                    addErrorAlert(response.data.message);
                }
            }, function errorCallback() {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            }
        );
    }

    function initialization() {
        $scope.fields.optId = selectedItem.optId;
        getStatuses();

        $timeout(function() {
            getOptionBoxInfo();
            dataTableUtils.enableSingleSelect($('#tblOptionItems'), false, undefined, selectRowHandler);
            attachClickListenerForTable();
        }, 0);
    }

    function isItemKeyExisted(key) {
        var data = $('#tblOptionItems').DataTable().rows().data();

        for (var item in data) {
            if (data.hasOwnProperty(item) && data[item].itemKey === key) {
                return true;
            }
        }

        return false;
    }

    function clearItemFields(form) {
        $scope.fields.itemKey = undefined;
        $scope.fields.itemValue = undefined;

        formUtils.resetValidationStatus(form);
    }

    function attachClickListenerForTable() {
        var table = $('#tblOptionItems');
        var tbody = table.find('tbody');

        var intervalTask = $interval(function() {
            if (table.DataTable && $.fn.DataTable.isDataTable(table.selector)) {
                var dataTable = table.DataTable();

                tbody.off('click', 'button');

                tbody.on('click', 'button', function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var data = $('#tblOptionItems').DataTable().row($(this).parents('tr')).data();
                    var index = arrayUtils.getIndexOfObject($scope.items, data);
                    $scope.items.splice(index, 1);
                    dataTable.clear().rows.add($scope.items).draw();

                    selectRowHandler();
                });

                $interval.cancel(intervalTask);
            }
        }, 100);
    }

    $scope.addItem = function(form) {
        $scope.alerts = [];

        if (isItemKeyExisted($scope.fields.itemKey)) {
            addErrorAlert($filter('translate')('pages.sm.options.OPTION_MGMT_ALERTS.OPTION_MGMT_ALERT_OPTION_ITEM_KEY_DUPLICATE'));
            return;
        }

        var tblOptionItems = $('#tblOptionItems');

        var newItem = {
            itemKey   : $scope.fields.itemKey,
            itemValue : $scope.fields.itemValue,
            operations: OPERATIONS_COLUMN
        };

        $scope.items.push(newItem);

        tblOptionItems.DataTable().clear().rows.add($scope.items).draw();

        attachClickListenerForTable();

        clearItemFields(form);
    };

    $scope.editItem = function(form) {
        var tblOptionItems = $('#tblOptionItems');

        var item = tblOptionItems.DataTable().row('.active').data();
        var index = arrayUtils.getIndexOfObject($scope.items, item);

        $scope.items[index].itemKey = $scope.fields.itemKey;
        $scope.items[index].itemValue = $scope.fields.itemValue;

        tblOptionItems.DataTable().clear().rows.add($scope.items).draw();

        selectRowHandler();

        formUtils.resetValidationStatus(form);
    };

    $scope.submit = function($formEditOption, $formEditFields) {
        $scope.isFormDisabled = true;

        $scope.alerts = [];

        if ($scope.items.length === 0) {
            addErrorAlert($filter('translate')('pages.sm.options.OPTION_MGMT_ALERTS.OPTION_MGMT_ALERT_OPTION_CANNOT_BE_EMPTY'));
            return;
        }

        var optValueStr = '';

        $scope.items.map(function(item) {
            optValueStr += item['itemKey'] + ',' + item['itemValue'] + ';';
        });

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'opt/editOptInfo',
            params: {
                'isEdited'                    : $formEditOption.$dirty || $formEditFields.$dirty||!$scope.isEditingItem,
                'optId'                       : $scope.fields.optId,
                'optRequiredVo.optDescription': $scope.fields.optDescription,
                'optRequiredVo.optActive'     : $scope.fields.optActive,
                'optRequiredVo.optName'       : $scope.fields.optName,
                'optRequiredVo.optValue'      : optValueStr,
                'optRequiredVo.optOperatorId' : sessionStorage.getItem('userId')
            }
        }).then(
            function successfulCallback(response) {
                if (response.data.flag === 'success') {
                    addSuccessAlert();
                    
                    dataTableUtils.reloadDataTable($('#tblOptions'));

                    $timeout(function() {
                        $modalInstance.dismiss('cancel');
                    }, 2000);
                } else {
                    $scope.isFormDisabled = false;
                    addErrorAlert(response.data.message);
                }
            },
            function errorCallback() {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            }
        );
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    angular.element(function() {
        initialization();
    });
}

function EditOptionInfoModalInstanceCtrl($scope, $modal, $filter, toasterUtils, shareDataService) {
    $scope.showEditOptionInfoPopup = function() {
        var table = $('#tblOptions').DataTable();

        if (table.row('.active').length === 1) {
            shareDataService.common.setSelectedRowItems(table.row('.active').data());

            $modal.open({
                backdrop   : 'static',
                templateUrl: 'editOptionInfoModal.html',
                controller : 'OptionEditInfoModalControl',
                size       : 'lg'
            });
        } else {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
        }
    };
}

app.controller('OptionEditInfoModalControl', ['$scope', '$modal', '$modalInstance', '$filter', '$interval', '$timeout', '$http', 'shareDataService', 'toasterUtils', 'dataTableUtils', 'arrayUtils', 'formUtils', OptionEditInfoModalControl]);
app.controller('EditOptionInfoModalInstanceCtrl', ['$scope', '$modal', '$filter', 'toasterUtils', 'shareDataService', EditOptionInfoModalInstanceCtrl]);
