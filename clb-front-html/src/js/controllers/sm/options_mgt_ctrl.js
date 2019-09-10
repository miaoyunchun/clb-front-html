'use strict';

function OptionsMgmtCtrl($scope, $http, $filter, $timeout, $interval, $window, shareDataService, dataTableUtils, toasterUtils) {

    const COLUMN_NAMES = {
        SEQ             : 0,
        OPTION_ID       : 1,
        OPTION_NAME     : 2,
        OPTION_STATUS_ID: 3,
        OPTION_STATUS   : 4
    };

    $scope.fields = {};

    $scope.statuses = undefined;
    $scope.selectedStatus = {};

    // Initialization parameters for DataTable
    $scope.dataTableParms = {
        searching : false, // Disable built-in searching
        serverSide: true, // Enables the server-side processing
        processing: true, // Enables the "Processing..." indicator
        autoWidth : false, // Disable column width auto determining
        pagingType: 'full_numbers',　// Paging buttons contains "First", "Last", "Previous", "Next", and numbers
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
            url    : CLB_FRONT_BASE_URL + 'opt/queryOptInfoWithFilter',
            data   : $scope.fields,
            dataSrc: 'data'
        },
        columns   : [
            // Specify which property to pick for the corresponding column
            {data: null, visible: true, orderable: false, searchable: false},
            {data: 'optId', visible: true},
            {data: 'optName', visible: true},
            {data: 'optActive', visible: false},
            {data: 'optActiveStatus', visible: true},
            {data:	'optDescription', visible: true}
        ],
        order     : [[COLUMN_NAMES.OPTION_NAME, 'asc']]
    };

    /**
     * Generates the child row for the selected row
     * @param data Data of the selected row
     * @returns {string} The HTML of the child row
     */
    function formatChildRow(data) {
        return '<div class="col-lg-12 form-group">'
            + '<h5>' + $filter('translate')('pages.sm.options.OPTION_MGMT_COLUMN_TITLES.OPTION_MGMT_COLUMN_TITLE_ITEM_VALUE') + '</h5>'
            + '<div id="optValue" class="well b bg-light lter wrapper-sm">'
            + data['optValue']
            + '</div>'
            + '</div>';
    }

    function getStatuses() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(
            function successfulCallback(response) {
                if (response.data.flag === 'success') {
                    $scope.statuses = response.data.active;
                } else {
                    toasterUtils.showErrorToaster(response.data.message);
                }
            },
            function errorCallback() {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
            });
    }

    function enableIndexColumn(selector) {

        var intervalTask = $interval(function() {

            if (selector.DataTable !== undefined && $.fn.DataTable.isDataTable(selector)) {
                var dataTable = selector.DataTable();

                dataTable.on('order.dt search.dt', function() {
                    dataTable
                        .column(0, {search: 'applied', order: 'applied'})
                        .nodes()
                        .each(function(cell, i) {
                            cell.innerHTML = i + 1;
                        });
                }).draw();

                $interval.cancel(intervalTask);
            }

        }, 200);
    }

    $scope.deleteOption = function() {
        var tblOptions = $('#tblOptions');

        if (tblOptions.DataTable().row('.active').length !== 1) {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
        } else {
            if ($window.confirm($filter('translate')('pages.sm.options.OPTION_MGMT_NOTIFICATIONS.OPTION_MGMT_NOTIFICATION_DELETE_CONFIRMATION'))) {
                var optId = tblOptions.DataTable().row('.active').data().optId;

                $http({
                    method: 'POST',
                    url   : CLB_FRONT_BASE_URL + 'opt/deleteOptInfo',
                    params: {
                        optId: optId
                    }
                }).then(
                    function successfulCallback(response) {
                        if (response.data.flag === 'success') {
                            toasterUtils.showSuccessToaster($filter('translate')('pages.sm.options.OPTION_MGMT_TOAST_TEXTS.OPTION_MGMT_TOAST_TEXT_DELETE_SUCCESSFUL'));
                            dataTableUtils.reloadDataTable(tblOptions);
                        } else {
                            var message = response.data.message ? response.data.message : $filter('translate')('pages.sm.options.OPTION_MGMT_TOAST_TEXTS.OPTION_MGMT_TOAST_TEXT_DELETE_FAILED');
                            toasterUtils.showErrorToaster(message);
                        }
                    },
                    function errorCallback() {
                        toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
                    }
                );
            }
        }
    };

    $scope.search = function() {
        var dataTablesSelector = $('#tblOptions');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector, true, formatChildRow, undefined);
        enableIndexColumn(dataTablesSelector);
    };

    $scope.clear = function() {
        $scope.fields.optName = undefined;
        $scope.clearStatusSelect();
        $scope.search();
    };

    $scope.activeStatusSelectChanged = function() {
        $scope.fields.optActive = $scope.selectedStatus.id;
    };

    $scope.clearStatusSelect = function() {
        $scope.selectedStatus.id = undefined;
        $scope.fields.optActive = undefined;
    };

    angular.element(function() {
        var selector = $('#tblOptions');

        getStatuses();

        enableIndexColumn(selector);

        dataTableUtils.enableSingleSelect(selector, true, formatChildRow, undefined);

    });

}

function AccordionCtrl($scope, $filter) {
    // Only one Accordion can be opened at the same time
    $scope.oneAtATime = true;

    // Title of the Accordion
    $scope.accordionTitle = $filter('translate')('pages.common.COMMON_FORM_TITLES.COMMON_FORM_TITLE_SEARCH');

    // Initialize parameters for the Accordion
    $scope.status = {
        isFirstOpen    : false,
        isFirstDisabled: false
    };
}

app.controller('OptionsMgmtCtrl', ['$scope', '$http', '$filter', '$timeout', '$interval', '$window', 'shareDataService', 'dataTableUtils', 'toasterUtils', OptionsMgmtCtrl]);
app.controller('AccordionCtrl', ['$scope', '$filter', AccordionCtrl]);