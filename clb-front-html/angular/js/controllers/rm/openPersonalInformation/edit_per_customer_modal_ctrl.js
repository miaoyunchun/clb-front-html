'use strict';
//点击Eidt按钮，弹出编辑个人客户的modal框
app.controller('EditPerCustomerModalInstanceCtrl',function ($scope,$modal) {
    $scope.showEditPerCustomerPopup = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'editPerCustomerModal.html',
            controller: 'PerCustomerEditModalCtrl',
            size: 'lg'
        });
    }
});

app.controller('PerCustomerEditModalCtrl',function ($scope,$modalInstance,$http,$filter,$timeout,$interval) {
	var msg=undefined;
	$scope.isFormDisabled = false;
	//证件类型
	var FIELD_TYPE_SELECT_ID_TYPES = "34832275b2f84bdfb45373c267ff7e49";
	//性别
	var FIELD_TYPE_SELECT_ID_GENDERS = "0dcfdea1329a439cae0905004443ebe3";
	//客户类型
	var FIELD_TYPE_SELECT_CUST_TYPES = "85a4df5ec9ec45ff9c7106a99cf22b85";
	//客户状态
	var FIELD_TYPE_SELECT_CUST_STATUS = "c45356a928464aef9aef74c5b00ade33";
	
	$scope.fields = {//页面表单数据
		'nowTime': '',
		'custNumber': '',
		'custType':'',
		'custStatus':'',
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
		'address3': '',
		'phoneNumber': '',
		'maintenanceTime': '',
		'assess': ''
		
	};
	$scope.emptyFields = {//用于清空页面表单数据
		custNumber: '',
		custType:'',
		custStatus:'',
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
		address3: '',
		phoneNumber: '',
		maintenanceTime: '',
		assess: ''
    		
	};
	//维护客户时上次维护时间显示系统当前时间
	$scope.nowTime=new Date();
	$scope.fields.maintenanceTime=$filter('date')($scope.nowTime,'yyyy-MM-dd');
	//点击cancel按钮关闭modal框
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	//点击维护按钮保存
	$scope.editPerCustomer = function(){
	    var param=getFormData(angular.element('#formEditPerCustomerFilter'));//获取维护表单数据
	    param.cust_id_type=$scope.fields.idType;
    	param.cust_gender=$scope.fields.custGender;
    	param.cust_type=$scope.fields.custType;
    	param.cust_status=$scope.fields.custStatus;
	    $http({
	    	method: 'POST',
	        url: RM_URL.RM_PUSCUST_MNT,//访问clb-consumer请求数据
	        data:{'megid': 'test',
	              "user": 'test',
	              "param": param,
	              "correlid":'test'}
	    }).then(function successCallback(response){
	    	if(response.status==200){//维护成功
	    		if(response.data.code=="0000"){//维护成功时弹窗提醒
	    			$scope.isFormDisabled = true;
		    		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_EDIT_SUCCESS');
                    $scope.alerts = [];
                    editSuccessAlert();

                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 5000);
	    		}else{//维护失败时弹窗提醒
	    			msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_EDIT_FAIL');
                    $scope.alerts = [];
                    editFailAlert();

                    $timeout(function () {
                        $scope.alerts = [];
                    },3000);
	    		}
	    		
	    	}else{
	    		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
                $scope.alerts = [];
                editFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
	    	}
	    },function errorCallback(response){//请求失败时执行代码
    		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
            $scope.alerts = [];
            editFailAlert();
            $timeout(function () {
                $scope.alerts = [];
            },3000);
    	});
	};
	//查找客户信息是否已经存在
	$scope.blur=function(){
	    var param=getFormData(angular.element('#edit_cust_number'));
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
			    	 console.log(response);
			        if(response.status==200){
			        	if(response.data.data.resp_out=="0000"){
			        		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_BLUR_SUCCESS');
		                    $scope.alerts = [];
		                    editSuccessAlert();

		                    $timeout(function () {
		                        $scope.alerts = [];
		                    },5000);
		                    console.log(response.data.data);
		        			if(response.data.data.create_time){
		        				$scope.fields.openingTime=response.data.data.create_time.substr(0,10);
		        			};
		        			
		        			$scope.fields.custIDNo=idNumber;
		        			$scope.fields.nationality=response.data.data.cust_nationality;
		        			$scope.fields.city=response.data.data.cust_city;
		        			$scope.fields.address2=response.data.data.cust_address2;
		        			$scope.fields.postCode=response.data.data.cust_post_code;
		        			$scope.fields.handPhone=response.data.data.cust_hand_phone;
		        			$scope.fields.email=response.data.data.cust_email;
		        			$scope.fields.orgID=response.data.data.cust_org_id;
		        			//根据查询结果显示证件类型
			               	for(var i=0;i<$scope.id_types.length;i++){
			                   	if($scope.id_types[i].key==response.data.data.cust_id_type){
			                   		$scope.selectedIDType.item=$scope.id_types[i];
			                   	}
			                }
		        			//根据查询结果显示客户性别
			               	for(var i=0;i<$scope.id_genders.length;i++){
			                   	if($scope.id_genders[i].key==response.data.data.cust_gender){
			                   		$scope.selectedIDGenders.item=$scope.id_genders[i];
			                   	}
			                }
			              //根据查询结果显示客户类型
			               	for(var i=0;i<$scope.cust_types.length;i++){
			                   	if($scope.cust_types[i].key==response.data.data.cust_type){
			                   		$scope.selectedCustType.item=$scope.cust_types[i];
			                   	}
			                }
			               	//根据查询结果显示客户状态
			               	for(var i=0;i<$scope.cust_status.length;i++){
			                   	if($scope.cust_status[i].key==response.data.data.cust_status){
			                   		$scope.selectedCustStatus.item=$scope.cust_status[i];
			                   	}
			                }
		    	        	$scope.fields.custName=response.data.data.cust_name;
		    	        	$scope.fields.address=response.data.data.cust_address;
		    	        	$scope.fields.address3=response.data.data.cust_address3;
		    	        	$scope.fields.phoneNumber=response.data.data.cust_phone_number;
		    	        	if(response.data.data.update_time){
		    	        		$scope.fields.maintenanceTime=response.data.data.update_time.substr(0,10);
		    	        	};
		    	        	$scope.fields.assess=response.data.data.cust_cred_assess;
		    	        	$scope.editReadonly=true;
			        	}else{
			        		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_BLUR_FAIL');
		                    $scope.alerts = [];
		                    editFailAlert();

		                    $timeout(function () {
		                        $scope.alerts = [];
		                    },3000);
			        	}
			        }else{
			        	msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
		                $scope.alerts = [];
		                editFailAlert();
		                $timeout(function () {
		                    $scope.alerts = [];
		                },3000);
			        }
			     },function errorCallback(response){//请求失败时执行代码
			    		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
		                $scope.alerts = [];
		                editFailAlert();
		                $timeout(function () {
		                    $scope.alerts = [];
		                },3000);
			    	});
	    	}else{
	    		msg=$filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE6');
                $scope.alerts = [];
                editFailAlert();

                $timeout(function () {
                    $scope.alerts = [];
                },3000);
	    	}
	    	
	    	
	    };
	    }
	
		$scope.alerts = [];
	  // 当操作成功时弹窗
	     var editSuccessAlert = function () {
	         $scope.alerts.push({
	             type: 'success',
	             msg: msg
	         });
	     };
	  //操作失败时弹窗
	     var editFailAlert = function (message) {
	         $scope.alerts.push({
	             type: 'danger',
	             msg: msg
	         });
	     }; 
	  
	     
	     
	     
	   //重置时清空页面表单数据
	    $scope.resetEditForm=function(){
	    	 $scope.fields = angular.copy($scope.emptyFields);
	    	 $scope.selectedIDGenders.item=undefined;
	    	 $scope.selectedIDType.item=undefined;
	    	 $scope.selectedCustType.item=undefined;
	    	 $scope.selectedCustStatus.item=undefined;
 			 $scope.editReadonly=undefined;
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
	    //客户类型
		$scope.selectedCustType={};
		$scope.custTypeSelectOnChange= function() {
	        $scope.fields.custType = $scope.selectedCustType.item.key;
	    };
	    //客户状态
		$scope.selectedCustStatus={};
		$scope.custStatusSelectOnChange= function() {
	        $scope.fields.custStatus = $scope.selectedCustStatus.item.key;
	    };
	    angular.element(function () {
	    	//客户类型
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_CUST_TYPES
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.cust_types = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	    
	    	//客户状态
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_CUST_STATUS
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.cust_status = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	    
	    	//证件类型
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_ID_TYPES
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.id_types = responseData.optValueList;
	                console.log('111111');
	                console.log($scope.id_types);
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
	                console.log($scope.id_genders);
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



