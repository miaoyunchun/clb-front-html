'use strict';

app.controller('LnAccountOpenModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http ,lnShareDataService, formUtils) {

	

    // Initialize data and placeholders

    $scope.fields = {
    		lncappf_id: lnShareDataService.common.getSelectedRowItems().lncappf_id,
    		customer_number: lnShareDataService.common.getSelectedRowItems().lncappf_cust_type+lnShareDataService.common.getSelectedRowItems().lncappf_cust_no,
    		loan_name: undefined,
    		prod_id: undefined,
    		ccy_name: undefined,
    		acct_status: undefined,
    		loan_last_date: undefined,
    		rate_type: undefined,
    		rate: undefined,
    		lncappf_cust_type: lnShareDataService.common.getSelectedRowItems().lncappf_cust_type,
    		lncappf_cust_no: lnShareDataService.common.getSelectedRowItems().lncappf_cust_no,
    };
    
    var SELECT_ACCT_STATUS="d2b4fae428dd424db82d3bdaea4e3e35";
    var SELECT_RATE_TYPE="5eb89f40d6394dc7bee8bce6f12ea3c7";
    $scope.selectedAcctStatus={};
    $scope.selectedRateType={};
    //账户状态 
    $scope.acctStatusSelectOnChange=function(){
    	$scope.fields.acct_status=$scope.selectedAcctStatus.item.key;
    }
    //利率类型 
    $scope.rateTypeSelectOnChange=function(){
    	$scope.fields.rate_type=$scope.selectedRateType.item.key;
    }
    angular.element(function(){
    	//账户状态 
    	$http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: SELECT_ACCT_STATUS
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.acctStatus = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    	//利率类型
    	$http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: SELECT_RATE_TYPE
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.rateType = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    })

    
	 $http(
		{
			method : 'POST',
			url : LN_BASE_URL+'VBS-LN-ACCT-INQ',//贷款详情查询
			data : {
				'megid' : 'test',
				"user" : 'test',
				"param" : $scope.fields,
				"correlid" : 'test'
			}
		})
		.then(
				function successCallback(response) {
					$scope.responseData = response.data;
					console.info(response.data.data);
					if ($scope.responseData.code == '0000') {
						$scope.fields.loan_name= response.data.data.loan_name;
						$scope.fields.prod_id= response.data.data.prod_id;
						$scope.fields.ccy_name= response.data.data.ccy_name;
						$scope.fields.acct_status= response.data.data.acct_status;
						$scope.fields.loan_last_date= response.data.data.loan_last_date;
						$scope.fields.rate_type= response.data.data.rate_type;
						$scope.fields.rate= response.data.data.rate;
					}else if ($scope.responseData.code == '0002'){
						 $http(
									{
										method : 'POST',
										url : LN_BASE_URL+'VBS-LN-CUSTOMER-INQ',//贷款详情查询
										data : {
											'megid' : 'test',
											"user" : 'test',
											"correlid" : 'test',
											"param" : {
												'customer_number': $scope.fields.lncappf_cust_type+$scope.fields.lncappf_cust_no
											}
										}
									})
									.then(
											function successCallback(response) {
												$scope.responseData = response.data;
												console.info(response.data.data);
												if ($scope.responseData.code == '0000') {
													$scope.fields.loan_name= response.data.data.name;
												}
											});
					}
					
				});
   
	// Close modal
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
   //提交审核信息
	    $scope.add = function() {
			$scope.alerts = [];
			
			// Clear alerts
			var param = getFormData(angular.element('#formLoanAccount'));
			$http({
				method : 'POST',
				url : LN_BASE_URL+'VBS-LN-ACCT-ADD',
				data : {
					'megid' : 'test',
					"user" : 'test',
					"param" : param,
					"correlid" : 'test'
				}
			}).then(function successCallback(response) {
				$scope.responseData = response.data;

				if ($scope.responseData.code != '0000') {
					$scope.alerts.push({
						type : 'danger',
						msg : '失败'
					});
					$timeout(function() {
						closeAlert(0);
					}, 5000);

				} else {
					// Display an alert
					$scope.alerts.push({
						type : "success",
						msg : '贷款开户成功'
					});
					 $scope.isFormDisabled = true;
	                // Refresh the data table
	                angular.element('#tblLoanAccount').DataTable().ajax.reload(null, false);
	                $timeout(function () {
	                    $modalInstance.dismiss('cancel');
	                }, 2000);
				}
			}, function errorCallback(response) {
				console.error('error ' + response);
				$modalInstance.dismiss('cancel');
			});
		};
    // Alert when operation is successful
    var addSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg: $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_ADD_SUCCESSFUL')
        });
    };

    // Alert when operation failed
    var addFailAlert = function (message) {
        $scope.alerts.push({
            type: 'danger',
            msg: message
        });
    };

    // Close the alert
    var closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
    // $scope.closeAlert = closeAlert;

});

app.controller('OpenAccoutModalControl', function ($scope, $modal,$timeout, $filter,toaster,lnShareDataService) {
	 $scope.openLnAccount = function () {
	   var table = $('#tblLoanAccount').DataTable();

       // If a row is selected
       if (table.row('.active').length === 1) {
           lnShareDataService.common.setSelectedRowItems(table.row('.active').data());
           if(table.row('.active').data().lncappf_status!='002'){
        	   $timeout(function () {
                   toaster.pop(
                       'error',
                       $filter('translate')('提示'),
                       $filter('translate')('此申请书用户不能开户')
                   );
               }, 0);
           }else{
        	   $modal.open({
                   backdrop: 'static',
                   templateUrl: 'lnAccountOpen.html',
                   controller: 'LnAccountOpenModalControl',
                   size: 'lg'
               });
           }
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
});
