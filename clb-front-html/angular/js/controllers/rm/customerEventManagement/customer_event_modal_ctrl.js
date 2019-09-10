'use strict';
//点击维护按钮，弹出维护客户事件的modal框
app.controller('customerEventModalInstanceCtrl',function ($scope,$modal) {
    $scope.showCustomerEventPopup = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'customerEventModal.html',
            controller: 'CustomerEventModalCtrl',
            size: 'lg'
        });
    }
});

app.controller('CustomerEventModalCtrl',function ($scope,$modalInstance,$http,$filter,$timeout,$interval) {
		$scope.isFormDisabled = false;
		//客户事件维护
		var FIELD_TYPE_SELECT_CTALE_FUNCS = "82962c9f1ffc4e439242089e85952745";
		//针对下拉框出现的问题的解决方法
	    var fixChosenItemIntervalTask = $interval(function () {
	        if (angular.element('#ctale_func').chosen !== undefined) {
	
	            angular.element('#ctale_func').chosen({allow_single_deselect: true});
	            $interval.cancel(fixChosenItemIntervalTask);
	        }
	    });
		var msg=undefined;
		$scope.fields = {//页面表单数据
			'ctaleFunc': '',
			'ctaleTitle': '',
			'ctaleMark': '',
			'ctaleCusNum': '',
			'ctaleHpnDate': '',
			'updateTime': '',
			'updateUser': ''
			
		};
	    $scope.emptyFields = {//用于清空页面表单数据
    		ctaleFunc: '',
			ctaleTitle: '',
			ctaleMark: '',
			ctaleCusNum: '',
			ctaleHpnDate: '',
			updateTime: '',
			updateUser: ''
	    };
	  //打开弹框时显示系统当前时间
    	$scope.nowTime=new Date();
    	$scope.fields.updateTime=$filter('date')($scope.nowTime,'yyyy-MM-dd');
	   //点击cancel按钮关闭modal框
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    //点击维护按钮维护数据
	    $scope.customerEvent = function(){
	    	var param=getFormData(angular.element('#formCustomerTaleFilter'));//获取客户事件表单数据
	    	param.ctale_func=$scope.fields.ctaleFunc;
	    	$http({
	    		method: 'POST',
	            url: RM_URL.RM_CUSTALE_MNT,//访问clb-consumer请求数据
	            data:{'megid': 'test',
	                "user": 'test',
	                "param": param,
	                "correlid":'test'}
	    	}).then(function successCallback(response){
	    		if(response.status==200){//添加成功
	    			console.log('返回结果');
	    			console.log(response.data);
	    			console.log(response);
	    			if(response.data.code=="0000"){
	    				if(param.ctale_func=="a"){
	    					msg=$filter('translate')('pages.rm.CTALE.CTALE_MGMT_TOAST_TEXTS.CTALE_MGMT_TOAST_TEXT_ADD_SUCCESS');
		                    $scope.alerts = [];
		                    maintainSuccessAlert();
		                    $scope.isFormDisabled = true;
		                    $timeout(function () {
		                        $modalInstance.dismiss('cancel');
		                    }, 5000);
	    		    	}else if(param.ctale_func=="u"){
	    		    		msg=$filter('translate')('pages.rm.CTALE.CTALE_MGMT_TOAST_TEXTS.CTALE_MGMT_TOAST_TEXT_UPDATE_SUCCESS');
		                    $scope.alerts = [];
		                    maintainSuccessAlert();
		                    $scope.isFormDisabled = true;
		                    $timeout(function () {
		                        $modalInstance.dismiss('cancel');
		                    }, 5000);
	    		    	}else if(param.ctale_func=="d"){
	    		    		msg=$filter('translate')('pages.rm.CTALE.CTALE_MGMT_TOAST_TEXTS.CTALE_MGMT_TOAST_TEXT_DELETE_SUCCESS');
		                    $scope.alerts = [];
		                    maintainSuccessAlert();
		                    $scope.isFormDisabled = true;
		                    $timeout(function () {
		                        $modalInstance.dismiss('cancel');
		                    }, 5000);
	    		    	}else{
	    		    		msg=$filter('translate')('pages.rm.CTALE.CTALE_MGMT_TOAST_TEXTS.CTALE_MGMT_TOAST_TEXT_QUERY_SUCCESS');
		                    $scope.alerts = [];
		                    maintainSuccessAlert();
		                    $scope.fields.ctaleTitle=response.data.data.ctale_title;
		                    $scope.fields.ctaleMark=response.data.data.ctale_mark;
		                    $scope.fields.ctaleCusNum=response.data.data.ctale_cus_num;
		                    if(response.data.data.create_time){
		                    	$scope.fields.ctaleHpnDate=response.data.data.create_time.substr(0,10);
		                    }
		                    if(response.data.data.update_time){
		                    	$scope.fields.updateTime=response.data.data.update_time.substr(0,10);
		                    }
		                    $scope.fields.updateUser=response.data.data.update_user;
	    		    	}
	    			}else if(response.data.code=="0001"){
	    				msg=$filter('translate')('pages.rm.CTALE.CTALE_MGMT_TOAST_TEXTS.CTALE_MGMT_TOAST_TEXT_FAIL2');
	                    $scope.alerts = [];
	                    maintainFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	    			}else if(response.data.code=="0002"){
	    				msg=$filter('translate')('pages.rm.CTALE.CTALE_MGMT_TOAST_TEXTS.CTALE_MGMT_TOAST_TEXT_FAIL3');
	                    $scope.alerts = [];
	                    maintainFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	    			}else if(response.data.code=="0005"){
	    				msg=$filter('translate')('pages.rm.CTALE.CTALE_MGMT_TOAST_TEXTS.CTALE_MGMT_TOAST_TEXT_FAIL4');
	                    $scope.alerts = [];
	                    maintainFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	    			}else if(response.data.code=="0003"){
	    				msg=$filter('translate')('pages.rm.CTALE.CTALE_MGMT_TOAST_TEXTS.CTALE_MGMT_TOAST_TEXT_FAIL5');
	                    $scope.alerts = [];
	                    maintainFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	    			}else{
	    				msg=$filter('translate')('pages.rm.CTALE.CTALE_MGMT_TOAST_TEXTS.CTALE_MGMT_TOAST_TEXT_FAIL');
	                    $scope.alerts = [];
	                    maintainFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	    			}
	    		}else{
	    			msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
	                $scope.alerts = [];
	                maintainFailAlert();
	                $timeout(function () {
	                    $scope.alerts = [];
	                },3000);
	    		}
	    	},function errorCallback(response){//请求失败时执行代码
        		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
                $scope.alerts = [];
                maintainFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
        	});
	    };	
	    //选项框改变事件
	    $scope.selectChange=function(){
	    	console.log($scope.fields.ctaleFunc);
	    	var func=$scope.fields.ctaleFunc;
	    	if(func=="a"){
	    		$scope.change_func=false;
	    		$scope.change_title_modal=false;
	    		$scope.change_mark=false;
	    		$scope.change_user=false;
	    		$scope.change_cus_num=false;
	    		$scope.change_hpn_date=false;
	    		$scope.nowTime=new Date();
	        	$scope.fields.updateTime=$filter('date')($scope.nowTime,'yyyy-MM-dd');
	    	}else if(func=="u"){
	    		$scope.change_func=false;
	    		$scope.change_title_modal=false;
	    		$scope.change_mark=false;
	    		$scope.change_user=false;
	    		$scope.change_cus_num=false;
	    		$scope.change_hpn_date=false;
	    		$scope.nowTime=new Date();
	        	$scope.fields.updateTime=$filter('date')($scope.nowTime,'yyyy-MM-dd');
	    	}else if(func=="d"){
	    		$scope.change_func=false;
	    		$scope.change_title_modal=false;
	    		$scope.change_mark=true;
	    		$scope.change_user=true;
	    		$scope.change_cus_num=false;
	    		$scope.change_hpn_date=false;
	    		$scope.nowTime=new Date();
	        	$scope.fields.updateTime=$filter('date')($scope.nowTime,'yyyy-MM-dd');
	    	}else{
	    		$scope.fields.updateTime='';
	    		$scope.change_func=false;
	    		$scope.change_title_modal=false;
	    		$scope.change_mark=true;
	    		$scope.change_user=true;
	    		$scope.change_cus_num=false;
	    		$scope.change_hpn_date=false;
	    	}
	    };
	    $scope.clear=function(){
	    	 $scope.fields = angular.copy($scope.emptyFields);//重置时清空页面表单数据
	    	 $scope.selectedCtaleFunc.item=undefined;
	    	
	    };
	    
	    $scope.alerts = [];
		 // Alert when operation is successful
		     var maintainSuccessAlert = function () {
		         $scope.alerts.push({
		             type: 'success',
		             msg: msg
		         });
		     };

		 // Alert when operation failed
		     var maintainFailAlert = function (message) {
		         $scope.alerts.push({
		             type: 'danger',
		             msg: msg
		         });
		     };
		     
		     
	   //证件类型
		$scope.selectedCtaleFunc={};
		$scope.ctaleFuncSelectOnChange= function() {
	        $scope.fields.ctaleFunc = $scope.selectedCtaleFunc.item.key;
	    };
//	    $scope.ctaleFuncs=[
//	    	{"value":"a","name":"客户重大事件添加"},
//	    	{"value":"u","name":"客户重大事件更新"},
//	    	{"value":"q","name":"客户重大事件查询"},
//	    	{"value":"d","name":"客户重大事件删除"}
//	    ];
		angular.element(function () {
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_CTALE_FUNCS
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.ctale_funcs = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
		});   
	    
	    
	    
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

