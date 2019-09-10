'use strict';

app.controller('OrganizationPageCtrl',function ($scope,$http,$timeout,$filter,toaster,cpShareDataService,dataTableUtils,dateTimeUtils, formUtils,$interval) {

    $scope.fields = {
        param_org_id: undefined,
        megid:"test",
        user: "test",
        correlid:"test"
    }
    $scope.cpDataTableParms = {
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
            emptyTable: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_EMPTY_TABLE'),
            info: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO'),
            infoFiltered: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO_FILTERED'),
            infoEmpty: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_EMPTY'),
            lengthMenu: $filter('translate')('pages.common.COMMON_FIELDS.COMMON_FIELD_LENGTH_MENU'),
            processing: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PROCESSING')
        },
        ajax:{
            type:'POST',
            url:CP_URL.CP_ORG_LIST,
            data:$scope.fields,
            dataSrc:'data.list'
        },
        columns:[
            {mData:'seq'},
            {mData:'org_id'},
            {mData:'org_name'},
            {mData:'process_status'},
            {mData:'process_with_system'},
            {mData:'work_of_week'},
            {mData:'eom_eoy_flag'}
        ],
        order: [["0", "desc"]]
    };

    $scope.clear = function () {

        // Clear Chosen dropdowns
        // Clear input fields
        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblOrgs');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.cpDataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    }


    //根据输入的机构ID查询后台的机构信息
    $scope.queryOrg = function(){
        var org_code=$scope.fields.org_id;
        console.log(org_code);
        var dataTablesSelector = angular.element('#tblOrgs');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.cpDataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    }

    var columnsToBeHided = {
        ORGID: 1
    }

    $scope.$watch('$viewContentLoaded', function () {

        // Save the selector for better performance
        var tblOrganizations = angular.element('#tblOrgs');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblOrganizations);

        // dataTableUtils.hideColumns(tblOrganizations.DataTable(), columnsToBeHided);
        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblOrganizations.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblOrgs')) {

                // Get the DataTable instance of the #tblOrganization
                var table = tblOrganizations.DataTable();

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
