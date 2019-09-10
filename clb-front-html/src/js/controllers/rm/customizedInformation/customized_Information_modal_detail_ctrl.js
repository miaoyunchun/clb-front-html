'use strict';
//点击维护按钮，弹出维护客户事件的modal框
var msg=undefined;
var param=undefined;
var customizedInformation=undefined;
var costomizedData=undefined;
app.controller('customizedInformationDetailModalCtrl',function ($scope,$modal,$http,$timeout,$filter,toaster,rmShareDataService) {
	$scope.isFormDisabled = false;
    $scope.getCostomizedInformation = function (index) {
    	console.log(index);
    	console.log($scope.CustomizedInformation[index]);
    	param={
    		"crdmn_defined_content":"",
    		"crdmn_defined_desc":"",
    		"crdmn_defined_titl":$scope.CustomizedInformation[index].crdmn_defined_titl,
    		"crdmn_last_main_date":"",
    		"crdmn_maker":"",
    		"crdmn_number":$scope.CustomizedInformation[index].crdmn_number,
    		"func":"Q"
    	};
    	console.log('param');
    	console.log(param);
    	$http({
	        method:'POST',
	        url:RM_URL.RM_SPEITEM_UPD,//访问clb-consumer请求数据
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
	    			customizedInformation={
    					"crdmn_defined_content":response.data.data.crdmn_defined_content,
    		    		"crdmn_defined_desc":response.data.data.crdmn_defined_desc,
    		    		"crdmn_defined_titl":response.data.data.crdmn_defined_titl,
    		    		"crdmn_last_main_date":response.data.data.crdmn_last_main_date,
    		    		"crdmn_maker":response.data.data.crdmn_maker,
    		    		"crdmn_number":response.data.data.crdmn_number,
    		    		"create_time":response.data.data.create_time,
    		    		"create_user":response.data.data.create_user,
    		    		"del":response.data.data.del,
    		    		"update_time":response.data.data.update_time,
    		    		"update_user":response.data.data.update_user
	    	        };
	    			console.log('2222');
	    			console.log(customizedInformation);
	    			//把数据存入service中
	    	    	rmShareDataService.setCustomizedInformation(customizedInformation);
	    	    	//弹框
	    	    	$modal.open({
	    	            backdrop: 'static',
	    	            templateUrl: 'customizedInformationDetailModal.html',
	    	            controller: 'customizedInformationDetailModal1',
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

app.controller('customizedInformationDetailModal1',function ($scope,$modalInstance,$http,$rootScope,$filter,$timeout,rmShareDataService) {
	$scope.fields = {//页面表单数据
		'updateUser': '',
		'updateTime': '',
		'crdmnDefinedTitl': '',
		'crdmnDefinedContent': '',
		'crdmnDefinedDesc': '',
		'crdmnNumber': ''
	};
   //点击cancel按钮关闭modal框
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
  //从service中取出数据
	costomizedData = rmShareDataService.getCustomizedInformation();
	console.log('data');
	console.log(costomizedData);
	$scope.fields.updateUser=costomizedData.update_user;
	if(costomizedData.update_time){
		$scope.fields.updateTime=costomizedData.update_time.substr(0,10);
	}
	$scope.fields.crdmnDefinedTitl=costomizedData.crdmn_defined_titl;
	$scope.fields.crdmnDefinedContent=costomizedData.crdmn_defined_content;
	$scope.fields.crdmnDefinedDesc=costomizedData.crdmn_defined_desc;
	$scope.fields.crdmnNumber=costomizedData.crdmn_number;
	//维护
	$scope.editCustomizedInformation=function(){
		
		param={
			"crdmn_defined_content":$scope.fields.crdmnDefinedContent,
			"crdmn_defined_desc":$scope.fields.crdmnDefinedDesc,
			"crdmn_defined_titl":$scope.fields.crdmnDefinedTitl,
			"crdmn_last_main_date":'',
			"crdmn_maker":'',
			"crdmn_number":$scope.fields.crdmnNumber,
			"func":"U"
		};
		$http({
	        method:'POST',
	        url:RM_URL.RM_SPEITEM_UPD,//访问clb-consumer请求数据
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
	    			msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_EDIT_SUCCESS');
                    $scope.alerts = [];
                    editSuccessAlert();

                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 5000);
	    		}else{
	    			msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_EDIT_FAIL');
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
	
	$scope.deleteCustomizedInformation=function(){
		param={
			"crdmn_defined_content":"",
			"crdmn_defined_desc":"",
			"crdmn_defined_titl":$scope.fields.crdmnDefinedTitl,
			"crdmn_last_main_date":"",
			"crdmn_maker":"",
			"crdmn_number":$scope.fields.crdmnNumber,
			"func":"D"
		};
		
		console.log('param111');
		console.log(param);
		$http({
	        method:'POST',
	        url:RM_URL.RM_SPEITEM_UPD,//访问clb-consumer请求数据
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
	    			msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_DELETE_SUCCESS');
                    $scope.alerts = [];
                    editSuccessAlert();
                    
                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                        //重新刷新客户自定义列表
                        $rootScope.queryCustomizedInformation();
                    }, 3000);
	    		}else{
	    			msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_DELETE_FAIL');
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




