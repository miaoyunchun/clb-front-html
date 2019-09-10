'use strict';


app.controller('AcctTransferController', function ($scope,$http,$filter,$timeout,toaster, $state,$stateParams) {
	
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
	
    $scope.fields = {
    		outCardNo: undefined,//转出卡号
    		custName: undefined,//客户名称
    		transAmt: undefined,//转出金额
    		inCardNo: undefined,//转入卡号
    		cardPwd:undefined,//卡片密码
    		acctBal:undefined,//账户余额
    		card_nbr:undefined//卡号
    };
    
    
    $scope.blur = function(){
		 var datainfo = getFormData(angular.element('#formAcctTransfer1'));
		 console.log('存款页面'+JSON.stringify(datainfo));
		 var card_no = datainfo.card_no;
		 var card_pwd= datainfo.card_pwd;
	    	$http({
	            method: 'POST',
	            url: 'http://127.0.0.1:8085/clb-consumer/VBS-DP-BALANCE-FIN',
	            data:{'megid': 'test',
	            	"user": 'test',
	            	"param": {card_number:card_no},
	            	"correlid":'test'}
	        }).then(function successCallback(response) {
	            $scope.responseData = response.data;
	            if ($scope.responseData.code === '0000') { 
	            	$scope.fields.custName = response.data.data.cust_name;
	            } else {
	            	$timeout(function () {
	                    toaster.pop(
	                        'error',
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
//	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
	                        $filter('translate')('该卡号不是在本行开立')
	                    );
	                }, 0); 

	            }
	            
	        }, function errorCallback(response) {
	        	$timeout(function () {
	                toaster.pop(
	                    'error',
	                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
	                    $filter('translate')('卡号查询出错')
	                );
	            }, 0);
	        });
	    }
    
    $scope.next = function(){
		 var param = getFormData(angular.element('#formAcctTransfer1'));
		 console.log('存款页面'+JSON.stringify(param));
	    	$http({
	            method: 'POST',
	            url: 'http://127.0.0.1:8085/clb-consumer/VBS-DP-INTERNAL-FTS',
	            data:{'megid': 'test',
	            	"user": 'test',
	            	"param": param,
	            	"correlid":'test'}
	        }).then(function successCallback(response) {
	            $scope.responseData = response.data;
	            if ($scope.responseData.code === '0000') { 
	            	$("#formQueryBalance2").removeAttr("style");
	            	$scope.fields.acctBal = response.data.data.money_red_bal;
	            } else {
	            	if($scope.responseData.code === '0001'){
	            		$timeout(function () {
		                    toaster.pop(
		                        'error',
		                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
//		                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
		                        $filter('translate')('卡片状态存在问题')
		                    );
		                }, 0);
	            	}
	            	if($scope.responseData.code === '0003'){
	            		$timeout(function () {
		                    toaster.pop(
		                        'error',
		                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
//		                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
		                        $filter('translate')('卡片余额无法扣款')
		                    );
		                }, 0);
	            	}
	            	if($scope.responseData.code === '1009'){
	            		$timeout(function () {
		                    toaster.pop(
		                        'error',
		                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
//		                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
		                        $filter('translate')('卡号密码不正确')
		                    );
		                }, 0);
	            	}
	            }
	            
	        }, function errorCallback(response) {
	        	$timeout(function () {
	                toaster.pop(
	                    'error',
	                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
	                    $filter('translate')('行内转账出错')
	                );
	            }, 0);
	        });
	    }
    	
    $scope.return = function(){
		 formUtils.clearForm($scope.fields);
		 document.all("formQueryBalance2").style["display"]="none";
	    }
    
});
