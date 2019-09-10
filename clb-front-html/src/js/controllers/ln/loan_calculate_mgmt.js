'use strict';

app.controller('LoanCalculateMgmtCtrl', function ($scope, $http, $filter, $timeout, $interval,dataTableUtils,formUtils) {

	//前端列表搜索条件（注意：查询条件需要加上param_前缀，方便后台统一处理查询条件）
	 $scope.fields = {
			 	megid: "test",
	        	user: "test",
	        	correlid:"test",
	        	param_ln_principal : undefined,
	        	param_interst_type : undefined,
	        	param_ints_settle_way : undefined,
	        	param_periods : undefined,
	        	param_currency : undefined,
	        	param_lending_rate : undefined,
	        	param_pay_way : undefined,
	        	param_total_interest : undefined
		    };
	 	var SELECT_PARAM_INTS_SETTLE_WAY="4fc49f8492144a18be55b117bfd252ec";
	 	var SELECT_PARAM_CURRENCY="220c61b895d941c39d2739336cb3a994";
	 	var SELECT_PAY_WAY="07d97e440e6e43ee933f605b87bfd061";
		$scope.selectedParamIntsSettleWay={};
		$scope.selectedParamCurrency={};
		$scope.selectedParamPayWay={};
		 //结息方式
		 $scope.paramIntsSettleWaySelectOnChange= function() {
		        $scope.fields.param_ints_settle_way = $scope.selectedParamIntsSettleWay.item.key;
		  };
	     //币种
		 $scope.paramCurrencySelectOnChange= function() {
		        $scope.fields.param_currency = $scope.selectedParamCurrency.item.key;
		  };
		//还款方式
		 $scope.paramPayWaySelectOnChange= function() {
		        $scope.fields.param_pay_way = $scope.selectedParamPayWay.item.key;
		  };
		 
		 angular.element(function () {
			//结息方式
		        $http({
		            method: 'POST',
		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
		            params: {
		                optId: SELECT_PARAM_INTS_SETTLE_WAY
		            }
		        }).then(function (response) {
		            var responseData = response.data;

		            if (responseData.flag === 'success') {
		                $scope.paramIntsSettleWay = responseData.optValueList;
		            }
		        }, function () {
		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
		        });
		        
		      //币种
		        $http({
		            method: 'POST',
		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
		            params: {
		                optId: SELECT_PARAM_CURRENCY
		            }
		        }).then(function (response) {
		            var responseData = response.data;

		            if (responseData.flag === 'success') {
		                $scope.paramCurrency = responseData.optValueList;
		            }
		        }, function () {
		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
		        });
		      //币种
		        $http({
		            method: 'POST',
		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
		            params: {
		                optId: SELECT_PAY_WAY
		            }
		        }).then(function (response) {
		            var responseData = response.data;

		            if (responseData.flag === 'success') {
		                $scope.paramPayWay = responseData.optValueList;
		            }
		        }, function () {
		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
		        });
		      
		 })
    $scope.dataTableParms = {
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
            ajax: {
              type: "POST",
              url: LN_BASE_URL+'VBS-LN-CALCULATE-INQ',
              data: $scope.fields,
              dataSrc: 'data.list'
            },
        columns: [
                  { mData: 'repay_periods'},
                  { mData: 'repay_principal'},
                  { mData: 'repay_interest'},
                  { mData: 'repay_total_amount'},
                  { mData: 'remain_amount'}
              ] 
    };

    $scope.active = [{
        active: '',
        value: 0
    }];

//    $scope.placeholders = shareDataService.getPlaceHolders();

    /* Search filter */
    /**
     * Search button behaviour
     */
    $scope.search = function () {
        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblLoanCalculateMgmt');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        console.info($scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
        $http(
        		{
        			method : 'POST',
        			url : LN_BASE_URL+'VBS-LN-INTEREST-CAL',//贷款详情查询
        			data : {
        				'megid' : 'test',
        				"user" : 'test',
        				"param" : $scope.fields,
        				"correlid" : 'test'
        			}
        		})
        		.then(
        				function successCallback(response) {
        					$scope.responseData = response.data;
        					console.info(response.data.data);
        					if ($scope.responseData.code == '0000') {
        						$scope.fields.param_total_interest = response.data.data.total_interest
        					}
        				});

    };
    /* End of buttons on the DataTable */
    
    /**
     * Clear button behaviour
     */
    $scope.clear = function () {

        // Clear Chosen dropdowns
    	$scope.selectedParamIntsSettleWay.item=undefined;
		$scope.selectedParamCurrency.item=undefined;
		$scope.selectedParamPayWay.item=undefined;

        // Clear input fields
        formUtils.clearForm($scope.fields);

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblLoanCalculateMgmt');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    };

    
    var fixChosenWidth = function () {
        var fixWidthIntervalTask = $interval(function () {
            if (angular.element('#stakeholder_chosen').attr('style') !== undefined
                && angular.element('#active_chosen').attr('style') !== undefined
                && angular.element('#logo_chosen').attr('style') !== undefined) {

                angular.element('#stakeholder_chosen').css('width', '100%');
                angular.element('#active_chosen').css('width', '100%');
                angular.element('#logo_chosen').css('width', '100%');

                $interval.cancel(fixWidthIntervalTask);
            }
        }, 100);
    };
    
    $scope.$watch('$viewContentLoaded', function () {

        // Save the selector for better performance
        var tblOrganizations = angular.element('#tblLoanCalculateMgmt');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblOrganizations);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblOrganizations.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblLoanCalculateMgmt')) {

                // Get the DataTable instance of the #tblOrganization
                var table = tblOrganizations.DataTable();

                // Remove the interval task when finished
                $interval.cancel(setDataTableClickable);
            }
        }, 100);

        fixChosenWidth();

        var fixChosenItemIntervalTask = $interval(function () {
            if (angular.element('#stakeholder').chosen !== undefined
                && angular.element('#active').chosen !== undefined
                && angular.element('#logo').chosen !== undefined) {

                angular.element('#stakeholder').chosen({allow_single_deselect: true});
                angular.element('#active').chosen({allow_single_deselect: true});
                angular.element('#logo').chosen({allow_single_deselect: true});

                $interval.cancel(fixChosenItemIntervalTask);
            }
        }, 100);
    });
});




app.controller('AccordionCtrl', function ($scope, $filter) {
    // Only one Accordion can be opened at the same time
    $scope.oneAtATime = true;

    // Title of the Accordion
    $scope.accordionTitle = $filter('translate')('pages.sm.org.ORG_MGMT_FORM_TITLES.ORG_MGMT_FORM_TITLE_SEARCH');

    // Initialize parameters for the Accordion
    $scope.status = {
        isFirstOpen: false,
        isFirstDisabled: false
    };
});
