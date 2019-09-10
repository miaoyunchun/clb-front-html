'use strict';

app.controller('PosDeleteModalCtrl',function($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, shareDataService, toasterUtils){
	
	// Models
    $scope.selectedStatus = {};
    $scope.selectedOrg = {};
    $scope.selectedDep = {};
	
	$scope.fields = {
			posId         : undefined,
	        posName       : undefined,
	        posCode       : undefined,
	        posDescription: undefined,
	        posActive     : undefined,
	        depId         : undefined,
	        orgId         : undefined,
        posOperatorId     : sessionStorage.getItem('userId'),
	        isEdited      : undefined
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
	
	
	// Alert when operation is successful
    var deleteSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.pos.POS_MGMT_ALERTS.POS_MGMT_ALERT_POS_DELETE_SUCCESSFUL')
        });
    };

    // Alert when operation failed
    var deleteFailAlert = function (message) {
        $scope.alerts.push({
            type: 'danger',
            msg : message
        });
    };
	
 // Close the alert
    var closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    
    /**
     * Delete user
     */
    $scope.delete = function () {
        // Clear alerts
        $scope.alerts = [];

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'pos/deletePosInfo',
            params: {
                'posId'                       : $scope.fields.posId,
                'posRequiredVo.posOperatorId': $scope.fields.posOperatorId
            }
        }).then(function successCallback(response) {
            $scope.responseData = response.data;

            if ($scope.responseData.flag === 'failed') {
            	if($scope.responseData.message != null){
            		deleteFailAlert($scope.responseData.message);
            	}else{
            		deleteFailAlert($filter('translate')('pages.sm.pos.POS_MGMT_ALERTS.POS_MGMT_ALERT_POS_DELETE_FAILED'));
            	}
            	

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            } else {
                // Display an alert
            	deleteSuccessAlert();
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
        var selectedRowItems = shareDataService.common.getSelectedRowItems();
        $scope.fields.posId =selectedRowItems.posId;
        $scope.fields.posName =selectedRowItems.posName;
        $scope.fields.posCode =selectedRowItems.posCode;
        $scope.fields.posDescription =selectedRowItems.posDescription;
        $scope.fields.depId =selectedRowItems.depName;
        $scope.fields.orgId =selectedRowItems.orgName;
        $scope.fields.posActive =selectedRowItems.posActiveStatus;
       

    });
});

app.controller('DeletePosModalInstanceCtrl',function($scope, $modal, $filter, toasterUtils, shareDataService){
	$scope.showDeletePosPopup = function(){
		 var table = angular.element('#tblPositions').DataTable();

	        if (table.row('.active').length === 1) {
	            shareDataService.common.setSelectedRowItems(table.row('.active').data());

	            // debugger;

	            $modal.open({
	                backdrop   : 'static',
	                templateUrl: 'deletePosModal.html',
	                controller : 'PosDeleteModalCtrl',
	                size       : 'lg'
	            });
	        } else {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
	        }
	};
});