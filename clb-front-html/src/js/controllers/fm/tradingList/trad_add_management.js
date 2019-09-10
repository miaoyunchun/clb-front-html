'use strict';
//打开添加科目的modal框
app.controller('AddTradModalCtrl',function ($scope,$modal) {
    $scope.showAddTradModal = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addTradingModal.html',
            controller: 'TradAddModalControl',
            size: 'lg'
        });
    }
})

app.controller('TradAddModalControl',function ($scope,$modalInstance,$interval,$filter,$http,$timeout) {
	var msg=undefined;
	//权限标识
	var FIELD_TYPE_SELECT_AUTHFLGS = "e67ef131dab448d6b126bca552138df8";
	//交易类型
	var FIELD_TYPE_SELECT_TXNTYPESADD = "749e882b848143e4a452b7cd31ce79d4";
	//借贷别
	var FIELD_TYPE_SELECT_AUTHTYPS = "5350f8fb76f341bba313fcf651b221b6";
	//冲正交易标识
	var FIELD_TYPE_SELECT_ECFLGS = "3387fd0bce334649bdc914cf66d35ac0";
	//24小时冲正标识
	var FIELD_TYPE_SELECT_HECFLGS = "421bb1cb4afa4edf92d7e0e095a912ab";
	
	$scope.fields = {//页面表单数据
			'txn_jour': '',
			'txn_type': '',
			'ser_name': '',
			'busn_date': '',
			'cpu_time': '',
			'txn_terminal': '',
			'txn_auth_flg': '',
			'auth_typ': '',
			'txl_ec_flg': '',
			'txl_ec_log_no': '',
			'txl_ar_log_no': '',
			'txl_account_no': '',
			'txl_oppo_account_no': '',
			'txl_tx_type': '',
			'txl_doc_type': '',
			'txl_book_code': '',
			'txl_tx_amt1': '',
			'txl_tx_amt2': '',
			'txl_24h_ec_flg': '',
			'txl_inp_area_len': '',
			'txl_data_area': ''
	};
	//交易类型
	$scope.selectedTxnType={};
	$scope.txnTypeSelectOnChange= function() {
        $scope.fields.txn_type = $scope.selectedTxnType.item.key;
    }; 
    //权限标识
	$scope.selectedTxnAuthFlg={};
	$scope.txnAuthFlgSelectOnChange= function() {
        $scope.fields.txn_auth_flg = $scope.selectedTxnAuthFlg.item.key;
    }; 
    //借贷别
	$scope.selectedAuthTyp={};
	$scope.authTypSelectOnChange= function() {
        $scope.fields.auth_typ = $scope.selectedAuthTyp.item.key;
    }; 
    //冲正交易标识
	$scope.selectedTxlEcFlg={};
	$scope.txlEcFlgSelectOnChange= function() {
        $scope.fields.txl_ec_flg = $scope.selectedTxlEcFlg.item.key;
    };
    //24冲正标识
	$scope.selectedTxl24hEcFlg={};
	$scope.txl24hEcFlgSelectOnChange= function() {
        $scope.fields.txl_24h_ec_flg = $scope.selectedTxl24hEcFlg.item.key;
    };
	angular.element(function () {
		//权限标识
//	    $scope.authFlgs = [
//	        {'value':'A','name':'SPV A'},
//	        {'value':'B','name':'SPV B'},
//	        {'value':'X','name':'SPV A+B'}
//	    ];
		$http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: FIELD_TYPE_SELECT_AUTHFLGS
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.txn_auth_flgs = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
		
		//交易类型
//	    $scope.txnTypesAdd = [
//	        {'value':'0','name':'正常交易'},
//	        {'value':'1','name':'冲正交易'}
//	    ];
	        $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: FIELD_TYPE_SELECT_TXNTYPESADD
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.txn_type_adds = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	        
	      //借贷别
//	      $scope.authTyps = [
//	          {'value':'0','name':'NO OVERRIDE'},
//	          {'value':'1','name':'TERMINAL'},
//	          {'value':'2','name':'HOST'},
//	          {'value':'3','name':'BOTH'}
//	      ];
          $http({
              method: 'POST',
              url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
              params: {
                  optId: FIELD_TYPE_SELECT_AUTHTYPS
              }
          }).then(function (response) {
              var responseData = response.data;

              if (responseData.flag === 'success') {
                  $scope.auth_typs = responseData.optValueList;
              }
          }, function () {
              toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
          });
	          
        //冲正交易标志
//	        $scope.ecFlgs = [
//	            {'value':'0','name':'NORMAL'},
//	            {'value':'1','name':'EC'}
//	        ];
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: FIELD_TYPE_SELECT_ECFLGS
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.txl_ec_flgs = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });

	    //24小时冲正标志
//	    $scope.HEcFlgs = [
//	        {'value':'0','name':'NORMAL'},
//	        {'value':'1','name':'EC'}
//	    ];
       $http({
           method: 'POST',
           url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
           params: {
               optId: FIELD_TYPE_SELECT_HECFLGS
           }
       }).then(function (response) {
           var responseData = response.data;

           if (responseData.flag === 'success') {
               $scope.txl_24h_ec_flgs = responseData.optValueList;
           }
       }, function () {
           toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
       });
	
	});
    
    
    
  
    //操作时间默认为系统当前日期
    var now = new Date();
    $scope.fields.cpu_date = $filter('date')(now,'yyyy-MM-dd');
    $scope.fields.cpu_time = $filter('date')(now,'HH:mm:ss');
    //取消按钮事件
    $scope.cancelAdd = function () {
        $modalInstance.dismiss('cancel');
    }

    //判断是否重复添加，在输入主键后设置一个blur事件
    $scope.ifExisted = function () {
        var tableParam = getFormData(angular.element('#txn_jour1'));
        console.log(tableParam);
        $http({
            method:'POST',
            url:FM_URL.FM_TXN_INQ,
            data:{'megid': 'test',
                "user": 'test',
                "param": tableParam,
                "correlid":'test'}
        }).then(function successCallback(response) {
            if(response.status == 200){//与后台交互成功
                var result = response.data.data;
                console.log(response);
                console.log(result);
                if(response.data.code == "0000"){//输入的主键已经存在
                	msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_ADD_FAIL');
    				$scope.alerts = [];
    				addFailAlert();

                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 5000);
                    //根据查询结果显示交易类型
	               	for(var i=0;i<$scope.txn_type_adds.length;i++){
	                   	if($scope.txn_type_adds[i].key==result.txn_type){
	                   		$scope.selectedTxnType.item=$scope.txn_type_adds[i];
	                   	}
	                }
                    $scope.fields.ser_name=result.ser_name;
                    $scope.fields.busn_date=result.busn_date;
                    $scope.fields.cpu_time=result.cpu_time;
                    $scope.fields.txn_terminal=result.txn_terminal;
                   //根据查询结果显示权限标识
	               	for(var i=0;i<$scope.txn_auth_flgs.length;i++){
	                   	if($scope.txn_auth_flgs[i].key==result.txn_auth_flg){
	                   		$scope.selectedTxnAuthFlg.item=$scope.txn_auth_flgs[i];
	                   	}
	                }
                  //根据查询结果显示借贷别
	               	for(var i=0;i<$scope.auth_typs.length;i++){
	                   	if($scope.auth_typs[i].key==result.auth_typ){
	                   		$scope.selectedAuthTyp.item=$scope.auth_typs[i];
	                   	}
	                }
	              //根据查询结果显示冲正交易标识
	               	for(var i=0;i<$scope.txl_ec_flgs.length;i++){
	                   	if($scope.txl_ec_flgs[i].key==result.txl_ec_flg){
	                   		$scope.selectedTxlEcFlg.item=$scope.txl_ec_flgs[i];
	                   	}
	                }
                    $scope.fields.txl_ec_log_no=result.txl_ec_log_no;
                    $scope.fields.txl_ar_log_no=result.txl_ar_log_no;
                    $scope.fields.txl_account_no=result.txl_account_no;
                    $scope.fields.txl_oppo_account_no=result.txl_oppo_account_no;
                    $scope.fields.txl_tx_type=result.txl_tx_type;
                    $scope.fields.txl_doc_type=result.txl_doc_type;
                    $scope.fields.txl_book_code=result.txl_book_code;
                    $scope.fields.txl_tx_amt1=result.txl_tx_amt1;
                    $scope.fields.txl_tx_amt2=result.txl_tx_amt2;
                  //根据查询结果显示24小时冲正标识
	               	for(var i=0;i<$scope.txl_24h_ec_flgs.length;i++){
	                   	if($scope.txl_24h_ec_flgs[i].key==result.txl_24h_ec_flg){
	                   		$scope.selectedTxl24hEcFlg.item=$scope.txl_24h_ec_flgs[i];
	                   	}
	                }
                    $scope.fields.txl_inp_area_len=result.txl_inp_area_len;
                    $scope.fields.txl_data_area=result.txl_data_area;

                }else {
                	msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_ADD_SUCCESS');
                    $scope.alerts = [];
                    addSuccessAlert();

                    $timeout(function () {
                        $scope.alerts = [];
                    },3000);
                }

            }else {//与后台交互失败
            	msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_CONNECT_FAIL');
                $scope.alerts = [];
                addFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
            }
        },function errorCallback(response){//请求失败时执行代码
    		msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_CONNECT_FAIL');
            $scope.alerts = [];
            addFailAlert();
            $timeout(function () {
                $scope.alerts = [];
            },3000);
    	})
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
    //添加按钮的单击事件
    $scope.addTradItem = function () {
        var param = getFormData(angular.element('#formAddTradingItem'));
        param.txn_type=$scope.fields.txn_type;
        param.txn_auth_flg=$scope.fields.txn_auth_flg;
        param.auth_typ=$scope.fields.auth_typ;
        param.txl_ec_flg=$scope.fields.txl_ec_flg;
        param.txl_24h_ec_flg=$scope.fields.txl_24h_ec_flg;
        console.log(param);
        $http({
            method:'POST',
            url:FM_URL.FM_TXN_JUR,
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
        }).then(function successCallback(response) {
            if(response.status == 200){//与后台交互成功
                console.log(response);
                if(response.data.code === '0000'){//添加服务成功
                	$scope.isFormDisabled = true;//添加成功是页面锁定
                    msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_ADD_SUCCESS2');
                    $scope.alerts = [];
                    addSuccessAlert();

                    $timeout(function () {
                    	angular.element('#tblTradingList').DataTable().ajax.reload(null, false);
                        $modalInstance.dismiss('cancel');
                    }, 5000);
                    
                }else{//添加失败
                	msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_ADD_FAIL2');
                    $scope.alerts = [];
                    addFailAlert();

                    $timeout(function () {
                        $scope.alerts = [];
                    },3000);
                }

            }else {//与后台交互失败
            	msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_CONNECT_FAIL');
                $scope.alerts = [];
                addFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
            }
        },function errorCallback(response){//请求失败时执行代码
    		msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_CONNECT_FAIL');
            $scope.alerts = [];
            addFailAlert();
            $timeout(function () {
                $scope.alerts = [];
            },3000);
    	});
    }
    //清空表单数据
    $scope.resetAddForm = function () {
    	$scope.fields.txn_jour = "";
    	$scope.selectedTxnType.item=undefined;
        $scope.fields.ser_name = "";
        $scope.fields.busn_date = "";
        $scope.fields.txn_terminal = "";
        $scope.selectedTxnAuthFlg.item=undefined;
        $scope.selectedAuthTyp.item=undefined;
        $scope.selectedTxlEcFlg.item=undefined;
        $scope.fields.txl_ec_log_no = "";
        $scope.fields.txl_ar_log_no = "";
        $scope.fields.txl_account_no = "";
        $scope.fields.txl_oppo_account_no = "";
        $scope.fields.txl_tx_type = "";
        $scope.fields.txl_doc_type = "";
        $scope.fields.txl_book_code = "";
        $scope.fields.txl_tx_amt1 = "";
        $scope.fields.txl_tx_amt2 = "";
        $scope.selectedTxl24hEcFlg.item=undefined;
        $scope.fields.txl_inp_area_len = "";
        $scope.fields.txl_data_area = "";
        var now1 = new Date();
        $scope.fields.cpu_date = $filter('date')(now1,'yyyy-MM-dd');
        $scope.fields.cpu_time = $filter('date')(now1,'HH:mm:ss');
    }

})

//日期插件
app.controller('DateCtrl',function ($scope) {
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