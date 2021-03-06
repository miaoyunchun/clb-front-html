'use strict';

app.controller('LoanContractEntryMgmtCtrl', function ($scope, $http, $filter, $timeout, $interval,dataTableUtils,formUtils) {

	//前端列表搜索条件（注意：查询条件需要加上param_前缀，方便后台统一处理查询条件）
	 $scope.fields = {
			 	megid: "test",
	        	user: "test",
	        	correlid:"test",
	        	param_lncappf_cust_no : undefined,
	        	param_lncappf_cust_type : undefined,
	        	param_lncappf_status : "003"
		    };

		var SELECT_DOCUMENT_TYPE="933a62fc696943978b5e17cb6ac48596";
		 var SELECT_PARAM_LNCAPPF_STATU="66dc18613559432ba4b62bc78d508ba3";
		 
		 $scope.selectedParamLncappfCustType={};
		 $scope.selectedParamLncappfStatus={};
		 //证件类型
		 $scope.paramLncappfCustTypeSelectOnChange= function() {
		        $scope.fields.param_lncappf_cust_type = $scope.selectedParamLncappfCustType.item.key;
		  };
		 //贷款申请状态
		 $scope.paramLncappfStatusSelectOnChange= function() {
		        $scope.fields.param_lncappf_status = $scope.selectedParamLncappfStatus.item.key;
		  };
		 
		 angular.element(function () {
			//证件类型
		   	 
		        $http({
		            method: 'POST',
		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
		            params: {
		                optId: SELECT_DOCUMENT_TYPE
		            }
		        }).then(function (response) {
		            var responseData = response.data;

		            if (responseData.flag === 'success') {
		                $scope.paramLncappfCustType = responseData.optValueList;
		            }
		        }, function () {
		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
		        });
		      //贷款申请状态
		        $http({
		            method: 'POST',
		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
		            params: {
		                optId: SELECT_PARAM_LNCAPPF_STATU
		            }
		        }).then(function (response) {
		            var responseData = response.data;

		            if (responseData.flag === 'success') {
		                $scope.paramLncappfStatus = responseData.optValueList;
		            }
		        }, function () {
		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
		        });
		 });
		
		
		
		
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
              url: LN_BASE_URL+'VBS-LN-APPLYLST-INQ',
              data: $scope.fields,
              dataSrc: 'data.list'
            },
        columns: [
                  { mData: 'lncappf_id'},
                  { mData: 'lncappf_cust_type'},
                  { mData: 'lncappf_cust_no'},
                  { mData: 'lncappf_amt'},
                  { mData: 'lncappf_in_date'},
                  { mData: 'lncappf_in_time'},
                  { mData: 'lncappf_status'}
              ],
              order: [[5, "desc"]]
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
    	var org_code=$scope.fields.status;
    	console.info(org_code);
        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblLoanContractEntry');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    };
    /* End of buttons on the DataTable */
    
    /**
     * Clear button behaviour
     */
    $scope.clear = function () {

        // Clear Chosen dropdowns
    	$scope.selectedParamLncappfCustType.item=undefined;
		$scope.selectedParamLncappfStatus.item=undefined;

        // Clear input fields
        formUtils.clearForm($scope.fields);

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblLoanContractEntry');
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
        var tblOrganizations = angular.element('#tblLoanContractEntry');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblOrganizations);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblOrganizations.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblLoanContractEntry')) {

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
