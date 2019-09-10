'use strict';
//点击维护按钮，弹出维护客户事件的modal框
var msg=undefined;
var param=undefined;
var customerRelationInformation=undefined;
var relationData=undefined;
app.controller('customerRelationDetailModalCtrl',function ($scope,$modal,$http,$timeout,$filter,toaster,rmShareDataService) {
	$scope.isFormDisabled = false;
    $scope.getRelationInformation = function (index) {
    	console.log(index);
    	console.log($scope.CustomerRelations[index]);
    	param={
    		"creal_cus_num":$scope.CustomerRelations[index].crealqo_cus_num,
    		"creal_main_date":"",
    		"creal_maker":"",
    		"creal_mark":"",
    		"creal_rel_cus":$scope.CustomerRelations[index].crealqo_rel_cus,
    		"creal_retype":$scope.CustomerRelations[index].crealqo_retype,
    		"func":"Q"
    	};
    	$http({
	        method:'POST',
	        url:RM_URL.RM_CUSTREL_MNT,//访问clb-consumer请求数据
	        data:{'megid':'test',
	        	  'user':'test',
	        	  'param':param,
	        	  'correlid':'test'}
	    }).then(function successCallback(response){
	    	console.log('response');
	    	console.log(response);
	    	console.log(response.data);
	    	if(response.status=='200'){
	    		if(response.data.code=="0000"){
	    			customerRelationInformation={
    					"creal_cus_num":response.data.data.creal_cus_num,
    		    		"creal_main_date":response.data.data.creal_main_date,
    		    		"creal_maker":response.data.data.creal_maker,
    		    		"creal_mark":response.data.data.creal_mark,
    		    		"creal_rel_cus":response.data.data.creal_rel_cus,
    		    		"creal_retype":response.data.data.creal_retype,
    		    		"create_time":response.data.data.create_time,
    		    		"create_user":response.data.data.create_user,
    		    		"del":response.data.data.del,
    		    		"update_time":response.data.data.update_time,
    		    		"update_user":response.data.data.update_user
	    	        };
	    			console.log('2222');
	    			console.log(customerRelationInformation);
	    			//把数据存入service中
	    	    	rmShareDataService.setCustomerRelationInformation(customerRelationInformation);
	    	    	//弹框
	    	    	$modal.open({
	    	            backdrop: 'static',
	    	            templateUrl: 'customerRelationDetailModal.html',
	    	            controller: 'customerRelationDetailModal1',
	    	            size: 'lg'
	    	        });
	    		}else{
	    			$timeout(function () {
                        toaster.pop(
                            'error',
                            $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_QUERY_FAIL'),
	                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE')
                        );
                    }, 0);
	    		}
	    	}else{
	    		$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                    );
                }, 0);
	    	}
	    	
	    },function errorCallback(response){//请求失败时执行代码
    		$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                    $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                );
            }, 0);
    	});
    	
    
    	
        
    }
});

app.controller('customerRelationDetailModal1',function ($scope,$modalInstance,$http,$filter,$rootScope,$timeout,rmShareDataService) {
	$scope.fields = {//页面表单数据
		'updateUser': '',
		'crealRelCus': '',
		'updateTime': '',
		'crealRetype': '',
		'crealMark': '',
		'crealCusNum': ''
	};
   //点击cancel按钮关闭modal框
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  //从service中取出数据
	relationData = rmShareDataService.getCustomerRelationInformation();
	console.log('data');
	console.log(relationData);
	$scope.fields.crealCusNum=relationData.creal_cus_num;
	$scope.fields.crealMark=relationData.creal_mark;
	$scope.fields.crealRetype=relationData.creal_retype;
	if(relationData.update_time){
		$scope.fields.updateTime=relationData.update_time.substr(0,10);
	}
	$scope.fields.crealRelCus=relationData.creal_rel_cus;
	$scope.fields.updateUser=relationData.update_user;
	
	$scope.editCustomerRelation=function(){
		param={
			"creal_cus_num":$scope.fields.crealCusNum,
			"creal_mark":$scope.fields.crealMark,
			"creal_rel_cus":$scope.fields.crealRelCus,
			"creal_retype":$scope.fields.crealRetype,
			"func":"U"
		};
		console.log('param111');
		console.log(param);
		$http({
	        method:'POST',
	        url:RM_URL.RM_CUSTREL_MNT,//访问clb-consumer请求数据
	        data:{'megid':'test',
	        	  'user':'test',
	        	  'param':param,
	        	  'correlid':'test'}
	    }).then(function successCallback(response){
	    	console.log(response);
	    	console.log(response.data);
	    	if(response.status=="200"){
	    		if(response.data.code=="0000"){
	    			$scope.isFormDisabled = true;
	    			msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_EDIT_SUCCESS');
                    $scope.alerts = [];
                    editSuccessAlert();

                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 5000);
	    		}else{
	    			if(response.data.code=="0005"){
	    				msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_EDIT_FAIL2');
	    				$scope.alerts = [];
	                    editFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	    			}else{
	    				msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_EDIT_FAIL');
	                    $scope.alerts = [];
	                    editFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	    			}
	    		}
	    	}else{
	    		msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2');
                $scope.alerts = [];
                editFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
	    	}
	    	
	    },function errorCallback(response){//请求失败时执行代码
    		msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2');
            $scope.alerts = [];
            eidtFailAlert();
            $timeout(function () {
                $scope.alerts = [];
            },3000);
    	});

	};
	$scope.deleteCustomerRelation=function(){
		param={
			"creal_cus_num":$scope.fields.crealCusNum,
			"creal_mark":"",
			"creal_rel_cus":$scope.fields.crealRelCus,
			"creal_retype":$scope.fields.crealRetype,
			"func":"D"
		};
		console.log('param111');
		console.log(param);
		$http({
	        method:'POST',
	        url:RM_URL.RM_CUSTREL_MNT,//访问clb-consumer请求数据
	        data:{'megid':'test',
	        	  'user':'test',
	        	  'param':param,
	        	  'correlid':'test'}
	    }).then(function successCallback(response){
	    	console.log(response);
	    	console.log(response.data);
	    	if(response.status=="200"){
	    		if(response.data.code=="0000"){
	    			$scope.isFormDisabled = true;
	    			msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_DELETE_SUCCESS');
                    $scope.alerts = [];
                    editSuccessAlert();
                    
                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                        //重新刷新客户关系列表
                        $rootScope.queryCustomerRelationInf();
                    }, 3000);
                  
                    
	    		}else{
	    			msg=$filter('translate')('pages.rm.CREAL.CREAL_MGMT_TOAST_TEXTS.CREAL_MGMT_TOAST_TEXT_DELETE_FAIL');
                    $scope.alerts = [];
                    editFailAlert();

                    $timeout(function () {
                        $scope.alerts = [];
                    },3000);
	    		}
	    	}else{
	    		msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2');
                $scope.alerts = [];
                editFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
	    	}
	    	
	    },function errorCallback(response){//请求失败时执行代码
    		msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2');
            $scope.alerts = [];
            eidtFailAlert();
            $timeout(function () {
                $scope.alerts = [];
            },3000);
    	});
	};
	
	
	
	
	$scope.alerts = [];
	 // Alert when operation is successful
	     var editSuccessAlert = function () {
	         $scope.alerts.push({
	             type: 'success',
	             msg: msg
	         });
	     };

	 // Alert when operation failed
	     var editFailAlert = function (message) {
	         $scope.alerts.push({
	             type: 'danger',
	             msg: msg
	         });
	     };

}); 

