'use strict';

app.controller('fmAccountingListPageCtrl',function ($scope,$filter,$interval,dataTableUtils) {


    $scope.fmAcctDetailDataTableParms = {
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
            url:FM_URL.FM_ACCTLIST_INQ,
            data: $scope.fields,
            dataSrc: 'data.list'
        },
        columns: [
            // Specify which property to pick for the corresponding column
            {mData:'seq'},

            {mData:'tran_jour'},

            {mData:'tran_seq'},

            {mData:'tran_id'},

            {mData:'cond_seq'},
            {mData:'tran_date'},
            {mData:'tran_time'},

            {mData:'dc_flag'},

            {mData:'acct_item'},
            {mData:'acct_org'},
            {mData:'tran_amt'},

            {mData:'item_seq'},
        ],
        order: [["0", "desc"]]
    }

    var columnsToBeHided = {
        // TRAN_JOUR: 2,
        // TRAN_ID:4,
        // DC_FLAG:8,
        // ITEM_SEQ:12
    }

    $scope.$watch('$viewContentLoaded', function () {

        // Save the selector for better performance
        var tblAcctDetail = angular.element('#tblAcctDetail');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblAcctDetail);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblAcctDetail.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblAcctDetail')) {

                // Get the DataTable instance of the #tblOrganization
                var table = tblAcctDetail.DataTable();

                // Hide a few rows
                dataTableUtils.hideColumns(table, columnsToBeHided);

                // Remove the interval task when finished
                $interval.cancel(setDataTableClickable);
            }
        }, 100);

    });


    //日历的插件
    app.controller('DateCtrl',function ($scope) {
        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        }
    });

})