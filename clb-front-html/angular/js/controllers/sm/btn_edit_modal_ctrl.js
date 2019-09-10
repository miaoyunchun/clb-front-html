'use strict';

app.controller('BtnEditModalCtrl',function($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService, toasterUtils){
	 $scope.status = undefined;
	    
	 // Models
    $scope.selectedStatus = {};
	$scope.fields = {
			isEdited      : undefined,
			Id            : undefined,
			btnId         : undefined,
			btnName       : undefined,
			btnDescription: undefined,
			btnActive     : undefined,
        btnOperatorId     : sessionStorage.getItem('userId')
	};
	$scope.originalBtnId = undefined;
	
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
    var editSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.btn.BTN_MGMT_ALERTS.BTN_MGMT_ALERT_BTN_EDIT_SUCCESSFUL')
        });
    };

    // Alert when operation failed
    var editFailAlert = function (message) {
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
    //校验btnId是否重复
    $scope.chkBtnIdExistence =  function(inputBtnId){
    	
    	if($scope.fields.btnId === $scope.originalBtnId){
    		inputBtnId.$setValidity('btnIdAvailable',true);
    		$scope.alerts = [];
            return;
    	}
    	
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
	                editFailAlert($filter('translate')('pages.sm.btn.BTN_MGMT_ALERTS.BTN_MGMT_ALERT_INVALID_BTNID'));
	            }
	   	 },function failedCallback(){
	   		 toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	   	 });
    };
    //edit
    $scope.edit = function(formEditBtn){
    	// Clear alerts
        $scope.alerts = [];
        
        $http({
        	method:'POST',
        	url:CLB_FRONT_BASE_URL+'btn/editButtonInfo',
        	params:{
        		'isEdited':formEditBtn.$dirty,
        		'Id'		:$scope.fields.Id,
        		'btnId': $scope.fields.btnId,
        		'btnName':$scope.fields.btnName,
        		'btnDescription':$scope.fields.btnDescription,
        		'btnActive':$scope.fields.btnActive,
        		'btnOperatorId':$scope.fields.btnOperatorId
        	}
        }).then(function successCallback(response){
        	$scope.responseData = response.data;
        	
        	if ($scope.responseData.flag === 'failed') {
                editFailAlert($scope.responseData.message);

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            }else{
            	// Display an alert
                editSuccessAlert();
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
    	
    
    
 // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    angular.element(function(){
    	fetchBtnActive();
    	var selectedRowItems = shareDataService.common.getSelectedRowItems();
    	$scope.fields.Id=selectedRowItems.Id;
    	$scope.fields.btnId = selectedRowItems.btnId;
    	$scope.fields.btnName = selectedRowItems.btnName;
    	$scope.fields.btnDescription = selectedRowItems.btnDescription;
    	$scope.fields.btnActive = selectedRowItems.btnActive;
    	
    	$scope.originalBtnId=$scope.fields.btnId;
    	$scope.selectedStatus.selected = String($scope.fields.btnActive);
    });
    
	
});


app.controller('EditBtnModalInstanceCtrl', function ($scope, $modal, $filter, toasterUtils, shareDataService) {
    $scope.showEditBtnPopup = function () {
        var table = angular.element('#tblButtons').DataTable();

        if (table.row('.active').length === 1) {
            shareDataService.common.setSelectedRowItems(table.row('.active').data());

            // debugger;

            $modal.open({
                backdrop   : 'static',
                templateUrl: 'editBtnModal.html',
                controller : 'BtnEditModalCtrl',
                size       : 'lg'
            });
        } else {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
        }
    };
});