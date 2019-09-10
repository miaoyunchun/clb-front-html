'use strict';

app.controller('fmAccountingEntriesMgtPageCtrl',function ($scope,$filter,$interval,dataTableUtils) {


    $scope.fields = {
        param_tran_id:undefined,
        param_cond_seq:undefined,
        megid:"test",
        user: "test",
        correlid:"test"
    }
    //初始化datatable
    $scope.fmAcctEntryDataTableParms = {
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
            url: FM_URL.FM_ACCT_ENTRY_LIST,
            data: $scope.fields,
            dataSrc: 'data.list'
        },
        columns: [

            {mData:'seq'},
            {mData:'acct_item'},
            {mData:'tran_id'},

            {mData:'cond_seq'},
            {mData:'dc_flag'},
            {mData:'acct_org'},
            {mData:'tran_amt_point'},

            {mData:'item_seq'},
            {mData:'tran_desp'},

        ],
        order: [["0", "desc"]]
    }
    var columnsToBeHided = {
        COND_SEQ:3,
        DC_FLAG:4,
        ACCT_ORG:5,
        TRAN_AMT_POINT:6
    }

    //查询按钮的单击事件
    $scope.queryAcctEntry = function(){

        var dataTablesSelector = angular.element('#tblAcctEntries');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.fmAcctEntryDataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    }

    //重置按钮的单击事件
    $scope.clearFilterTable = function () {

        // Clear Chosen dropdowns
        // Clear input fields
        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblAcctEntries');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.fmAcctEntryDataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    }

    $scope.$watch('$viewContentLoaded', function () {

        // Save the selector for better performance
        var tblAcctEntries = angular.element('#tblAcctEntries');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblAcctEntries);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblAcctEntries.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblAcctEntries')) {

                // Get the DataTable instance of the #tblOrganization
                var table = tblAcctEntries.DataTable();

                // Hide a few rows
                dataTableUtils.hideColumns(table, columnsToBeHided);

                // Remove the interval task when finished
                $interval.cancel(setDataTableClickable);
            }
        }, 100);

    });

})