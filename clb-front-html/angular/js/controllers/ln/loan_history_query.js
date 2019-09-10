'use strict';

app.controller('LoanHistoryQueryCtrl', function ($scope, $http, $filter, $timeout, $interval,dataTableUtils,formUtils) {

	//前端列表搜索条件（注意：查询条件需要加上param_前缀，方便后台统一处理查询条件）
	 $scope.fields = {
			 	megid: "test",
	        	user: "test",
	        	correlid:"test",
	        	param_lnctranf_card_no : undefined,
	        	param_lnctranf_contract_id : undefined,
	        	param_lnctranf_pay_way : undefined
		    };
	var SELECT_PARAM_LNCTRANF_PAY_WAY="a8e6ee39fee34e2dbc89d32840725461";
	$scope.selectedparamLnctranfPayWay={};
	 //交易类型
	 $scope.paramLnctranfPayWaySelectOnChange= function() {
	        $scope.fields.param_lnctranf_pay_way = $scope.selectedparamLnctranfPayWay.item.key;
	  };
	 
	 angular.element(function () {
		//交易类型
	   	 
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_PARAM_LNCTRANF_PAY_WAY
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.paramLnctranfPayWay = responseData.optValueList;
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
              url: LN_BASE_URL+'VBS-LN-ACCTLOG-INQ',
              data: $scope.fields,
              dataSrc: 'data.list'
            },
        columns: [
                  { mData: 'lnctranf_id'},
                  { mData: 'lnctranf_pay_way'},
                  { mData: 'lnctranf_contract_id'},
                  { mData: 'lnctranf_card_no'},
                  { mData: 'lnctranf_date'},
                  { mData: 'lnctranf_time'}
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
        var dataTablesSelector = angular.element('#tblLoanHistoryQuery');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        console.info($scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    };
    /* End of buttons on the DataTable */
    
    /**
     * Clear button behaviour
     */
    $scope.clear = function () {

        // Clear Chosen dropdowns
        formUtils.resetChosen(angular.element('#formLnFilter'));

        // Clear input fields
        formUtils.clearForm($scope.fields);

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblLoanHistoryQuery');
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
        var tblLoanHistoryQuery = angular.element('#tblLoanHistoryQuery');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblLoanHistoryQuery);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblLoanHistoryQuery.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblLoanHistoryQuery')) {

                // Get the DataTable instance of the #tblOrganization
                var table = tblLoanHistoryQuery.DataTable();

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
