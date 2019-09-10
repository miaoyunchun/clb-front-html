'use strict';

app.controller('LoanPaymentMgmtCtrl', function ($scope, $http, $filter, $timeout, $interval,dataTableUtils,formUtils) {

	//前端列表搜索条件（注意：查询条件需要加上param_前缀，方便后台统一处理查询条件）
	 $scope.fields = {
			 	megid: "test",
	        	user: "test",
	        	correlid:"test",
	        	param_lncntrct_cntrct_status : '3',
	        	param_lncntrct_cntrct_no : undefined
		    };
	 var SELECT_PARAM_LNCNTRCT_CNTRCT_STATUS="f17a1694a7074692bc1c251e608f5621";
	 $scope.selectedParamLncntrctCntrctStatus={};
	 //合同状态
	 $scope.paramLncntrctCntrctStatusSelectOnChange= function() {
	        $scope.fields.param_lncntrct_cntrct_status = $scope.selectedParamLncntrctCntrctStatus.item.key;
	  };
	 
	 angular.element(function () {
		//合同状态
	   	 
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_PARAM_LNCNTRCT_CNTRCT_STATUS
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.paramLncntrctCntrctStatus = responseData.optValueList;
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
              url: LN_BASE_URL+'VBS-LN-PUTLOAN-INQ',
              data: $scope.fields,
              dataSrc: 'data.list'
            },
        columns: [
                  { mData: 'lncntrct_cntrct_no'},
                  { mData: 'lncntrct_open_date'},
                  { mData: 'lncntrct_cntrct_status'},
                  { mData: 'lncntrct_loan_no'},
                  { mData: 'lncntrct_cust_no'},
                  { mData: 'lncntrct_cust_name'}
              ],
              order: [[1, "desc"]]
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
        var dataTablesSelector = angular.element('#tblLoanPaymentMgmt');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
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
        var dataTablesSelector = angular.element('#tblLoanPaymentMgmt');
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
        var tblOrganizations = angular.element('#tblLoanPaymentMgmt');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblOrganizations);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblOrganizations.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblLoanPaymentMgmt')) {

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
