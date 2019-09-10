'use strict';

app.controller('PosAddModalCtrl',function($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService, toasterUtils){
	//posName校验规则
	$scope.regexPosName = shareDataService.common.getRegexUsername();
	$scope.regexPosCode = shareDataService.common.getRegexCode();
	
	// Initialize data and placeholders
	$scope.placeholders = shareDataService.pos.getPosPlaceholders();
	$scope.organizations = undefined;
    $scope.departments = undefined;
    $scope.status = undefined;
    
 // Models
    $scope.selectedStatus = {};
    $scope.selectedOrg = {};
    $scope.selectedDep = {};
	
	$scope.fields = {
	        posName       : undefined,
	        posCode       : undefined,
	        posDescription: undefined,
	        posActive     : undefined,
	        depId         : undefined,
	        orgId         : undefined,
        posOperatorId     : sessionStorage.getItem('userId')
	    };
	
	
	 $scope.responseData = {
		        flag   : '',
		        data   : {},
		        message: ''
		    };
	
	 $scope.alerts = [
	        // { type: 'danger', msg: '' }
	    ];
	 
	    $scope.isFormDisabled = false;

	    $scope.isOrgSelectDisabled = false;
	    $scope.isDepSelectDisabled = false;

	    /**
	     * Fetch departments with given parameters
	     * @param orgId ID of associated organization
	     * @param posId ID of associated position
	     */
	    var fetchDepartments = function (orgId) {
	        $scope.isDepSelectDisabled = true;

	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryDepartmentName',
	            params: {
	                orgId: orgId ? orgId : undefined
	            }
	        }).then(function successfulCallback(response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.departments = responseData.departmentInfo;

	                if ($scope.departments.length === 1) {
	                    $scope.selectedDep.selected = $scope.departments[0];
	                    $scope.fields.depId = $scope.selectedDep.selected.depId;
	                }
	            }

	            $scope.isDepSelectDisabled = false;
	        }, function failedCallback() {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	            $scope.isDepSelectDisabled = false;
	        });
	    };

	    /**
	     * Fetch organizations with given paramenters
	     * @param posId ID of associated position
	     * @param depId ID of associated department
	     */
	    var fetchOrganizations = function (depId) {
	        $scope.isOrgSelectDisabled = true;

	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOrganizationName',
	            params: {
	                depId: depId ? depId : undefined
	            }
	        }).then(function successfulCallback(response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.organizations = responseData.organizationInfo;

	                if ($scope.organizations.length === 1) {
	                    $scope.selectedOrg.selected = $scope.organizations[0];
	                    $scope.fields.orgId = $scope.selectedOrg.selected.orgId;
	                }
	            }

	            $scope.isOrgSelectDisabled = false;
	        }, function failedCallback() {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	            $scope.isOrgSelectDisabled = false;
	        });
	    };
	    
	    var performInitialAjaxes = function () {


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
	                $scope.status = responseData.active;

	                $scope.selectedStatus.selected = $scope.status[1];

	                $scope.statusSelectOnChange();
	            }
	        }, function failedCallback() {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	    };
	 
	 
	 // Alert when operation is successful
	    var addSuccessAlert = function () {
	        $scope.alerts.push({
	            type: 'success',
	            msg : $filter('translate')('pages.sm.pos.POS_MGMT_ALERTS.POS_MGMT_ALERT_POS_ADD_SUCCESSFUL')
	        });
	    };

	    // Alert when operation failed
	    var addFailAlert = function (message) {
	        $scope.alerts.push({
	            type: 'danger',
	            msg : message
	        });
	    };
	    
	    // Close the alert
	    var closeAlert = function (index) {
	        $scope.alerts.splice(index, 1);
	    };
	    
	    $scope.statusSelectOnChange = function () {
	        $scope.fields.posActive = $scope.selectedStatus.selected.value;
	    };
	    
	    $scope.orgIdSelectOnChange = function () {
	        var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected.orgId : undefined;
	       
	        var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected.depId : undefined;

	        fetchDepartments(orgId);
	        
	        $scope.fields.orgId = $scope.selectedOrg.selected.orgId;
	    };

	    $scope.depIdSelectOnChange = function () {
	        var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected.orgId : undefined;
	      
	        var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected.depId : undefined;

	        fetchOrganizations( depId);
	       
	        $scope.fields.depId = $scope.selectedDep.selected.depId;
	    };
	    
	    $scope.clearSelect = function () {
	        $scope.selectedOrg.selected = undefined;
	        $scope.selectedDep.selected = undefined;

	        performInitialAjaxes();
	    };
	 
	 $scope.chkPosNameExistence = function(inputPosCode){
		 $scope.alerts = [];
		 
		 $http({
			 method : 'POST',
			 url	: CLB_FRONT_BASE_URL + 'pos/isPosCodeExisted',
			 params: {
	                'posRequiredVo.posCode': $scope.fields.posCode,
	                'isEdited'               : inputPosCode.$dirty
			 }
	      }).then(function successfulCallback(response) {
	             var responseData = response.data;

	             inputPosCode.$setValidity('posCodeAvailable', responseData.flag === 'success');
	             if (responseData.flag !== 'success') {
	                 addFailAlert($filter('translate')('pages.sm.pos.POS_MGMT_ALERTS.POS_MGMT_ALERT_INVALID_POSCODE'));
	             }
	         }, function failedCallback() {
	             toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	         }); 
		 };
		 
		 /**
		     * Add new position
		     */
		    $scope.add = function () {
		        // Clear alerts
		        $scope.alerts = [];

		        $http({
		            method: 'POST',
		            url   : CLB_FRONT_BASE_URL + 'pos/addNewPosInfo',
		            params: {
		                'posRequiredVo.posName'      : $scope.fields.posName,
		                'posRequiredVo.posCode'      : $scope.fields.posCode,
		                'posRequiredVo.posDescription'   : $scope.fields.posDescription,
		                'posRequiredVo.posActive'    : $scope.fields.posActive,
		                'posRequiredVo.depId'         : $scope.fields.depId,
		                'posRequiredVo.orgId'         : $scope.fields.orgId,
		                'posRequiredVo.posOperatorId': $scope.fields.posOperatorId
		            }
		        }).then(function successCallback(response) {
		            $scope.responseData = response.data;

		            if ($scope.responseData.flag === 'failed') {
		                addFailAlert($scope.responseData.message);

		                $timeout(function () {
		                    closeAlert(0);
		                }, 5000);
		            } else {
		                // Display an alert
		                addSuccessAlert();
		                // Disable the form
		                $scope.isFormDisabled = true;
		                // Refresh the data table
		                angular.element('#tblPositions').DataTable().ajax.reload(null, false);
		                // Close the modal 5 seconds later
		                $timeout(function () {
		                    $modalInstance.dismiss('cancel');
		                }, 2000);
		            }

		        }, function errorCallback() {
		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
		            $timeout(function () {
		                $modalInstance.dismiss('cancel');
		            }, 3000);
		        });
		    };
	 
	  // Close modal
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    
	    angular.element(function () {
	        performInitialAjaxes();
	    });
	 
	 
});


app.controller('AddPosModalInstanceCtrl',function ($scope, $modal){
	$scope.showAddOptPopup=function () {
		
		$modal.open({
			backdrop	: 'static' ,
			templateUrl	: 'addPosModal.html',
			controller	: 'PosAddModalCtrl',
			size		: 'lg'
		});
	};
});