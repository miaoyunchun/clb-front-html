'use strict';
app.controller('BtnMgmtCtrl',function($scope, $http, $filter, $timeout, $interval, toaster, shareDataService, dataTableUtils, dateTimeUtils, formUtils, toasterUtils){
	
	
	$scope.active = undefined;
	 // Active status
    $scope.activeStatus = {};
    // The selected status and its ID
    $scope.selectedActiveStatus = {};
    $scope.selectedActiveStatus.activeId = undefined;
    
    $scope.seq=1;
    
    $scope.fields={
    		btnId		: undefined,
    		btnName		: undefined,
    		btnActive	: undefined
    };
    
    // The column number and its names
	var columnsNames = {
				SEQ   			: 0,
				BTN_ID			: 1,
				BTN_NAME		: 2,
				BTN_DESCRIPTION	: 3,
				BTN_STATUS_ID	: 4,
				BTN_STATUS		: 5,
				ID				: 6
				
	};
	
	
    

    
    
	 /**
     * Fetch menu status
     */
    var fetchActiveStatus = function () {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(function successCallback(response) {
        	var btnStatusResponse = response.data;

            if (btnStatusResponse.flag === 'success') {
                $scope.activeStatus = btnStatusResponse.active;
                shareDataService.org.setIsEnabled($scope.active);
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };
	
	 $scope.activeStatusSelectChanged = function () {
	        $scope.fields.btnActive = $scope.selectedActiveStatus.activeId;
	        
	  };
	  
	  $scope.search = function (){
	    	 // Re-initialize the DataTables
	    	var dataTablesSelector = angular.element('#tblButtons');
	    	dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
	        dataTableUtils.enableSingleSelect(dataTablesSelector);
	    };
	    
	    /**
	     * Clear button behaviour
	     */
	    $scope.clear = function () {

	        // Clear dropdowns
	    
	    	$scope.selectedActiveStatus.activeId = undefined;
	        
	        fetchActiveStatus();

	        // Clear input fields
	        formUtils.clearForm($scope.fields);

	        // Re-initialize the DataTables
	        var dataTablesSelector = angular.element('#tblButtons');
	    	dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
	        dataTableUtils.enableSingleSelect(dataTablesSelector);

	    };
	    angular.element(function(){
	    	fetchActiveStatus();
	    	var tblButtons = angular.element('#tblButtons');
	    	dataTableUtils.enableSingleSelect(tblButtons);
	    	
	    	
	    });
	    
	    
	 // Initialization parameters for DataTable
	    $scope.dataTableParms = {
	    		searching: false, // Disable built-in searching
	            serverSide: true, // Enables the server-side processing
	            processing: true, // Enables the "Processing..." indicator
	            autoWidth: false, // Disable column width auto determining
	            bDeferRender:true,
	            pagingType: 'full_numbers', // Paging buttons contains "First", "Last", "Previous", "Next", and numbers
	            language:{
	            	// I18n options, see https://datatables.net/reference/option/ for details
	                paginate: {
	                    previous: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_PREV_PAGE'),
	                    next: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_NEXT_PAGE'),
	                    first: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_FIRST_PAGE'),
	                    last: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_LAST_PAGE')
	                },
	                emptyTable  : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_EMPTY_TABLE'),
	                info        : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO'),
	                infoFiltered: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO_FILTERED'),
	                infoEmpty   : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_EMPTY'),
	                lengthMenu  : $filter('translate')('pages.common.COMMON_FIELDS.COMMON_FIELD_LENGTH_MENU'),
	                processing  : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PROCESSING')
	           
	            },
	            ajax:{
	            	url		: CLB_FRONT_BASE_URL+'btn/queryBtnInfoWithFilter',
	            	data	: $scope.fields,
	            	dataSrc : 'data'
	            },
	            columnDefs:[
	            	{data:null,
	            		render:function(data,type,row,meta){
	   		            var startIndex = meta.settings._iDisplayStart;
	   		             return startIndex+meta.row+1;
	   		         },
	   		         targets:[0],
	   		         visible:true}
	            ],
	            columns:[
	            	// Specify which property to pick for the corresponding column
	            //	{data:null},//序号
	            	{data:null,
	            		render:function(data,type,row,meta){
	   		            var startIndex = meta.settings._iDisplayStart;
	   		             return startIndex+meta.row+1;
	   		         },targets:[0],visible:true},
	            	{data: 'btnId',visible:true},
	            	{data: 'btnName',visible:true},
	            	{data: 'btnDescription',visible:true},
	            	{data: 'btnActive',visible:true},
	            	{data: 'btnActiveStatus',visible:true},
	            	{data:'Id',visible:true}
	            ],
	            
	            order:[[columnsNames.BTN_NAME,"asc"]]
	    };
	
});

app.controller('AccordionCtrl',function($scope,$filter){
	$scope.oneAtATime=true;
	$scope.accordionTitle=$filter('translate')('pages.sm.btn.BTN_MGMT_FORM_TITLES.BTN_MGMT_FORM_TITLE_SEARCH');
	$scope.status={
		isFirstOpen:false,
		isFirstDisabled:false
	};
});


