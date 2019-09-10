/**
 * 
 */
'use strict';

app.controller('BalanceQueryController', function ($scope, $http, $filter, $timeout, $interval,dataTableUtils,formUtils,toaster,$state,$stateParams) {
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
			 card_no:'',//客户卡号
			 card_pwd:'',//卡片密码
			 acctBal:undefined //账户余额
		    };
	 $scope.query = function(){
		 var datainfo = getFormData(angular.element('#formQueryBalance1'));
		 console.log('存款页面'+JSON.stringify(datainfo));
		 var card_no = datainfo.card_no;
		 var card_pwd= datainfo.card_pwd;
	    	$http({
	            method: 'POST',
	            url: 'http://127.0.0.1:8085/clb-consumer/VBS-DP-BALANCE2-FIN',
	            data:{'megid': 'test',
	            	"user": 'test',
	            	"param": {card_number:card_no,card_pin:card_pwd},
	            	"correlid":'test'}
	        }).then(function successCallback(response) {
	            $scope.responseData = response.data;
	            if ($scope.responseData.code === '0000') { 
	            	$scope.fields.acctBal = response.data.data.balance;
	            	//去除style属性，将search框和list框显示
	            	$("#formQueryBalance2").removeAttr("style");
	            } else {
	            	$timeout(function () {
	                    toaster.pop(
	                        'error',
	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
//	                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
	                        $filter('translate')('该卡号不存在')
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
	  
	 $scope.return = function(){
		 formUtils.clearForm($scope.fields);
		 document.all("formQueryBalance2").style["display"]="none";
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

        // Clear Chosen dropdowns
        formUtils.resetChosen(angular.element('#formDpTrans'));

        // Clear input fields
        formUtils.clearForm($scope.fields);

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#dpTransList');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    }


});


