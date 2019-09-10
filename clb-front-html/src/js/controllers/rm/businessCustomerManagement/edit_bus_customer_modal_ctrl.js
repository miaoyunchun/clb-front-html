'use strict';
//点击edit按钮，弹出维护对公客户的modal框
app.controller('EditBusCustomerModalInstanceCtrl',function ($scope,$modal) {
    $scope.showEditBusCustomerPopup = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'editBusCustomerModal.html',
            controller: 'BusCustomerEditModalCtrl',
            size: 'lg'
        });
    }
});

app.controller('BusCustomerEditModalCtrl',function ($scope,$modalInstance,$http,$filter,$timeout,$interval) {
	var msg=undefined;
	$scope.isFormDisabled = false;
	//隶属关系
	var FIELD_TYPE_SELECT_REGION_LVLS = "346188769dbf4fd4b86b89d0869f656a";
	//所在地区
	var FIELD_TYPE_SELECT_BCUST_AREAS = "3d9159c8dfe04d3d8afc250674e15f5c";
	//注册资金币种
	var FIELD_TYPE_SELECT_REGI_CCYS = "aca4bcb817794c328d56454241c01750";
	//客户密码标识
	var FIELD_TYPE_SELECT_PSWINDS = "6a6c39fcf5d04c649f68ec27cc47d35a";
	//本行股东标识
	var FIELD_TYPE_SELECT_STKHLDRINDS = "0fba7da4c24d4c7fb6019e90c1015fd0";
	$scope.fields = {//页面表单数据
			'bcustOrgId': '',
			'bcustName': '',
			'bcustAddress': '',
			'bcustAddress2': '',
			'bcustAddress3': '',
			'bcustFaxNbr': '',
			'ownshpType': '',
			'lawRepter': '',
			'finRepter': '',
			'bcustLicense': '',
			'fxNbr': '',
			'loanNbr': '',
			'orgNumber': '',
			'bcustEname': '',
			'zipCode': '',
			'bcustEmail': '',
			'telNbr': '',
			'regionLvls': '',
			'industType':'',
			'bcustArea':'',
			'authRepter':'',
			'bussRepter':'',
			'lcsExpdate':'',
			'loanCard':'',
			'regiCcy':'',
			'stkHldrInd':'',
			'pswInd':'',
			'availTime':'',
			'bcustMaker':'',
			'busScope':'',
			'regiCap':'0.00',
			'approveName':'',
			'bcustRank':'1',
			'credAssess':'',
			'bcustID':''
	};
    $scope.emptyFields = {//用于清空页面表单数据
    		bcustOrgId: '',
    		bcustName: '',
    		bcustAddress: '',
    		bcustAddress2: '',
    		bcustAddress3: '',
    		bcustFaxNbr: '',
    		ownshpType: '',
    		lawRepter: '',
    		finRepter: '',
    		bcustLicense: '',
    		fxNbr: '',
    		loanNbr: '',
    		orgNumber: '',
    		bcustEname: '',
    		zipCode: '',
    		bcustEmail: '',
    		telNbr: '',
    		regionLvls: '',
    		industType:'',
    		bcustArea:'',
    		authRepter:'',
    		bussRepter:'',
    		lcsExpdate:'',
    		loanCard:'',
    		regiCcy:'',
    		stkHldrInd:'',
    		pswInd:'',
    		availTime:'',
    		bcustMaker:'',
    		busScope:'',
    		regiCap:'0.00',
    		approveName:'',
    		bcustRank:'1',
    		credAssess:'',
    		bcustID:''
        };
	   
	   //点击cancel按钮关闭modal框
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    //点击维护按钮保存对公客户
	    $scope.editBusCustomer = function(){
	    	var param=getFormData(angular.element('#formEditBusCustomerFilter'));//获取对公客户表单数据
	    	param.bcust_region_lvl=$scope.fields.regionLvls;
	    	param.bcust_area=$scope.fields.bcustArea;
	    	param.bcust_regi_ccy=$scope.fields.regiCcy;
	    	param.bcust_psw_ind=$scope.fields.pswInd;
	    	param.bcust_stk_hldr_ind=$scope.fields.stkHldrInd;
	    	console.log('维护时提交的表单数据');
	    	console.log(param);
	    	$http({
	    		method: 'POST',
	            url: RM_URL.RM_BUSCUST_UPD,//访问clb-consumer请求数据
	            data:{'megid': 'test',
	                "user": 'test',
	                "param": param,
	                "correlid":'test'}
	    	}).then(function successCallback(response){
	    		if(response.status==200){//维护成功
	    			console.log('维护结果')
	    			console.log(response.data.data);
	    			console.log(response.data);
	    			console.log(response);
	    			if(response.data.code == '0000'){
	    				$scope.isFormDisabled = true;
	    				msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_EDIT_SUCCESS');
	                    $scope.alerts = [];
	                    editSuccessAlert();

	                    $timeout(function () {
	                        $modalInstance.dismiss('cancel');
	                    }, 5000);
	    			}else{
	    				msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_EDIT_FAIL');
	                    $scope.alerts = [];
	                    editFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	    			}
	    		}else{
	    			msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
	                $scope.alerts = [];
	                editFailAlert();
	                $timeout(function () {
	                    $scope.alerts = [];
	                },3000);
	    		}
	    	},function errorCallback(response){//请求失败时执行代码
	    		msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
                $scope.alerts = [];
                editFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
	    	});
	    };
	    $scope.blur=function(){
	    	//查找对公客户信息，进行更改
	    	var bcust_license=$scope.fields.bcustLicense;//获取营业执照号进行查找
	    	console.log(bcust_license);
	    	if(bcust_license){
	    		if(bcust_license.length=='15'){
	    			var param={
		    	    		'bcust_license':bcust_license,
		    	    		'type':'E'
		    	    	};
		    	    	console.log(param);
		    	    	$http({
		    		        method:'POST',
		    		        url:RM_URL.RM_BUSCUST_UPD,//访问clb-consumer请求数据
		    		        data:{'megid':'test',
		    		        	  'user':'test',
		    		        	  'param':param,
		    		        	  'correlid':'test'}
		    		    }).then(function successCallback(response){
		    	    		if(response.status==200){//查询成功
		    	    			console.log('返回结果')
		    	    			console.log(response.data.data);
		    	    			console.log(response.data);
		    	    			if(response.data.code=="0000"){
		    	    				msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_BLUR_SUCCESS');
				                    $scope.alerts = [];
				                    editSuccessAlert();

				                    $timeout(function () {
				                        $scope.alerts = [];
				                    },5000);
		    	    				$scope.fields.bcustOrgId=response.data.data.bcust_org_id;
			    		        	$scope.fields.bcustName=response.data.data.bcust_name;
			    		        	$scope.fields.bcustAddress=response.data.data.bcust_address;
			    		        	$scope.fields.bcustAddress2=response.data.data.bcust_address2;
			    		        	$scope.fields.bcustAddress3=response.data.data.bcust_address3;
			    		        	$scope.fields.bcustFaxNbr=response.data.data.bcust_fax_nbr;
			    		        	$scope.fields.ownshpType=response.data.data.bcust_ownshp_type;
			    		        	$scope.fields.lawRepter=response.data.data.bcust_law_repter;
			    		        	$scope.fields.finRepter=response.data.data.bcust_fin_repter;
			    		        	$scope.fields.bcustLicense=response.data.data.bcust_license;
			    		        	$scope.fields.fxNbr=response.data.data.bcust_fx_nbr;
			    		        	$scope.fields.loanNbr=response.data.data.bcust_loan_nbr;
			    		        	$scope.fields.orgNumber=response.data.data.bcust_org_number;
			    		        	$scope.fields.bcustEname=response.data.data.bcust_ename;
			    		        	$scope.fields.zipCode=response.data.data.bcust_zip_code;
			    		        	$scope.fields.bcustEmail=response.data.data.bcust_email;
			    		        	$scope.fields.telNbr=response.data.data.bcust_tel_nbr;
			    		        	
			            			//查找时显示隶属关系
			            			for(var i=0;i<$scope.bcust_region_lvls.length;i++){
					                   	if($scope.bcust_region_lvls[i].key==response.data.data.bcust_region_lvl){
					                   		$scope.selectedBcustRegionLvl.item=$scope.bcust_region_lvls[i];
					                   	}
					                }
			    		        	$scope.fields.industType=response.data.data.bcust_indust_type;
			    		        	//查找时显示所在地区
			            			for(var i=0;i<$scope.bcust_areas.length;i++){
					                   	if($scope.bcust_areas[i].key==response.data.data.bcust_area){
					                   		$scope.selectedBcustArea.item=$scope.bcust_areas[i];
					                   	}
					                }
			    		        	$scope.fields.authRepter=response.data.data.bcust_auth_repter;
			    		        	$scope.fields.bussRepter=response.data.data.bcust_buss_repter;
			    		        	$scope.fields.lcsExpdate=response.data.data.bcust_lcs_expdate;
			    		        	$scope.fields.loanCard=response.data.data.bcust_loan_card;
			    		        	//查找时显示注册资金币种
			            			for(var i=0;i<$scope.bcust_regi_ccys.length;i++){
					                   	if($scope.bcust_regi_ccys[i].key==response.data.data.bcust_regi_ccy){
					                   		$scope.selectedBcustRegiCcy.item=$scope.bcust_regi_ccys[i];
					                   	}
					                }
			    		        	//查找时显示本行股东标识
			            			for(var i=0;i<$scope.bcust_stk_hldr_inds.length;i++){
					                   	if($scope.bcust_stk_hldr_inds[i].key==response.data.data.bcust_stk_hldr_ind){
					                   		$scope.selectedBcustStkHldrInd.item=$scope.bcust_stk_hldr_inds[i];
					                   	}
					                }
			    		        	//查找时显示客户密码标识
			            			for(var i=0;i<$scope.bcust_psw_inds.length;i++){
					                   	if($scope.bcust_psw_inds[i].key==response.data.data.bcust_psw_ind){
					                   		$scope.selectedBcustPswInd.item=$scope.bcust_psw_inds[i];
					                   	}
					                }
			    		        	$scope.fields.availTime=response.data.data.bcust_lst_mn_date;
			    		        	$scope.fields.bcustMaker=response.data.data.bcust_maker;
			    		        	$scope.fields.busScope=response.data.data.bcust_auth_repter;
			    		        	$scope.fields.regiCap=response.data.data.bcust_regi_cap;
			    		        	$scope.fields.approveName=response.data.data.bcust_approve_name;
			    		        	$scope.fields.bcustRank=response.data.data.bcust_rank;
			    		        	$scope.fields.credAssess=response.data.data.bcust_cred_assess;
			    		        	$scope.fields.bcustID=response.data.data.bcust_id;
		    	    			}else{
		    	    				msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_BLUR_FAIL');
				                    $scope.alerts = [];
				                    editFailAlert();

				                    $timeout(function () {
				                        $scope.alerts = [];
				                    },3000);
		    	    			}
		    	    		}else{
		    	    			msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
			                    $scope.alerts = [];
			                    editFailAlert();
			                    $timeout(function () {
			                        $scope.alerts = [];
			                    },3000);
		    	    		}
		    	    	},function errorCallback(response){//请求失败时执行代码
		    	    		msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
		                    $scope.alerts = [];
		                    editFailAlert();
		                    $timeout(function () {
		                        $scope.alerts = [];
		                    },3000);
		    	    	});
	    		}else{
		    		msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE6');
	                $scope.alerts = [];
	                editFailAlert();

	                $timeout(function () {
	                    $scope.alerts = [];
	                },3000);
		    	}
	    		
	    	}
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
	    
	   
	    $scope.clear=function(){
	    	 $scope.fields = angular.copy($scope.emptyFields);//重置时清空页面表单数据
	    	 $scope.selectedBcustRegionLvl.item=undefined;
	    	 $scope.selectedBcustArea.item=undefined;
	    	 $scope.selectedBcustRegiCcy.item=undefined;
	    	 $scope.selectedBcustPswInd.item=undefined;
	    	 $scope.selectedBcustStkHldrInd.item=undefined;
	    };
//	    $scope.regi_ccys=[
//	    	{"value":"CNY","name":"人民币"},
//	    	{"value":"HKD","name":"港元"},
//	    	{"value":"USD","name":"美元"}	    	
//	    ];
//	    $scope.stkHldrInds=[
//	    	{"value":"Y","name":"Y"},
//	    	{"value":"N","name":"N"}   	
//	    ];
//	    $scope.pswInds=[
//	    	{"value":"Y","name":"Y"},
//	    	{"value":"N","name":"N"}   	
//	    ];
//	    $scope.bcust_areas=[
//	    	{"value":"1101","name":"北京"},
//	    	{"value":"3101","name":"上海"}   	
//	    ];
//	    $scope.regionLvls=[
//	    	{"value":"10","name":"中央"},
//	    	{"value":"20","name":"省"}   	
//	    ];
	  //隶属关系
	    $scope.selectedBcustRegionLvl={};
	    $scope.bcustRegionLvlSelectOnChange= function() {
	        $scope.fields.regionLvls = $scope.selectedBcustRegionLvl.item.key;
	    };
	    //所在地区
	    $scope.selectedBcustArea={};
	    $scope.bcustAreaSelectOnChange= function() {
	        $scope.fields.bcustArea = $scope.selectedBcustArea.item.key;
	    };
	    //注册资金币种
	    $scope.selectedBcustRegiCcy={};
	    $scope.bcustRegiCcySelectOnChange= function() {
	        $scope.fields.regiCcy = $scope.selectedBcustRegiCcy.item.key;
	    };
	    //客户密码标识
	    $scope.selectedBcustPswInd={};
	    $scope.bcustPswIndSelectOnChange= function() {
	        $scope.fields.pswInd = $scope.selectedBcustPswInd.item.key;
	    };
	    //本行股东标识
	    $scope.selectedBcustStkHldrInd={};
	    $scope.bcustStkHldrIndSelectOnChange= function() {
	        $scope.fields.stkHldrInd = $scope.selectedBcustStkHldrInd.item.key;
	    };
	    angular.element(function () {
	    	//注册资金币种
	    	$http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_REGI_CCYS
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.bcust_regi_ccys = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	    	
	    	//本行股东标识
//	    	$scope.stkHldrInds=[
//		    	{"value":"Y","name":"Y"},
//		    	{"value":"N","name":"N"}   	
//		    ];
	    	$http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_STKHLDRINDS
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.bcust_stk_hldr_inds = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	    	//客户密码标识
//	    	$scope.pswInds=[
//		    	{"value":"Y","name":"Y"},
//		    	{"value":"N","name":"N"}   	
//		    ];
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_PSWINDS
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.bcust_psw_inds = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	    	//所在地区
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_BCUST_AREAS
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.bcust_areas = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	        //隶属关系
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_REGION_LVLS
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.bcust_region_lvls = responseData.optValueList;
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

