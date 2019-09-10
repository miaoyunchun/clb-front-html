'use strict';

app.controller('ProductPageCtrl',function ($scope,$http,$timeout,toaster,$filter,cpShareDataService,dataTableUtils,$interval) {

    $scope.fields = {
        param_product_id:undefined,
        megid:"test",
        user: "test",
        correlid:"test"
    }
    $scope.cpProDataTableParms = {
        searching: false, // Disable built-in searching
        serverSide: true, // Enables the server-side processing
        processing: true, // Enables the "Processing..." indicator
        autoWidth: false, // Disable column width auto determining
        pagingType: 'full_numbers',// Paging buttons contains "First", "Last", "Previous", "Next", and numbers
        language: {
            // I18n options, see https://datatables.net/reference/option/ for details
            paginate: {
                previous: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_PREV_PAGE'),
                next: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_NEXT_PAGE'),
                first: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_FIRST_PAGE'),
                last: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_LAST_PAGE')
            },
            emptyTable: $filter('translate')('pages.sm.org.ORG_MGMT_NOTIFICATION_TEXTS.ORG_MGMT_NOTIFICATION_EMPTY_TABLE'),
            info: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO'),
            infoFiltered: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO_FILTERED'),
            infoEmpty: $filter('translate')('pages.sm.org.ORG_MGMT_NOTIFICATION_TEXTS.ORG_MGMT_NOTIFICATION_PAGE_EMPTY'),
            lengthMenu: $filter('translate')('pages.common.COMMON_FIELDS.COMMON_FIELD_LENGTH_MENU'),
            processing: $filter('translate')('pages.sm.org.ORG_MGMT_NOTIFICATION_TEXTS.ORG_MGMT_NOTIFICATION_PROCESSING')
        },
        ajax: {
            type:'POST',
            url: CP_URL.CP_PRO_LIST,
            data: $scope.fields,
            dataSrc: 'data.list'
        },
        columns: [
            // Specify which property to pick for the corresponding column
            {mData:'seq'},
            {mData: 'product_id'},
            {mData:'product_name'},
            {mData:'subject_number'},
            {mData:'product_ccy'},
            {mData:'currency_support'},
            {mData:'card_issurance'}
        ],
        order: [["0", "desc"]]
    };

    //根据产品id查询产品信息
    $scope.queryPro = function () {
        var org_code=$scope.fields.param_product_id;
        console.log(org_code);
        var dataTablesSelector = angular.element('#tblProducts');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.cpProDataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    }
    var columnsToBeHided = {
        PROID: 1
    }

    $scope.$watch('$viewContentLoaded', function () {

        // Save the selector for better performance
        var tblProducts = angular.element('#tblProducts');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblProducts);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblProducts.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblProducts')) {

                // Get the DataTable instance of the #tblOrganization
                var table = tblProducts.DataTable();

                // Hide a few rows
                dataTableUtils.hideColumns(table, columnsToBeHided);

                // Remove the interval task when finished
                $interval.cancel(setDataTableClickable);
            }
        }, 100);

    });
});



function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {

        // The value of the dropdown will be '? string: ?'
        // if the dropdown is not selected
        // Here we need to set it to an empty string
        if (n['value'] === '? string: ?') {
            n['value'] = '';
        }

        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}