'use strict';
app.controller('RoleMenuNameAddModalCtrl',function($scope,$modalInstance, $filter, $timeout, $http, toasterUtils, dataTableUtils, shareDataService,uiLoad,JQ_CONFIG,$ocLazyLoad){
	
	$scope.menuList=undefined;
	$scope.menuSelected=undefined;
	$scope.roleName=undefined;

	$scope.fields={
			roleId	:undefined,
			menuName:undefined,
			menuId	:undefined
	}
	$scope.checked = [];
    $scope.selected={
    		selectAll:false
    };
    var menuIds="";
    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];
	/*var fetchAllMenuName=function(){
		 $http({
	    	   method: 'POST',
	           url   : CLB_FRONT_BASE_URL + 'role/queryMenuName'
	           
	       }).then(function successfulCallback(response) {
	           var responseData = response.data;

	        //   inputUsername.$setValidity('usernameAvailable', responseData.flag === 'success');
	           if (responseData.flag == 'success') {
	        	   $scope.menuList=responseData.data;
	           }
	       }, function failedCallback() {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	}*/
	var fetchSelectedMenuName=function(){
		$http({
	    	   method: 'POST',
	           url   : CLB_FRONT_BASE_URL + 'role/queryMenuNameByRoleId',
	           params:{
	        	   roleId : $scope.fields.roleId
	           }
	       }).then(function successfulCallback(response) {
	           var responseData = response.data;

	           if (responseData.flag == 'success') {
	        
	        	//   console.log(2);
	        	   $scope.menuSelected=responseData.data;
	        	   $scope.selectedInitialize();
	        //	   console.log($scope.checked);
	           }
	       }, function failedCallback() {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	}
	

    //初始化CheckBox checked
    $scope.selectedInitialize = function(){
    	var treeObj = $.fn.zTree.getZTreeObj("tree");
        var nodes = treeObj.getCheckedNodes(false);
        angular.forEach(nodes, function (node) {
        	angular.forEach($scope.menuSelected , function (menuSelected) {
        	if(node.id===menuSelected.menuId){
        		//console.log(node.isChecked);
   	        	 node.isChecked=true;
   	        //	 console.log(node.isChecked);
   	        	 return;
        	}
        })
    		
    	});
        treeObj.refresh();
    }
   

 // Alert when operation is successful
    var saveSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg : $filter('translate')('pages.sm.role.ROLE_MGMT_ALERTS.ROLE_MGMT_ALERT_MENU_MGT_SAVE_SUCCESSFUL')
        });
    };

    // Alert when operation failed
    var saveFailAlert = function () {
        $scope.alerts.push({
            type: 'danger',
            msg : $filter('translate')('pages.sm.role.ROLE_MGMT_ALERTS.ROLE_MGMT_ALERT_MENU_MGT_SAVE_FAIL')
        });
    };
    
 // Close the alert
    var closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    
    $scope.add=function(){
    	// Clear alerts
        $scope.alerts = [];
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        var nodes = treeObj.getCheckedNodes(true);
        angular.forEach(nodes, function (node) {
        	 console.log(node.isChecked);
        	 node.isChecked=false;
        	 console.log(node.isChecked);
        	menuIds=menuIds+node.id+";";
        })
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'role/roleMenuNameMgt',
            params: {
                'roleId'    : $scope.fields.roleId,
                'menuIds'   : menuIds,
                'operatorId': sessionStorage.getItem('userId')
            }
        }).then(function successCallback(response) {
            $scope.responseData = response.data;

            if ($scope.responseData.flag === 'failed') {
            	saveFailAlert();

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            } else {
                // Display an alert
                saveSuccessAlert();
                
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
    
    
    
    $timeout(function () {
//    	fetchAllMenuName();
    	var selectedRowItems = shareDataService.common.getSelectedRowItems();
    	$scope.fields.roleId=selectedRowItems.roleId;
    	$scope.roleName=selectedRowItems.roleName;
//    	fetchSelectedMenuName();
    	var setting = {
    			check: {
    				enable: true,
    				chkStyle: "checkbox"
    			},
    			view: {
    				dblClickExpand: true,
    				showLine: false,
    				selectedMulti: false
    			},
    			data: {
    				simpleData: {
    					enable:true,
    					idKey: "id",
    					pIdKey: "pId",
    					rootPId: ""
    				},
	    			key: {
	    				checked: "isChecked"
	    			}
    			},
    			callback: {
    				beforeClick: function(treeId, treeNode) {
    					var zTree = $.fn.zTree.getZTreeObj("tree");
    					if (treeNode.isParent) {
    						zTree.expandNode(treeNode);
    						return false;
    					} else {
    						return true;
    					}
    				}
    			}
    		};
    	
   		 $http({
   	    	   method: 'POST',
   	           url   : CLB_FRONT_BASE_URL + 'role/queryMenuName'
   	           
   	       }).then(function successfulCallback(response) {
   	           var responseData = response.data;

   	        //   inputUsername.$setValidity('usernameAvailable', responseData.flag === 'success');
   	           if (responseData.flag == 'success') {
   	        	  
   	        	   $scope.menuList=responseData.data;
	   	        	var znode=$scope.menuList;		   	     	
	   	        	var t = $("#tree");
		   	     	t = $.fn.zTree.init(t, setting,znode);
			   	    var treeObj = $.fn.zTree.getZTreeObj("tree"); 
			  	    treeObj.expandAll(true); 
			  //  console.log(1);
		   	     	fetchSelectedMenuName();
   	           }
   	       }, function failedCallback() {
   	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
   	        });
  
    }, 500);  
   
	
	    
});


app.controller('AddRoleMenuNameModalInstanceCtrl',function($scope, $modal,$filter,toasterUtils,shareDataService){
	$scope.showAddRoleMenuNamePopup = function(){
		 var table = angular.element('#tblRoles').DataTable();
		 if (table.row('.active').length === 1) {
	            shareDataService.common.setSelectedRowItems(table.row('.active').data());
				$modal.open({
					backdrop	:'static',
					templateUrl	:'addRoleMenuNameModal.html',
					controller	:'RoleMenuNameAddModalCtrl',
					size		:'lg'
				});
		 }else{
			 toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
		 }
	};
});