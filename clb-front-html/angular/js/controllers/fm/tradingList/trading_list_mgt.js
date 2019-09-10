'use strict';

app.controller('fmTradingListMgtPageCtrl',function ($scope,toaster,$http,$interval,$filter,dataTableUtils) {
    $scope.txnTypesList = [
        {'value':'0','name':'正常交易'},
        {'value':'1','name':'冲正交易'}
    ]

    //针对下拉框出现的问题的解决方法
    var fixChosenItemIntervalTask = $interval(function () {
        if (angular.element('#txn_type').chosen !== undefined) {
            angular.element('#txn_type').chosen({allow_single_deselect: true});
            $interval.cancel(fixChosenItemIntervalTask);
        }
    });
    

//重置按钮单击事件
    $scope.clearTable = function () {
        $scope.fields.param_txn_jour = '';
        $scope.fields.param_busn_date = '';
        angular.element('#txn_type').val('').trigger('chosen:updated');
    }
  //针对下拉框宽度不够的解决方法
    var fixChosenWidth = function () {
        var fixWidthIntervalTask = $interval(function () {
            if (angular.element('#txn_type').attr('style') !== undefined) {

                angular.element('#txn_type').css('width', '100%');
                $interval.cancel(fixWidthIntervalTask);
            }
        }, 100);
    };
    
    
    $scope.fields = {
    	param_txn_jour:undefined,
    	param_txn_type:undefined,
    	param_busn_date:undefined,
        megid:"test",
        user: "test",
        correlid:"test"
    }
    
    
    $scope.fmTradDataTableParms = {
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
            url: FM_URL.FM_TRAD_LIST,
            data: $scope.fields,
            dataSrc: 'data.list'
        },
        columns: [
            // Specify which property to pick for the corresponding column
            {mData:'seq'},//序号
            {mData:'txn_jour'},//交易流水账号
            {mData:'txn_type'},//交易类型
            {mData:'ser_name'},//交易服务名
            {mData:'txl_tx_type'},//交易类型
            {mData:'txl_doc_type'},//凭证类型
            {mData:'txl_ec_flg'},//冲正交易标识
            {mData:'txl_tx_amt1'},//交易金额
            {mData:'txl_24h_ec_flg'},//24小时冲正标识
            {mData:'txl_data_area'}//内容
        ],
        order: [["0", "desc"]]
    }
    
    var columnsToBeHided = {
    		TXN_TYPE:2,
    		TXL_EC_FLG:6,
    		TXL_24H_EC_FLG:8
    }

    $scope.$watch('$viewContentLoaded', function () {

        // Save the selector for better performance
        var tblTradingList = angular.element('#tblTradingList');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblTradingList);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblTradingList.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblTradingList')) {

                // Get the DataTable instance of the #tblOrganization
                var table = tblTradingList.DataTable();

                // Hide a few rows
                dataTableUtils.hideColumns(table, columnsToBeHided);

                // Remove the interval task when finished
                $interval.cancel(setDataTableClickable);
            }
        }, 100);

    });

    $scope.queryTrading = function () {
    	var formData=getFormData(angular.element('#formTradingListFilter'));
        $scope.fields.param_busn_date=formData.param_busn_date;
        console.log($scope.fields);
        var dataTablesSelector = angular.element('#tblTradingList');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.fmTradDataTableParms);
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
