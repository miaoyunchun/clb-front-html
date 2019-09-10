'use strict';
//点击Add按钮，弹出添加个人客户的modal框
app.controller('AddPerCustomerModalInstanceCtrl',function ($scope,$modal) {
    $scope.showAddPerCustomerPopup = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addPerCustomerModal.html',
            controller: 'PerCustomerAddModalCtrl',
            size: 'lg'
        });
    }
});

app.controller('PerCustomerAddModalCtrl',function ($scope,$modalInstance,$http,$filter,$timeout,$interval) {
	//证件类型
	var FIELD_TYPE_SELECT_ID_TYPES = "34832275b2f84bdfb45373c267ff7e49";
	//性别
	var FIELD_TYPE_SELECT_ID_GENDERS = "0dcfdea1329a439cae0905004443ebe3";
	$scope.isFormDisabled = false;
	var msg=undefined;
	$scope.fields = {//页面表单数据
		'custNumber': '',
		'openingTime': '',
		'custIDNo': '',
		'nationality': '',
		'city': '',
		'address2': '',
		'postCode': '',
		'handPhone': '',
		'email': '',
		'orgID': '',
		'idType': '',
		'custGender': '',
		'custName': '',
		'address': '',
		'adress3': '',
		'phoneNumber': '',
		'maintenanceTime': '',
		'assess': ''
	};
    $scope.emptyFields = {//用于清空页面表单数据
    		custNumber: '',
    		openingTime: '',
    		custIDNo: '',
    		nationality: '',
    		city: '',
    		address2: '',
    		postCode: '',
    		handPhone: '',
    		email: '',
    		orgID: '',
    		idType: '',
    		custGender: '',
    		custName: '',
    		address: '',
    		adress3: '',
    		phoneNumber: '',
    		maintenanceTime: '',
    		assess: ''
        };
	   //添加客户时开户和上次维护时间显示系统当前时间
    	$scope.nowTime=new Date();
    	$scope.fields.openingTime=$filter('date')($scope.nowTime,'yyyy-MM-dd');
    	$scope.fields.maintenanceTime=$filter('date')($scope.nowTime,'yyyy-MM-dd');
	   //点击cancel按钮关闭modal框
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	   
	    //点击add按钮添加新机构
	    $scope.addPerCustomer = function(){
	    	var param=getFormData(angular.element('#formAddPerCustomerFilter'));//获取添加个人客户表单数据
	    	param.cust_id_type=$scope.fields.idType;
	    	param.cust_gender=$scope.fields.custGender;
	    	console.log(param);
	    	$http({
	    		method: 'POST',
	            url: RM_URL.RM_PUSCUST_ADD,//访问clb-consumer请求数据
	            data:{'megid': 'test',
	                "user": 'test',
	                "param": param,
	                "correlid":'test'}
	    	}).then(function successCallback(response){//请求成功时执行
	    		if(response.status==200){//交互成功
	    			if(response.data.data.resp_out == '0000'){//个人客户新增成功
	    				$scope.isFormDisabled = true;
	                    msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_ADD_SUCCESS');
	                    $scope.alerts = [];
	                    addSuccessAlert();

	                    $timeout(function () {
	                        $modalInstance.dismiss('cancel');
	                    }, 5000);
	                }else{
	                	msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_ADD_FAIL');
	                    $scope.alerts = [];
	                    addFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	                }
	    		}else{
	    			msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
	                $scope.alerts = [];
	                addFailAlert();
	                $timeout(function () {
	                    $scope.alerts = [];
	                },3000);
	    		}
	    	},function errorCallback(response){//请求失败时执行代码
	    		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
                $scope.alerts = [];
                addFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
	    	});
	    };
	    $scope.blur=function(){
	    	//查找客户信息是否已经存在
	    	var param=getFormData(angular.element('#add_cust_number'));
	    	if(param.cust_number){
	    		if(param.cust_number.length=="19"){
		    		var idType = $scope.fields.custNumber.substr(0,1);//截取客户编号第一个字符用于更新证件类型
			 	    var idNumber = $scope.fields.custNumber.substr(1,19);//截取客户编号后面的字符用于更新证件号码
			    	 $http({
			        		method:'POST',
			        		url:RM_URL.RM_PUSCUST_INQ,//访问clb-consumer请求数据
			        		data:{'megid':'test',
			        			'user':'test',
			        			'param':param,
			        			'correlid':'test'}
			        	}).then(function successCallback(response){
			        		
			        		   console.log($scope.cust_id_types);
			        		//根据客户编号显示证件类型
			               	for(var i=0;i<$scope.cust_id_types.length;i++){
			                   	if($scope.cust_id_types[i].key==idType){
			                   		$scope.selectedIDType.item=$scope.cust_id_types[i];
			                   	}
			                }
			               	//根据客户编号，显示身份证号
			        		   $scope.fields.custIDNo=response.data.data.cust_id_no;
			        		if(response.data.code == "0000"){
			        			console.log(response);
		        				msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE5');
		        				$scope.alerts = [];
		        				addFailAlert();

			                    $timeout(function () {
			                        $modalInstance.dismiss('cancel');
			                    }, 5000);
			                    if(response.data.data.create_time){
			        				$scope.fields.openingTime=response.data.data.create_time.substr(0,10);
			        			};
			        			$scope.fields.nationality=response.data.data.cust_nationality;
			        			//根据查询结果显示性别
				               	for(var i=0;i<$scope.id_genders.length;i++){
				                   	if($scope.id_genders[i].key==response.data.data.cust_gender){
				                   		$scope.selectedIDGenders.item=$scope.id_genders[i];
				                   	}
				                }
			        			$scope.fields.city=response.data.data.cust_city;
			        			$scope.fields.address2=response.data.data.cust_address2;
			        			$scope.fields.postCode=response.data.data.cust_post_code;
			        			$scope.fields.handPhone=response.data.data.cust_hand_phone;
			        			$scope.fields.email=response.data.data.cust_email;
			        			$scope.fields.orgID=response.data.data.cust_org_id;
			        			$scope.fields.custName=response.data.data.cust_name;
			        			$scope.fields.address=response.data.data.cust_address;
			        			$scope.fields.address3=response.data.data.cust_address3;
			        			$scope.fields.phoneNumber=response.data.data.cust_phone_number;
			        			if(response.data.data.update_time){
			        				$scope.fields.maintenanceTime=response.data.data.update_time.substr(0,10);
			        			}
			        			$scope.fields.assess=response.data.data.cust_cred_assess;
			        		}else{
			        			msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_ADD_CAUSE');
			                    $scope.alerts = [];
			                    addFailAlert();
			                    $timeout(function () {
			                        $scope.alerts = [];
			                    },3000);
			        		}
			        	},function errorCallback(response){//请求失败时执行代码
			        		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
			                $scope.alerts = [];
			                addFailAlert();
			                $timeout(function () {
			                    $scope.alerts = [];
			                },3000);
			        	});
		    	}else{
		    		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE6');
	                $scope.alerts = [];
	                addFailAlert();

	                $timeout(function () {
	                    $scope.alerts = [];
	                },3000);
		    	}
	    	}
	    }
	    
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
	   
	 
	    $scope.resetAddForm=function(){
	    	 $scope.fields = angular.copy($scope.emptyFields);//重置时清空页面表单数据
	    	 $scope.selectedIDGenders.item=undefined;
	    	 $scope.selectedIDType.item=undefined;
	    };
	    //性别
	    $scope.selectedIDGenders={};
	    $scope.IDGendersSelectOnChange= function() {
	        $scope.fields.custGender = $scope.selectedIDGenders.item.key;
	    };
	    //证件类型
		$scope.selectedIDType={};
		$scope.IDTypeSelectOnChange= function() {
	        $scope.fields.idType = $scope.selectedIDType.item.key;
	    };  
	    
	    angular.element(function () {
	    	$http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_ID_TYPES
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.cust_id_types = responseData.optValueList;
	                console.log($scope.cust_id_types);
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	        
	      //性别
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_ID_GENDERS
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.id_genders = responseData.optValueList;
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

