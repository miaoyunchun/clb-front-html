'use strict';
//点击Add按钮，弹出添加客户关系的modal框
var msg=undefined;
app.controller('addCustomerRelationModalInstanceCtrl',function ($scope,$modal) {
    $scope.showAddCustomerRelaPopup = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addCustomerRelationModal.html',
            controller: 'addCustomerRelaModalCtrl',
            size: 'lg'
        });
    }
});

app.controller('addCustomerRelaModalCtrl',function ($scope,$modalInstance,$http,$filter,$timeout) {
		$scope.isFormDisabled = false;
		$scope.fields = {//页面表单数据
			'crealCusNum': '',
			'crealRelCus': '',
			'crealMainDate': '',
			'crealRetype': '',
			'crealMark': '',
			'crealMaker': ''
			
		};
	    $scope.emptyFields = {//用于清空页面表单数据
    		crealCusNum: '',
			crealRelCus: '',
			crealMainDate: '',
			crealRetype: '',
			crealMark: '',
			crealMaker: ''
	    };
	  //添加客户时开户和上次维护时间显示系统当前时间
    	$scope.nowTime=new Date();
    	$scope.fields.crealMainDate=$filter('date')($scope.nowTime,'yyyy-MM-dd');
	   //点击cancel按钮关闭modal框
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    //点击添加按钮添加数据
	    $scope.addCustomerRelation = function(){
	    	var param=getFormData(angular.element('#formAddCustomerRelaFilter'));//获取客户关系表单数据
	    	console.log(param);
	    	$http({
	    		method: 'POST',
	            url: RM_URL.RM_CUSTREL_MNT,//访问clb-consumer请求数据
	            data:{'megid': 'test',
	                "user": 'test',
	                "param": param,
	                "correlid":'test'}
	    	}).then(function successCallback(response){
	    		console.log('返回结果');
    			console.log(response.data);
    			console.log(response);
	    		if(response.status=="200"){//添加成功
	    			if(response.data.code=="0000"){
	    				$scope.isFormDisabled = true;
	    				msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_ADD_SUCCESS');
	                    $scope.alerts = [];
	                    addSuccessAlert();

	                    $timeout(function () {
	                        $modalInstance.dismiss('cancel');
	                    }, 5000);
	    			}else{
	    				if(response.data.code=="0001"){
	    					msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_ADD_FAIL2');
		                    $scope.alerts = [];
		                    addFailAlert();

		                    $timeout(function () {
		                        $scope.alerts = [];
		                    },3000);
	    				}else if(response.data.code=="0003"){
	    					msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_ADD_FAIL3');
		                    $scope.alerts = [];
		                    addFailAlert();

		                    $timeout(function () {
		                        $scope.alerts = [];
		                    },3000);
	    				}else if(response.data.code=="0008"){
	    					msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_ADD_FAIL4');
		                    $scope.alerts = [];
		                    addFailAlert();

		                    $timeout(function () {
		                        $scope.alerts = [];
		                    },3000);
	    				}else{
	    					msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_ADD_FAIL');
		                    $scope.alerts = [];
		                    addFailAlert();

		                    $timeout(function () {
		                        $scope.alerts = [];
		                    },3000);
	    				}
	    			}
	    		}else{
	    			msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2');
	                $scope.alerts = [];
	                addFailAlert();
	                $timeout(function () {
	                    $scope.alerts = [];
	                },3000);
	    		}
	    	},function errorCallback(response){//请求失败时执行代码
	    		msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2');
                $scope.alerts = [];
                addFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
        	});
	    };	
	    
	    $scope.alerts = [];
	 // Alert when operation is successful
	     var addSuccessAlert = function () {
	         $scope.alerts.push({
	             type: 'success',
	             msg: msg
	         });
	     };

	 // Alert when operation failed
	     var addFailAlert = function (message) {
	         $scope.alerts.push({
	             type: 'danger',
	             msg: msg
	         });
	     };
		     
	    $scope.clear=function(){
	    	 $scope.fields = angular.copy($scope.emptyFields);//重置时清空页面表单数据
	    	
	    };
	    
}); 


//日历的插件
app.controller('AvailDateCtrl',function ($scope) {
  $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
  }
});


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

