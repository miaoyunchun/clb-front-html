'use strict';

app.controller('BtnAddModalCtrl',function($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService, toasterUtils){
	
	
	
	 $scope.status = undefined;
	    
	 // Models
	    $scope.selectedStatus = {};
	$scope.fields = {
			btnId         : undefined,
			btnName       : undefined,
			btnDescription: undefined,
			btnActive     : undefined,
        btnOperatorId     : sessionStorage.getItem('userId')
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
	
	var fetchBtnActive = function (){
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
            msg : $filter('translate')('pages.sm.btn.BTN_MGMT_ALERTS.BTN_MGMT_ALERT_BTN_ADD_SUCCESSFUL')
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
        $scope.fields.btnActive = $scope.selectedStatus.selected.value;
    };
	
	
	
	/**
     * Add new button
     */
    $scope.add = function () {
    	// Clear alerts
        $scope.alerts = [];
        
        $http({
        	method:'POST',
        	url:CLB_FRONT_BASE_URL+'btn/addNewButtonInfo',
        	params:{
        		'btnId': $scope.fields.btnId,
        		'btnName':$scope.fields.btnName,
        		'btnDescription':$scope.fields.btnDescription,
        		'btnActive':$scope.fields.btnActive,
        		'btnOperatorId':$scope.fields.btnOperatorId
        	}
        }).then(function successCallback(response){
        	$scope.responseData = response.data;
        	
        	if ($scope.responseData.flag === 'failed') {
                addFailAlert($scope.responseData.message);

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            }else{
            	// Display an alert
                addSuccessAlert();
                // Disable the form
                $scope.isFormDisabled = true;
                // Refresh the data table
                angular.element('#tblButtons').DataTable().ajax.reload(null, false);
                // Close the modal 5 seconds later
                $timeout(function () {
                    $modalInstance.dismiss('cancel');
                }, 2000);
            }
        	
        })
    };
	 
    $scope.chkBtnIdExistence =  function(inputBtnId){
    	 $scope.alerts = [];
    	 $http({
    		 method:'POST',
    		 url:CLB_FRONT_BASE_URL+'btn/isBtnIdExisted',
    		 params:{
    			 'btnId':$scope.fields.btnId,
    			 'isEdited':inputBtnId.$dirty
    		 }
    	 }).then(function successfulCallback(response){
    		 var responseData = response.data;
    		 inputBtnId.$setValidity('btnIdAvailable', responseData.flag === 'success');
             if (responseData.flag !== 'success') {
                 addFailAlert($filter('translate')('pages.sm.btn.BTN_MGMT_ALERTS.BTN_MGMT_ALERT_INVALID_BTNID'));
             }
    	 },function failedCallback(){
    		 toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
    	 });
    };
	
	
	// Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    //初始化
    angular.element(function(){
    	fetchBtnActive();
    });
});


app.controller('AddBtnModalInstanceCtrl',function ($scope, $modal){
	$scope.showAddBtnPopup=function () {
		
		$modal.open({
			backdrop	: 'static' ,
			templateUrl	: 'addBtnModal.html',
			controller	: 'BtnAddModalCtrl',
			size		: 'lg'
		});
	};
});