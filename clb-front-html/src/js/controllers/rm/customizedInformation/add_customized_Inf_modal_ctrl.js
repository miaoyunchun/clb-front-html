'use strict';
//点击Add按钮，弹出添加客户自定义的modal框
app.controller('addCustomizedInformationModalInstanceCtrl',function ($scope,$modal) {
    $scope.showAddCustomizedInfPopup = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addCustomizedInformationModal.html',
            controller: 'addCustomizedInfModalCtrl',
            size: 'lg'
        });
    }
});

app.controller('addCustomizedInfModalCtrl',function ($scope,$modalInstance,$http,$filter,$timeout) {
		$scope.isFormDisabled = false;
		$scope.fields = {//页面表单数据
			'crdmnNumber': '',
			'crdmnDefinedDesc': '',
			'crdmnLastMainDate': '',
			'crdmnDefinedTitl': '',
			'crdmnDefinedContent': '',
			'crdmnMaker': ''
			
		};
	    $scope.emptyFields = {//用于清空页面表单数据
    		crdmnNumber: '',
			crdmnDefinedDesc: '',
			crdmnDefinedTitl: '',
			crdmnDefinedContent: '',
			crdmnMaker: ''
	    };
	  //添加客户时开户和上次维护时间显示系统当前时间
    	$scope.nowTime=new Date();
    	$scope.fields.crdmnLastMainDate=$filter('date')($scope.nowTime,'yyyy-MM-dd');
	   //点击cancel按钮关闭modal框
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    //点击维护按钮维护数据
	    $scope.customizedInf = function(){
	    	var param=getFormData(angular.element('#formAddCustomizedInfFilter'));//获取客户事件表单数据
	    	console.log(param);
	    	$http({
	    		method: 'POST',
	            url: RM_URL.RM_SPEITEM_UPD,//访问clb-consumer请求数据
	            data:{'megid': 'test',
	                "user": 'test',
	                "param": param,
	                "correlid":'test'}
	    	}).then(function successCallback(response){
	    		if(response.status==200){//添加成功
	    			console.log('返回结果');
	    			console.log(response.data);
	    			console.log(response);
	    			if(response.data.code == '0000'){//客户自定义信息新增成功
	    				$scope.isFormDisabled = true;
	                    msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_ADD_SUCCESS');
	                    $scope.alerts = [];
	                    addSuccessAlert();

	                    $timeout(function () {
	                        $modalInstance.dismiss('cancel');
	                    }, 5000);
	                }else{
	                	if(response.data.code=="0002"){
	                		msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_ADD_FAIL2');
		                    $scope.alerts = [];
		                    addFailAlert();

		                    $timeout(function () {
		                        $scope.alerts = [];
		                    },3000);
	                	}else if(response.data.code=="0003"){
	                		msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_ADD_FAIL3');
		                    $scope.alerts = [];
		                    addFailAlert();

		                    $timeout(function () {
		                        $scope.alerts = [];
		                    },3000);
	                	}else{
	                		msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_ADD_FAIL');
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
	    
	    $scope.ctaleFuncs=[
	    	{"value":"a","name":"客户重大事件添加"},
	    	{"value":"u","name":"客户重大事件更新"},
	    	{"value":"q","name":"客户重大事件查询"},
	    	{"value":"d","name":"客户重大事件删除"}
	    ];
	    
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

