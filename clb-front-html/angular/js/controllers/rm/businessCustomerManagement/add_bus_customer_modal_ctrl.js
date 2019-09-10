'use strict';
//点击Add按钮，弹出添加个人客户的modal框
app.controller('AddBusCustomerModalInstanceCtrl',function ($scope,$modal) {
    $scope.showAddBusCustomerPopup = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addBusCustomerModal.html',
            controller: 'BusCustomerAddModalCtrl',
            size: 'lg'
        });
    }
});

app.controller('BusCustomerAddModalCtrl',function ($scope,$modalInstance,$http,$filter,$timeout,$interval) {
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
		'nowTime':'',
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
		'bcustLcsExpdate':'',
		'loanCard':'',
		'regiCcy':'',
		'stkHldrInd':'',
		'pswInd':'',
		'bcustLstMnDate':'',
		'bcustMaker':'jackey',
		'busScope':'',
		'regiCap':'0.00',
		'approveName':'',
		'bcustRank':'1',
		'credAssess':''
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
    		bcustLcsExpdate:'',
    		loanCard:'',
    		regiCcy:'',
    		stkHldrInd:'',
    		pswInd:'',
    		bcustLstMnDate:'',
    		bcustMaker:'jackey',
    		busScope:'',
    		regiCap:'0.00',
    		approveName:'',
    		bcustRank:'1',
    		credAssess:''
        };
       //添加客户时上次维护时间显示系统当前时间
    	$scope.nowTime=new Date();
		$scope.fields.bcustLstMnDate=$filter('date')($scope.nowTime,'yyyy-MM-dd');
	   //点击cancel按钮关闭modal框
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    //点击add按钮添加对公客户
	    $scope.addBusCustomer = function(){
	    	var param=getFormData(angular.element('#formAddBusCustomerFilter'));//获取添加对公客户表单数据
	    	param.bcust_region_lvl=$scope.fields.regionLvls;
	    	param.bcust_area=$scope.fields.bcustArea;
	    	param.bcust_regi_ccy=$scope.fields.regiCcy;
	    	param.bcust_psw_ind=$scope.fields.pswInd;
	    	param.bcust_stk_hldr_ind=$scope.fields.stkHldrInd;
	    	console.log(param);
	    	$http({
	    		method: 'POST',
	            url: RM_URL.RM_BUSCUST_ADD,//访问clb-consumer请求数据
	            data:{'megid': 'test',
	                "user": 'test',
	                "param": param,
	                "correlid":'test'}
	    	}).then(function successCallback(response){
	    		if(response.status==200){//添加成功
	    			console.log('返回结果')
	    			console.log(response.data.data);
	    			console.log(response.data);
	    			console.log(response);
	    			if(response.data.code == '0000'){//对公客户新增成功
	    				$scope.isFormDisabled = true;
	                    msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_ADD_SUCCESS');
	                    $scope.alerts = [];
	                    addSuccessAlert();

	                    $timeout(function () {
	                        $modalInstance.dismiss('cancel');
	                    }, 5000);
	                }else{
	                	msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_ADD_FAIL');
	                    $scope.alerts = [];
	                    addFailAlert();

	                    $timeout(function () {
	                        $scope.alerts = [];
	                    },3000);
	                }
	    		}else{
	    			msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
	                $scope.alerts = [];
	                addFailAlert();
	                $timeout(function () {
	                    $scope.alerts = [];
	                },3000);
	    		}
	    	},function errorCallback(response){//请求失败时执行代码
	    		msg=$filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2');
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
	    	 
	    	 
	    	 $scope.selectedBcustRegionLvl.item=undefined;
	    	 $scope.selectedBcustArea.item=undefined;
	    	 $scope.selectedBcustRegiCcy.item=undefined;
	    	 $scope.selectedBcustPswInd.item=undefined;
	    	 $scope.selectedBcustStkHldrInd.item=undefined;
	    	
	    };
	    
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

