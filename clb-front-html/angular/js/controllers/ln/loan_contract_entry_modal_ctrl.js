'use strict';

app.controller('LnContractEntryModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http ,lnShareDataService, formUtils) {

	

    // Initialize data and placeholders

    $scope.fields = {
    		lncappf_id: lnShareDataService.common.getSelectedRowItems().lncappf_id,
    		customer_number: lnShareDataService.common.getSelectedRowItems().lncappf_cust_type+lnShareDataService.common.getSelectedRowItems().lncappf_cust_no,
    		lncappf_cust_type: lnShareDataService.common.getSelectedRowItems().lncappf_cust_type,
    		lncappf_cust_no: lnShareDataService.common.getSelectedRowItems().lncappf_cust_no,
    		lncntrct_cntrct_no: undefined,
    		lncntrct_loan_no: undefined,
    		lncntrct_cust_no: undefined,
    		lncntrct_cust_name: undefined,
    		lncntrct_cntrct_status: undefined,
    		lncntrct_ccy_type: undefined,
    		lncntrct_iou_no: undefined,
    		lncntrct_credit_limit: undefined,
    		lncntrct_loan_use: undefined,
    		lncntrct_drdw_card_no: undefined,
    		lncntrct_intst_settlement: undefined,
    		lncntrct_intst_settlement_date: undefined,
    		lncntrct_open_date: undefined,
    		lncntrct_intst_strt_date: undefined,
    		lncntrct_expiration_date: undefined,
    		lncntrct_no_of_installment: undefined,
    		lncntrct_cntrct_amount: undefined,
    		lncntrct_cntrct_amount_total: undefined,
    		lncntrct_remaining_loan_bal: undefined,
    		lncntrct_relate_card_no: undefined,
    		lncntrct_strt_payback_date: undefined,
    		lncntrct_intst_rate_tye: undefined,
    		lncntrct_intst_rate: undefined,
    		lncntrct_effective_date: undefined,
    		lncntrct_loan_app_id: undefined,
    		lncntrct_loan_officer_id: undefined,
    		lncntrct_raten_effe_way: undefined,
    		lncntrct_raten_flu_way: undefined,
    		lncntrct_raten_flu_mod: undefined,
    		lncntrct_execn_rate: undefined,
    		lncntrct_rateo_flu_way: undefined,
    		lncntrct_rateo_flu_mod: undefined,
    		lncntrct_execo_rat: undefined,
    		lncntrct_prod_type: undefined,
    		lncntrct_prod_sub_type: undefined,
    		lncntrct_repay_way: undefined,
    		lncntrct_curr_install: undefined,
    		lncntrct_cntrct_shape: undefined
    };
    
    var myDate=new Date();
    var year = myDate.getFullYear();
	var month = (myDate.getMonth()*1)+1;
	if((month+"").length=="1"){
		month = "0"+month;
	}
	var day = myDate.getDate();
	if((day+"").length=="1"){
		day = "0"+day;
	}
	var nowDate = year+"-"+month+"-"+day;	
	$scope.fields.lncntrct_intst_strt_date=nowDate;
	$scope.fields.lncntrct_strt_payback_date=nowDate;
	$scope.fields.lncntrct_effective_date=nowDate;
	$scope.fields.lncntrct_intst_settlement = "1";
	$scope.fields.lncntrct_loan_use = "1";
	$scope.fields.lncntrct_repay_way = "3";
	$scope.fields.lncntrct_intst_rate_tye="1";
	$scope.fields.lncntrct_raten_effe_way="1";
	//截止日期
	var endDate = (year*1+1)+"-"+month+"-"+day;
	$scope.fields.lncntrct_intst_settlement_date=endDate;
	$scope.fields.lncntrct_expiration_date=endDate;
	//期数
	$scope.fields.lncntrct_no_of_installment="12";
	
	
    //进入modal页面自动加载详细信息
    //step1:根据客户号查询账户信息
	 $http(
		{
			method : 'POST',
			url : LN_BASE_URL+'VBS-LN-ACCT-INQ',// 贷款详情查询
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
					 $scope.fields.lncntrct_loan_no = response.data.data.loan_acct_id;
					 $scope.fields.lncntrct_ccy_type = response.data.data.ccy_name;
					 $scope.fields.lncntrct_cust_name = response.data.data.loan_name;
					 $scope.fields.lncntrct_cntrct_status = "0";
					 $scope.fields.lncntrct_cntrct_shape = "1";
					 $scope.fields.lncntrct_open_date = response.data.data.loan_open_date;
						//step2:根据客户号和申请书状态查询贷款申请书信息
						 $http(
									{
										method : 'POST',
										url : LN_BASE_URL+'VBS-LN-APPLY-INQ',// 贷款详情查询
										data : {
											'megid' : 'test',
											"user" : 'test',
											"correlid" : 'test',
											"param" :  $scope.fields
										}
									})
									.then(
											function successCallback(response) {
												$scope.responseData = response.data;
												console.info(response.data.data);
												if ($scope.responseData.code == '0000') {
												 $scope.fields.lncntrct_cust_no = response.data.data.loan_lncappf_cust_no;
												 $scope.fields.lncntrct_relate_card_no = response.data.data.lncappf_card_no;
												 $scope.fields.lncntrct_drdw_card_no = response.data.data.lncappf_card_no;
												 $scope.fields.lncntrct_cntrct_amount = response.data.data.lncappf_amt;
												 $scope.fields.lncntrct_prod_type = response.data.data.lncappf_prod_code;
												 $scope.fields.lncntrct_loan_app_id = response.data.data.lncappf_id;	
												 $scope.fields.lncntrct_curr_install = "0";
													//step3:根据产品类型查出产品参数信息
													$http(
															{
																method : 'POST',
																url : LN_BASE_URL+'VBS-LN-CONTRACTENTRY-INQ',// 贷款详情查询
																data : {
																	'megid' : 'test',
																	"user" : 'test',
																	"correlid" : 'test',
																	"param" : {
																		"product_id": $scope.fields.lncntrct_prod_type,
																		"customer_number":$scope.fields.customer_number
																	}
																}
															})
															.then(
																	function successCallback(response) {
																		$scope.responseData = response.data;
																		console.info(response.data.data);
																		if ($scope.responseData.code == '0000') {
																			 $scope.fields.lncntrct_intst_rate = response.data.data.interest_rate;
																			 $scope.fields.lncntrct_loan_officer_id = response.data.data.lncntrct_loan_officer_id;
																			 $scope.fields.lncntrct_credit_limit = $scope.fields.lncntrct_cntrct_amount*1.5;
																			 $scope.fields.lncntrct_raten_flu_way = "1";
																			 $scope.fields.lncntrct_rateo_flu_way = "1";	
																			 $scope.fields.product_name = response.data.data.product_name;	
																			 $scope.fields.lncntrct_cust_no = response.data.data.cust_loan_no;
																		}
																	});
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
			var param = getFormData(angular.element('#formLoanContractEntry'));
			$http({
				method : 'POST',
				url : LN_BASE_URL+'VBS-LN-CONTRACT-ADD',
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
						msg : '合同录入失败'
					});
					$timeout(function() {
						closeAlert(0);
					}, 5000);

				} else {
					// Display an alert
					$scope.alerts.push({
						type : "success",
						msg : '合同录入成功'
					});
					 $scope.isFormDisabled = true;
	                // Refresh the data table
	                angular.element('#tblLoanContractEntry').DataTable().ajax.reload(null, false);
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

app.controller('EntryLnContractModalControl', function ($scope, $modal,$timeout, $filter,toaster,lnShareDataService) {
	 $scope.entryLnContract = function () {
	   var table = $('#tblLoanContractEntry').DataTable();
       // If a row is selected
       if (table.row('.active').length === 1) {
           lnShareDataService.common.setSelectedRowItems(table.row('.active').data());
           if(table.row('.active').data().lncappf_status!='003'){
        	   $timeout(function () {
                   toaster.pop(
                       'error',
                       $filter('translate')('提示'),
                       $filter('translate')('此申请书用户不能录入')
                   );
               }, 0);
           }else{
        	   $modal.open({
                   backdrop: 'static',
                   templateUrl: 'lnContractEntry.html',
                   controller: 'LnContractEntryModalControl',
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
