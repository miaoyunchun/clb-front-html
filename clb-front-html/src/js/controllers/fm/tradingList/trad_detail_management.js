'use strict';
//打开科目详情的modal框
app.controller('tradDetailModalCtrl',function ($scope,$modal,$timeout,fmShareDataService,toaster,$http,$rootScope,$filter) {
	
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
	//下拉框
    
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
          	$rootScope.txn_auth_flgs = responseData.optValueList;
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
            	$rootScope.txn_type_adds = responseData.optValueList;
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
            	$rootScope.auth_typs = responseData.optValueList;
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
        	  $rootScope.txl_ec_flgs = responseData.optValueList;
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
        	 $rootScope.txl_24h_ec_flgs = responseData.optValueList;
         }
     }, function () {
         toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
     });
     
    $scope.showTradDetailModal = function () {
        var subTable = $('#tblTradingList').DataTable();

        // If a row is selected
        if (subTable.row('.active').length === 1) {

            //save the row which is selected
            fmShareDataService.setTradDetailFiler(subTable.row('.active').data());
            
            $modal.open({
                 backdrop: 'static',
                 templateUrl: 'tradDetailModal.html',
                 controller: 'tradDetailModalControl',
                 size: 'lg'
             });
        } else {
            $timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.common.COMMON_TOAST_TITLES.COMMON_TOAST_TITLE_ERROR'),
                    $filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW')
                );
            }, 0);
        }
    }
})

app.controller('tradDetailModalControl',function ($scope,$interval,$timeout,$modalInstance,$http,fmShareDataService,$rootScope,$filter) {
	
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
    
	var msg = undefined;
    //初始化页面表单数据
	$scope.fields = {
		'txn_jour': '',
		'txn_type_detail': '',
		'ser_name': '',
		'busn_date': '',
		'cpu_date': '',
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
    //取消按钮事件
    $scope.cancelDetail = function () {
        $modalInstance.dismiss('cancel');
    }

    //开启modal框时给页面初始化
    //获得选中的行的查询条件
    var param = {
    	txn_jour:fmShareDataService.getTradDetailFiler().txn_jour
    };
    console.log(param);
    
    $http({
        method: 'POST',
        url:FM_URL.FM_TXN_INQ,//直接访问clb-api
        data:{'megid': 'test',
            "user": 'test',
            "param": param,
            "correlid":'test'}
    }).then(function successCallback(response){
        if(response.status == 200){//查询成功
        	console.log('结果');
            console.log(response);
            var result=response.data.data;
            console.log(result);
            //初始化modal框
            if(response.data.code=="0000"){
            	$scope.fields.txn_jour=result.txn_jour;
            	//根据查询结果显示交易类型
               	for(var i=0;i<$scope.txn_type_adds.length;i++){
                   	if($scope.txn_type_adds[i].key==result.txn_type){
                   		$scope.selectedTxnType.item=$rootScope.txn_type_adds[i];
                   	}
                }
                $scope.fields.ser_name=result.ser_name;
                $scope.fields.busn_date=result.busn_date;
                $scope.fields.cpu_date=result.cpu_date;
                $scope.fields.cpu_time=result.cpu_time;
                $scope.fields.txn_terminal=result.txn_terminal;
              //根据查询结果显示权限标识
               	for(var i=0;i<$scope.txn_auth_flgs.length;i++){
                   	if($scope.txn_auth_flgs[i].key==result.txn_auth_flg){
                   		$scope.selectedTxnAuthFlg.item=$rootScope.txn_auth_flgs[i];
                   	}
                }
              //根据查询结果显示借贷别
               	for(var i=0;i<$scope.auth_typs.length;i++){
                   	if($scope.auth_typs[i].key==result.auth_typ){
                   		$scope.selectedAuthTyp.item=$rootScope.auth_typs[i];
                   	}
                }
              //根据查询结果显示冲正交易标识
               	for(var i=0;i<$scope.txl_ec_flgs.length;i++){
                   	if($scope.txl_ec_flgs[i].key==result.txl_ec_flg){
                   		$scope.selectedTxlEcFlg.item=$rootScope.txl_ec_flgs[i];
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
                   		$scope.selectedTxl24hEcFlg.item=$rootScope.txl_24h_ec_flgs[i];
                   	}
                }
                $scope.fields.txl_inp_area_len=result.txl_inp_area_len;
                $scope.fields.txl_data_area=result.txl_data_area;
            }else{
            	msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_DETAIL_FAIL');
                $scope.alerts = [];
                editFailAlert();

                $timeout(function () {
                    $scope.alerts = [];
                },3000);
            }
            
        }else{
    		msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_CONNECT_FAIL');
            $scope.alerts = [];
            editFailAlert();
            $timeout(function () {
                $scope.alerts = [];
            },3000);
        }
    },function errorCallback(response){//请求失败时执行代码
		msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_CONNECT_FAIL');
        $scope.alerts = [];
        editFailAlert();
        $timeout(function () {
            $scope.alerts = [];
        },3000);
	});
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
})