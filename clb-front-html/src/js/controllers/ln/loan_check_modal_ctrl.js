'use strict';

app.controller('LnCheckModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http ,lnShareDataService, formUtils) {

	

    // Initialize data and placeholders

    $scope.fields = {
    		lncappf_id: lnShareDataService.common.getSelectedRowItems().lncappf_id,
    		lncappf_cust_type: lnShareDataService.common.getSelectedRowItems().lncappf_cust_type,
    		salary: undefined,
    		loan_documention: undefined,
    		lncappf_status: lnShareDataService.common.getSelectedRowItems().lncappf_status,
    		lncappf_cust_no: lnShareDataService.common.getSelectedRowItems().lncappf_cust_no,
    		consumption_level: undefined,
    		company_name: undefined,
    		lncappf_amt: lnShareDataService.common.getSelectedRowItems().lncappf_amt,
    		birth: undefined,
    		job: undefined,
    		listed_company_mark: undefined,
    		name: undefined,
    		high_degree: undefined,
    		quality_level: undefined,
    		company_scale: undefined,
    		lncappf_intchk_id:undefined,
    		lncappf_intchk_result:undefined,
    		lncappf_intchk_rej_reason:undefined,
    		lncappf_final_limit:undefined,
    		lncappf_intchk_comment:undefined
    };
    
    
    var SELECT_INCAPPF_INTCHK_RESULT="6d6996a64a6f4d5d878a58569b1af964";
    var SELECT_INCAPPF_REF_REASON="9ebe9d479bfd478580551e42dc387572";
    
    //检验结果
    $scope.selectedlncappfIntchkResult={}
    $scope.lncappfIntchkResultSelectOnChange=function(){
    	$scope.fields.lncappf_intchk_result=$scope.selectedlncappfIntchkResult.item.key;
    }
    
    //原因说明
    $scope.selectedlncappfIntchkRejReason={}
    $scope.lncappfIntchkRejReasonSelectOnChange=function(){
    	$scope.fields.lncappf_intchk_rej_reason=$scope.selectedlncappfIntchkRejReason.item.key;
    }
    
    angular.element(function(){
    	$http(
    			{
    				method : 'POST',
    				url : LN_BASE_URL+'VBS-LN-APPLY-INQ',//贷款详情查询
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
    							$scope.fields.name= response.data.data.name;
    							$scope.fields.birth= response.data.data.birth;
    							$scope.fields.high_degree= response.data.data.high_degree;
    							$scope.fields.salary= response.data.data.salary;
    							$scope.fields.consumption_level= response.data.data.consumption_level;
    							$scope.fields.job= response.data.data.job;
    							$scope.fields.quality_level= response.data.data.quality_level;
    							$scope.fields.loan_documention= response.data.data.loan_documention;
    							$scope.fields.company_name= response.data.data.company_name;
    							$scope.fields.listed_company_mark= response.data.data.listed_company_mark;
    							$scope.fields.company_scale= response.data.data.company_scale;
    						}
    			});
    	//=======下拉框
    	//检验结果
    	$http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: SELECT_INCAPPF_INTCHK_RESULT
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.lncappfIntchkResult = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    	//原因说明
    	$http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: SELECT_INCAPPF_REF_REASON
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.lncappfIntchkRejReason = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    })

    
	 
   
	// Close modal
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	//显示隐藏框并切换按钮
	    $scope.add = function(){
	    	document.getElementById('div_commit').style.display='block';
	    	document.getElementById('div_check').style.display='none';
	    	document.getElementById('hidden_div').style.display='block';
	    }
	    
  //提交审核信息
	    $scope.commit = function() {
			$scope.alerts = [];
			
			// Clear alerts
			var param = getFormData(angular.element('#formLoanCheck'));
			param.lncappf_intchk_result=$scope.fields.lncappf_intchk_result;
			param.lncappf_intchk_rej_reason=$scope.fields.lncappf_intchk_rej_reason;
			$http({
				method : 'POST',
				url : LN_BASE_URL+'VBS-LN-APPLY-CHK',
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
						msg : '贷款申请审核成功'
					});
					 $scope.isFormDisabled = true;
	                // Refresh the data table
	                angular.element('#tblLoanCheck').DataTable().ajax.reload(null, false);
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

app.controller('ApplyCheckModalControl', function ($scope, $modal,$timeout, $filter,toaster,lnShareDataService) {
	 $scope.checkApply = function () {
	   var table = $('#tblLoanCheck').DataTable();
       // If a row is selected
       if (table.row('.active').length === 1) {
           lnShareDataService.common.setSelectedRowItems(table.row('.active').data());
           if(table.row('.active').data().lncappf_status!='000'){
        	   $timeout(function () {
                   toaster.pop(
                       'error',
                       $filter('translate')('提示'),
                       $filter('translate')('此申请书无需审核')
                   );
               }, 0);
           }else{
        	   $modal.open({
                   backdrop: 'static',
                   templateUrl: 'lnApplyCheck.html',
                   controller: 'LnCheckModalControl',
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
