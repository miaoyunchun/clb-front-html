'use strict';

app.controller('TransHistoryCtrl', function ($scope, $http, $filter, $timeout, $interval,dataTableUtils,formUtils,toaster) {
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
	 $scope.fields = {
			 	megid: "test",
	        	user: "test",
	        	correlid:"test",
	        	param_orgCode : undefined,
	        	param_status : undefined
		    };
	 $scope.query = function(){
	    	var datainfo = getFormData(angular.element('#formTransInq'));
	    	$http({
	            method: 'POST',
	            url: 'http://127.0.0.1:8085/clb-consumer/VBS-DP-BALANCE2-FIN',
	            data:{'megid': 'test',
	            	"user": 'test',
	            	"param": datainfo,
	            	"correlid":'test'}
	        }).then(function successCallback(response) {
	            $scope.responseData = response.data;
	            if ($scope.responseData.code === '0000') { 
	            	$timeout(function () {
	                    toaster.pop(
	                        'success',
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_SUCCESSFUL'),
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_SUCCESSFUL')
	                    );
	                }, 0);
	            	//去除style属性，将search框和list框显示
	            	$("#search").removeAttr("style"); 
	            	$("#list").removeAttr("style");	            	
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
	            	            emptyTable: $filter('translate')('pages.sm.org.ORG_MGMT_NOTIFICATION_TEXTS.ORG_MGMT_NOTIFICATION_EMPTY_TABLE'),
	            	            info: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO'),
	            	            infoFiltered: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO_FILTERED'),
	            	            infoEmpty: $filter('translate')('pages.sm.org.ORG_MGMT_NOTIFICATION_TEXTS.ORG_MGMT_NOTIFICATION_PAGE_EMPTY'),
	            	            lengthMenu: $filter('translate')('pages.common.COMMON_FIELDS.COMMON_FIELD_LENGTH_MENU'),
	            	            processing: $filter('translate')('pages.sm.org.ORG_MGMT_NOTIFICATION_TEXTS.ORG_MGMT_NOTIFICATION_PROCESSING')
	            	        },
	                        ajax: {
	                          type: "POST",
	                          url: 'http://127.0.0.1:8085/clb-consumer/VBS-DP-TRANSACT-FIN',
	                          data: $scope.fields,
	                          dataSrc: 'data.list'
	                        },
	                    columns: [
	                              { mData: 'trans_id'},
	                              { mData: 'trans_card'},
	                              { mData: 'trans_code'},
	                              { mData: 'amount_berfor_trans'},
	                              { mData: 'amount_in_trans'},
	                              { mData: 'amount_after_trans'},
	                              { mData: 'trans_date'}
	                          ],
	                          order: [["6", "desc"]]
	                };
	            	var dataTablesSelector = angular.element('#dpTransList');
	                dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
	                dataTableUtils.enableSingleSelect(dataTablesSelector);
	            } else {
	            	$timeout(function () {
	                    toaster.pop(
	                        'error',
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
	                    );
	                }, 0); 

	            }
	            
	        }, function errorCallback(response) {
	        	$timeout(function () {
	                toaster.pop(
	                    'error',
	                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
	                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
	                );
	            }, 0);
	        });
	    }
	 
	
    

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
//    	var org_code=$scope.fields.status;
//    	console.info(org_code);
        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#dpTransList');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    };
    /* End of buttons on the DataTable */
    
    /**
     * Clear button behaviour
     */
    $scope.clear = function () {

        // Clear Chosen dropdowns
        formUtils.resetChosen(angular.element('#formDpTrans'));

        // Clear input fields
        formUtils.clearForm($scope.fields);

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#dpTransList');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    };


});




app.controller('TransAccordionCtrl', function ($scope, $filter) {
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
