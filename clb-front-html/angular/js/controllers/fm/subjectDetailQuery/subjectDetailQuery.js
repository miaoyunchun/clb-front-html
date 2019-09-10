'use strict';

app.controller('subDetailQueryMgtPageCtrl',function ($scope,toaster,$http,$interval,$filter,dataTableUtils) {

//重置按钮单击事件
    $scope.clearTable = function () {
        $scope.fields.param_txn_jour_t = '';
        $scope.fields.param_item_nbr = '';
        $scope.fields.param_txn_date_t = '';
    }
    
    $scope.fields = {
    	param_txn_jour_t:undefined,
    	param_item_nbr:undefined,
    	param_txn_date_t:undefined,
        megid:"test",
        user: "test",
        correlid:"test"
    }
    
    
    $scope.fmSubDetailDataTableParms = {
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
            url: FM_URL.FM_ITEMD_LIST,
            data: $scope.fields,
            dataSrc: 'data.list'
        },
        columns: [
            // Specify which property to pick for the corresponding column
            {mData:'seq'},
            {mData:'txn_jour_t'},
            {mData:'txn_seq'},
            {mData:'txn_date_t'},
            {mData:'txn_time'},
            {mData:'dc_cod'},
            {mData:'item_bal'},
            {mData:'opr_nbr'},
            {mData:'txn_type'}
        ],
        order: [["0", "desc"]]
    }
    var columnsToBeHided = {
    		txn_seq:2
    }

    $scope.$watch('$viewContentLoaded', function () {

        // Save the selector for better performance
        var itemDetailList = angular.element('#itemDetailList');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(itemDetailList);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (itemDetailList.DataTable !== undefined && $.fn.dataTable.isDataTable('#itemDetailList')) {

                // Get the DataTable instance of the #tblOrganization
                var table = itemDetailList.DataTable();

                // Hide a few rows
                dataTableUtils.hideColumns(table, columnsToBeHided);

                // Remove the interval task when finished
                $interval.cancel(setDataTableClickable);
            }
        }, 100);

    });
    
    $scope.queryItemDetail = function () {
    	var formData=getFormData(angular.element('#formSubDetailFilter'));
        $scope.fields.param_txn_date_t=formData.param_txn_date_t;
        console.log($scope.fields);
        var dataTablesSelector = angular.element('#itemDetailList');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.fmSubDetailDataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    }
  
})


//日历的插件
app.controller('AvailDateCtrl',function ($scope) {
  $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
  }
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
