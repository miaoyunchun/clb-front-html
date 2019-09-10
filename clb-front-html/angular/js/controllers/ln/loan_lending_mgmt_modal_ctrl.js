'use strict';

app.controller('LnLendingtMgmtModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http ,lnShareDataService, formUtils) {

	

    // Initialize data and placeholders

    $scope.fields = {
    		lncntrct_cntrct_no: lnShareDataService.common.getSelectedRowItems().lncntrct_cntrct_no,
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
    		lncntrct_cntrct_shape: undefined,
    		lnctrsts_intchk_id: undefined,
    		lnctrsts_intchk_comment: undefined,
    		lnctrsts_intchk_date: undefined,
    		lnctrsts_id: undefined,
    		lnctrsts_intchk_result: undefined,
    		lnctrsts_intchk_rej_reason:	undefined
    };

    $scope.contract_fields = {
    		lncappf_cust_type:lnShareDataService.common.getSelectedRowItems().lncntrct_cust_no.substring(0,1),
    		lncappf_cust_no:lnShareDataService.common.getSelectedRowItems().lncntrct_cust_no.substring(1)
    }
    //进入modal页面自动加载详细信息
    //step1:根据客户号查询账户信息
	 $http(
		{
			method : 'POST',
			url : LN_BASE_URL+'VBS-LN-CONTRACT-INQ',// 贷款详情查询
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
					 $scope.fields = response.data.data;
					}
				});
   
	// Close modal
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
   //提交审核信息
	    $scope.submit = function() {
			$scope.alerts = [];
			
			// Clear alerts
			var param = getFormData(angular.element('#formLoanLendingMgmt'));
			$http({
				method : 'POST',
				url : LN_BASE_URL+'VBS-LN-DRAWAL-DWN',
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
						msg : '合同放款失败'
					});
					$timeout(function() {
						closeAlert(0);
					}, 5000);

				} else {
					// Display an alert
					$scope.alerts.push({
						type : "success",
						msg : '合同放款成功'
					});
					 $scope.isFormDisabled = true;
	                // Refresh the data table
	                angular.element('#tblLoanLendingMgmt').DataTable().ajax.reload(null, false);
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

app.controller('ListLnLendingModalControl', function ($scope, $modal,$timeout, $filter,toaster,lnShareDataService) {
	 $scope.listLnLending = function () {
	   var table = $('#tblLoanLendingMgmt').DataTable();
       // If a row is selected
       if (table.row('.active').length === 1) {
           lnShareDataService.common.setSelectedRowItems(table.row('.active').data());
           if(table.row('.active').data().lncntrct_cntrct_status!='2'){
        	   $timeout(function () {
                   toaster.pop(
                       'error',
                       $filter('translate')('提示'),
                       $filter('translate')('无相关操作')
                   );
               }, 0);
           }else{
        	   $modal.open({
                   backdrop: 'static',
                   templateUrl: 'lnLendingMgmt.html',
                   controller: 'LnLendingtMgmtModalControl',
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
