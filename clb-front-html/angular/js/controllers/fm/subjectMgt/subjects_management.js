'use strict';

app.controller('fmSubjectsMgtPageCtrl',function ($scope,$http,toaster,$interval,$filter,dataTableUtils,formUtils) {
    var SELECT_PARAM_ITEM_LEVEL="85b76a12776c4bcf9c6365aaa8d8631b";
	
	$scope.selectedParamItemLevel={};
	$scope.paramItemLevelSelectOnChange= function() {
        $scope.fields.param_item_level = $scope.selectedParamItemLevel.item.key;
    };
	
    
    angular.element(function () {
    	//科目级别
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_PARAM_ITEM_LEVEL
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.paramItemLevel = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
    });
	

    //针对下拉框出现的问题的解决方法
    var fixChosenItemIntervalTask = $interval(function () {
        if (angular.element('#item_level').chosen !== undefined) {

         //   angular.element('#item_level').chosen({allow_single_deselect: true});

            $interval.cancel(fixChosenItemIntervalTask);
        }
    });
    //针对下拉框宽度不够的解决方法
    var fixChosenWidth = function () {
        var fixWidthIntervalTask = $interval(function () {
            if (angular.element('#item_level').attr('style') !== undefined) {

                angular.element('#item_level').css('width', '100%');
                $interval.cancel(fixWidthIntervalTask);
            }
        }, 100);
    };

//重置按钮单击事件
    $scope.clearTable = function () {
        $scope.param_item_key = '';
        $scope.selectedParamItemLevel.item=undefined;
        formUtils.clearForm($scope.fields);
        var dataTablesSelector = angular.element('#tblSubjects');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.fmSubDataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    }

    $scope.fields = {
        param_item_key:undefined,
        param_item_level:undefined,
        megid:"test",
        user: "test",
        correlid:"test"
    }
    $scope.fmSubDataTableParms = {
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
            url: FM_URL.FM_SUBJECT_LIST,
            data: $scope.fields,
            dataSrc: 'data.list'
        },
        columns: [
            // Specify which property to pick for the corresponding column
            {mData:'seq'},
            {mData:'item_key'},
            {mData:'item_level'},
            {mData:'item_name'},
            {mData:'item_start_date'},
            {mData:'item_end_date'}
        ],
        order: [["0", "desc"]]
    }

    var columnsToBeHided = {
        ITEM_KEY:1 
    }

    $scope.$watch('$viewContentLoaded', function () {

        // Save the selector for better performance
        var tblSubjects = angular.element('#tblSubjects');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblSubjects);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblSubjects.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblSubjects')) {

                // Get the DataTable instance of the #tblOrganization
                var table = tblSubjects.DataTable();

                // Hide a few rows
                dataTableUtils.hideColumns(table, columnsToBeHided);

                // Remove the interval task when finished
                $interval.cancel(setDataTableClickable);
            }
        }, 100);

    });

    //查询按钮的单击事件
    $scope.querySub = function () {
        console.log($scope.fields);
        var dataTablesSelector = angular.element('#tblSubjects');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.fmSubDataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    }


})