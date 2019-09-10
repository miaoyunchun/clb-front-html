'use strict';

function OptionAddModalControl ($scope, $modalInstance, $filter, $http, $timeout, shareDataService, dataTableUtils, arrayUtils, formUtils) {

    const OPERATIONS_COLUMN = '<button class="btn m-b-xs btn-default btn-sm btn-danger btn-addon">' + $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_REMOVE') + '<i class="fa fa-minus"></i></button>';

    $scope.statuses = undefined;
    $scope.selectedStatus = {};

    $scope.fields = {
        optName       : undefined,
        optValue      : undefined,
        optActive     : undefined,
        optDescription: undefined
    };

    $scope.alerts = [];

    $scope.items = [];

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
        order       : [[0, 'asc']], // Order by the index column ascending
        rowReorder  : {
            enable  : true, // Enable drag-and-drop re-ordering
            update  : false, // Disable updating after re-ordered
            selector: 'td:nth-child(1)' // Drag handler is on the 2nd column of the table
        }
    };

    function addSuccessAlert () {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.options.OPTION_MGMT_ALERTS.OPTION_MGMT_ALERT_OPTION_ADD_SUCCESSFUL')
        });
    }

    function addErrorAlert (msg) {
        $scope.alerts.push({
            type: 'danger',
            msg : msg ? msg : $filter('translate')('pages.sm.options.OPTION_MGMT_ALERTS.OPTION_MGMT_ALERT_OPTION_ADD_FAILED')
        });
    }

    function getStatuses () {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(
            function successCallback (response) {
                if (response.data.flag === 'success') {
                    $scope.statuses = response.data.active;
                } else {
                    addErrorAlert(response.data.message);
                }
            },
            function errorCallback () {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            });
    }

    function isItemKeyExisted (key) {
        var data = $('#tblOptionItems').DataTable().rows().data();

        for (var item in data) {
            if (data.hasOwnProperty(item) && data[item].itemKey === key) {
                return true;
            }
        }

        return false;
    }

    function clearItemFields (form) {
        $scope.fields.itemKey = undefined;
        $scope.fields.itemValue = undefined;

        formUtils.resetValidationStatus(form);
    }

    function attachClickListenerForTable () {
        var table = $('#tblOptionItems');
        var tbody = table.find('tbody');
        var dataTable = table.DataTable();

        tbody.off();

        tbody.on('click', 'button', function () {
            var data = $('#tblOptionItems').DataTable().row($(this).parents('tr')).data();
            var index = arrayUtils.getIndexOfObject($scope.items, data, 'itemKey');
            $scope.items.splice(index, 1);
            dataTable.clear().rows.add($scope.items).draw();
        });
    }

    $scope.activeStatusSelectChanged = function () {
        $scope.fields.optActive = $scope.selectedStatus.id;
    };

    $scope.clearStatusSelect = function () {
        $scope.selectedStatus = {};
        $scope.fields.optActive = undefined;
    };

    /*$scope.checkIfOptionBoxExisted = function ($optNameInput) {
        $scope.alerts = [];

        if ($scope.fields.optName.length > 0) {
            $optNameInput.$setValidity('optName', undefined);

            $http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'opt/isOptNameExisted',
                params: {
                    'optRequiredVo.optName': $scope.fields.optName,
                    'isEdited'             : $optNameInput.$dirty
                }
            }).then(function successfulCallback (response) {
                if (response.data.flag === 'failed') {
                    addErrorAlert($filter('translate')('pages.sm.options.OPTION_MGMT_ALERTS.OPTION_MGMT_ALERT_OPTION_NAME_DUPLICATE'));
                    $optNameInput.$setValidity('optName', false);
                } else {
                    $optNameInput.$setValidity('optName', true);
                }
            }, function errorCallback () {
                addErrorAlert($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            });
        }
    };*/

    $scope.addItem = function (form) {
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

    $scope.submit = function () {
        $scope.alerts = [];

        $scope.isFormDisabled = true;

        var optionItemsStr = '';

        $scope.items.map(function (item) {
            optionItemsStr += item.itemKey + ',' + item.itemValue + ';';
        });

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'opt/addNewOptionInfo',
            params: {
                'optRequiredVo.optName'       : $scope.fields.optName,
                'optRequiredVo.optDescription': $scope.fields.optDescription,
                'optRequiredVo.optActive'     : $scope.fields.optActive,
                'optRequiredVo.optValue'      : optionItemsStr,
                'optRequiredVo.optOperatorId' : sessionStorage.getItem('userId'),
                'type'                        : 'new'
            }
        }).then(function successfulCallback (response) {
            if (response.data.flag === 'success') {
                addSuccessAlert();

                dataTableUtils.reloadDataTable($('#tblOptions'));

                $timeout(function () {
                    $modalInstance.dismiss('cancel');
                }, 2000);
            } else {
                $scope.isFormDisabled = false;
                addErrorAlert(response.data.message);
            }
        }, function errorCallback () {
            $scope.isFormDisabled = false;
            addErrorAlert($filter('translate')('pages.sm.options.OPTION_MGMT_ALERTS.OPTION_MGMT_ALERT_OPTION_ADD_FAILED'));
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    angular.element(function () {
        getStatuses();
    });
}

function AddOptionModalInstanceCtrl ($scope, $modal) {
    $scope.showAddOptionPopup = function () {
        $modal.open({
            backdrop   : 'static',
            templateUrl: 'addOptionModal.html',
            controller : 'OptionAddModalControl',
            size       : 'lg'
        });
    };
}

app.controller('AddOptionModalInstanceCtrl', ['$scope', '$modal', AddOptionModalInstanceCtrl]);
app.controller('OptionAddModalControl', ['$scope', '$modalInstance', '$filter', '$http', '$timeout', 'shareDataService', 'dataTableUtils', 'arrayUtils', 'formUtils', OptionAddModalControl]);