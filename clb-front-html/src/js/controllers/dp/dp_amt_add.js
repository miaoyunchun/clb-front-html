/**
 * 
 */
'use strict';

app.controller('AmtAddController', function ($scope, $http, $filter, $timeout, $interval,dataTableUtils,formUtils,toaster,$state,$stateParams) {
    // Prototypes
    var responseData = {
        flag: '',
        userInfo: [
            {
                userId: '',
                username: ''
            }
        ],
        companyInfo: [
            {
                companyId: 0,
                companyName: ''
            }
        ],
        active: [
            {
                active: '',
                value: 0
            }
        ]
    };

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
			 card_no:undefined,//查询卡号
			 current_date:undefined, //当前日期
			 prod_name:undefined //产品名称
		    };
	 var date = new Date().toISOString().slice(0, 10);
	 $scope.query = function(){
		 var datainfo = getFormData(angular.element('#formAddAmt1'));
		 var card_no = datainfo.card_no;
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
	            	$scope.fields.current_date = date;
	            	$scope.fields.current_date = response.data.data.product_name;
	            	//去除style属性，将search框和list框显示
	            	$("#formAddAmt2").removeAttr("style");
	            } else {
	            	$timeout(function () {
	                    toaster.pop(
	                        'error',
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
//	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
	                        $filter('translate')('测试一下能不能过')
	                    );
	                }, 0); 

	            }
	            
	        }, function errorCallback(response) {
	        	$timeout(function () {
	                toaster.pop(
	                    'error',
	                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
	                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
	                );
	            }, 0);
	        });
	    }
	 
	 $scope.next = function(){
		 var card_number=(getFormData(angular.element('#formAddAmt1'))).card_no;
		 var param = getFormData(angular.element('#formAddAmt2'));
		 var amt = param.amount;
		 console.log('存款页面'+JSON.stringify(param));
		 $http({
	            method: 'POST',
	            url: 'http://127.0.0.1:8085/clb-consumer/VBS-DP-BALANCE-ADD',
	            data:{'megid': 'test',
	            	"user": 'test',
	            	"param": {card_number:card_number,money_add:amt},
	            	"correlid":'test'}
	        }).then(function successCallback(response) {
	            $scope.responseData = response.data;
	            if ($scope.responseData.code === '0000') { 
	            	$timeout(function () {
	                    toaster.pop(
	                        'success',
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_SUCCESSFUL'),
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_SUCCESSFUL')
	                    );
	                }, 0);

	            } else {
	            	$timeout(function () {
	                    toaster.pop(
	                        'error',
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
	                    );
	                }, 0); 

	            }
	            
	        }, function errorCallback(response) {
	        	$timeout(function () {
	                toaster.pop(
	                    'error',
	                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
	                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
	                );
	            }, 0);
	        });
	    }
	
    

    $scope.active = [{
        active: '',
        value: 0
    }];

//    $scope.placeholders = shareDataService.getPlaceHolders();

    /* Search filter */
    /**
     * Search button behaviour
     */
  
    /* End of buttons on the DataTable */
    
    /**
     * Clear button behaviour
     */
    $scope.clear = function () {
   		 formUtils.clearForm($scope.fields);
   		 document.all("formAddAmt2").style["display"]="none";

    }


});


