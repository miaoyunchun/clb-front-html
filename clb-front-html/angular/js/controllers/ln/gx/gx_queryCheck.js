'use strict';

app.controller('ExtensionMgmtCtrl', function ($scope, $http, $filter, $timeout, $interval,dataTableUtils,formUtils) {
    // Prototypes
    var responseData = {
        flag: '',
        userInfo: [
            {
                userId: '',
                username: ''
            }
        ],
        companyInfo: [
            {
                companyId: 0,
                companyName: ''
            }
        ],
        active: [
            {
                active: '',
                value: 0
            }
        ]
    };

	
	 $scope.fields = {
			 	megid: "test",
	        	user: "test",
	        	correlid:"test",
	        	param_orgCode : undefined,
	        	param_status : undefined
		    };
	 var SELECT_PARAM_STATUS="0cb7a84b8d2045a6b9993f98236fc030";
	 $scope.selectedParamStatus={};
	 //证件类型
	 $scope.paramStatusSelectOnChange= function() {
	        $scope.fields.param_status = $scope.selectedParamStatus.item.key;
	  };
	  angular.element(function () {
			//证件类型
		   	 
		        $http({
		            method: 'POST',
		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
		            params: {
		                optId: SELECT_PARAM_STATUS
		            }
		        }).then(function (response) {
		            var responseData = response.data;

		            if (responseData.flag === 'success') {
		                $scope.paramStatus = responseData.optValueList;
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
	            infoEmpty: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_EMPTY_TABLE'),
	            lengthMenu: $filter('translate')('pages.common.COMMON_FIELDS.COMMON_FIELD_LENGTH_MENU'),
	            processing: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PROCESSING')
	        },
            ajax: {
              type: "POST",
              url: LN_BASE_URL+'VBS-LN-GXAPPLY-LST',
              data: $scope.fields,
              dataSrc: 'data.list'
            },
        columns: [
                  { mData: 'lncntrct_cntrct_no'},
                  { mData: 'gxcapply_loan_amt'},
                  { mData: 'gxcapply_extend_fee'},
                  { mData: 'gxcapply_extend_rate'},
                  { mData: 'gxcapply_loan_ext_sts'},
                  { mData: 'gxcapply_apply_date'}
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
        var dataTablesSelector = angular.element('#tblExtension');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    };
    /* End of buttons on the DataTable */
    
    /**
     * Clear button behaviour
     */
    $scope.clear = function () {

        // Clear Chosen dropdowns
    	$scope.selectedParamStatus.item=undefined;

        // Clear input fields
        formUtils.clearForm($scope.fields);

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblExtension');
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
        var tblOrganizations = angular.element('#tblExtension');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblOrganizations);

        var setDataTableClickable = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblOrganizations.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblExtension')) {

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
