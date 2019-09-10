'use strict';

app.controller('PosMgmtCtrl', function ($scope, $http, $filter, $timeout, $interval, toaster, shareDataService, dataTableUtils, dateTimeUtils, formUtils, toasterUtils) {
	$scope.placeholders = shareDataService.pos.getPosPlaceholders();
	
	// Models
    $scope.selectedStatus = {};
    $scope.selectedDep = {};
    $scope.selectedOrg = {};
    
    
 // Receive data from AJAX
    $scope.active = undefined;
    $scope.departmentInfo = undefined;
    $scope.organizationInfo = undefined;
    $scope.active = undefined;
	
    
    $scope.fields={
    		posName	 	: undefined	,
    		posCode	 	: undefined	,
    		posActive	: undefined ,
    		orgId     	: undefined,
    		depId  		: undefined
    	};
    /**
     * Fetch departments with given parameters
     * @param orgId ID of associated organization
     */
    var fetchDepartments = function (orgId) {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryDepartmentName',
            params: {
                orgId: orgId ? orgId : undefined
            }
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.departmentInfo = responseData.departmentInfo;

                if ($scope.departmentInfo.length === 1) {
                    $scope.selectedDep.selected = $scope.departmentInfo[0];
                }
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };
    
    /**
     * Fetch organizations with given paramenters
     * @param depId ID of associated department
     */
    var fetchOrganizations = function (depId) {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOrganizationName',
            params: {
                depId: depId ? depId : undefined
            }
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.organizationInfo = responseData.organizationInfo;

                if ($scope.organizationInfo.length === 1) {
                    $scope.selectedOrg.selected = $scope.organizationInfo[0];
                }
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };
	
    var performInitialAjaxes = function (){
    	
    	// Fetch departments
    	fetchDepartments(undefined);
    	
    	// Fetch organizations
        fetchOrganizations(undefined);
    	
    	// Fetch status
        $http({
            method: 'GET',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.active = responseData.active;
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };
	
	
	 // The column number and its names
	var columnsNames = {
				SEQ   			: 0,
				POS_ID			: 1,
				POS_CODE		: 2,
				POS_NAME		: 3,
				ROLE_NAME		: 4,
				DEP_ID			: 5,
				DEP_NAME		: 6,
				ORG_ID			: 7,
				ORG_NAME		: 8,
				POS_DESCRIPTION	: 9,
				POS_STATUS_ID	: 10,
				POS_STATUS		: 11
	};
	
	
	// Initialization parameters for DataTable
    $scope.dataTableParms = {
        searching: false, // Disable built-in searching
        serverSide: true, // Enables the server-side processing
        processing: true, // Enables the "Processing..." indicator
        autoWidth: false, // Disable column width auto determining
        pagingType: 'full_numbers', // Paging buttons contains "First", "Last", "Previous", "Next", and numbers
        language: {
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
        ajax: {
            url: CLB_FRONT_BASE_URL+'pos/queryPosWithFilter',
            data: $scope.fields,
            dataSrc: 'data'
        },
        columns: [
            // Specify which property to pick for the corresponding column
            {data: 'seq', visible:true},
            {data: 'posId', visible:false},
            {data: 'posCode', visible:true},
            {data: 'posName', visible:true},
            {data: 'roleName', visible:true},
            {data: 'depId', visible:false},
            {data: 'depName', visible:true},
            {data: 'orgId', visible:false},
            {data: 'orgName', visible:true},
            {data: 'posDescription', visible:true},
            {data: 'posActiveStatus', visible:true},
            {data: 'posActive', visible:false}
        ],
        order: [[columnsNames.POS_NAME, "desc"]]
    };
    
    
    $scope.activeStatusSelectChanged = function () {
        $scope.fields.posActive = $scope.selectedStatus.selected.value;
        
    };
    
    $scope.orgIdSelectOnChange = function () {
        var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected.orgId : undefined;
        var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected.depId : undefined;

        fetchDepartments(orgId);

        $scope.fields.orgId = $scope.selectedOrg.selected.orgId;
    };
    
    $scope.depIdSelectOnChange = function () {
    	 var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected.depId : undefined;
    	 var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected.orgId : undefined;
    	 
    	 fetchOrganizations(depId);
    	 
    	 $scope.fields.depId = $scope.selectedDep.selected.depId;
    }
    
    $scope.clearSelect = function () {
        $scope.selectedOrg.selected = undefined;
        $scope.selectedDep.selected = undefined;
     
        performInitialAjaxes();
    };
    
    $scope.search = function (){
    	 // Re-initialize the DataTables
    	var dataTablesSelector = angular.element('#tblPositions');
    	 dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
         dataTableUtils.enableSingleSelect(dataTablesSelector);
    };
    
    /**
     * Clear button behaviour
     */
    $scope.clear = function () {

        // Clear dropdowns
    	$scope.selectedOrg.selected = undefined;
        $scope.selectedDep.selected = undefined;
        $scope.selectedStatus.selected = undefined;
        
        performInitialAjaxes();

        // Clear input fields
        formUtils.clearForm($scope.fields);

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblPositions');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    };
    
    
    angular.element(function () {
    	 var tblPositions = angular.element('#tblPositions');

         dataTableUtils.enableSingleSelect(tblPositions);

    	 performInitialAjaxes();
    	 
    });
	
});

app.controller('AccordionCtrl',function($scope,$filter){
	$scope.oneAtATime=true;
	$scope.accordionTitle=$filter('translate')('pages.sm.pos.POS_MGMT_FORM_TITLES.POS_MGMT_FORM_TITLE_SEARCH');
	$scope.status={
		isFirstOpen:false,
		isFirstDisabled:false
	};
})