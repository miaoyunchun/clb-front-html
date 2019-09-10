'use strict';

app.controller('CheckModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, formUtils,lnShareDataService) {

    // Prototypes
	$scope.fields = {
			gxcapply_loan_ext_sts: lnShareDataService.common.getSelectedRowItems().gxcapply_loan_ext_sts,
			gxcaudit_audit_apply_date: undefined,//审批操作时间
			gxcaudit_audit_channel: undefined,//审批渠道
			gxcaudit_audit_date: undefined,//审核日期
			gxcaudit_loan_nbr: lnShareDataService.common.getSelectedRowItems().lncntrct_cntrct_no,//贷款合同号
			gxcaudit_audit_cust_id: undefined,//客户号
    		gxcaudit_audit_cust_name: undefined,//客户名称
    		gxcaudit_loan_due_date: undefined,//展期前贷款到期日
    		gxcaudit_loan_prod: undefined,//展期前产品类型
    		gxcaudit_loan_amt: undefined,//贷款金额
    		gxcaudit_loan_ext_date: undefined,//展期后到期日
    		gxcaudit_audit_option:undefined,//审批状态
    		gxcaudit_loan_remark:undefined, //备注
    		gxcaudit_audit_remark: undefined//审批说明
    };
    // Initialize data and placeholders
//	$scope.fields.initial = lnShareDataService.common.getSelectedRowItems();

	//获取展期详情信息
	 $http(
				{
					method : 'POST',
					url : LN_BASE_URL+'VBS-LN-GXAPPLY-INQ',//展期详情查询
					data : {
						'megid' : 'test',
						"user" : 'test',
						"param" : {
			                'lncntrct_cntrct_no': $scope.fields.gxcaudit_loan_nbr,
			            },
						"correlid" : 'test'
					}
				})
				.then(
						function successCallback(response) {
							$scope.responseData = response.data;
							if ($scope.responseData.code == '0000') {
								$scope.fields.gxcaudit_audit_cust_id= response.data.data.id;
								$scope.fields.gxcaudit_audit_cust_name= response.data.data.cust_name;
								$scope.fields.gxcaudit_loan_due_date= response.data.data.loan_due_date;
								$scope.fields.gxcaudit_loan_prod= response.data.data.extend_type;
								$scope.fields.gxcaudit_loan_ext_date= response.data.data.extend_date;
								$scope.fields.gxcaudit_loan_remark= response.data.data.remark;
								$scope.fields.gxcaudit_loan_amt= response.data.data.loan_amt;
							}
						});
    $scope.responseData = {
        flag: '',
        data: {},
        message: ''
    };

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.isFormDisabled = false;


    /**
     * Perform edit
     */
   
    $scope.check = function () {
    		var param=getFormData(angular.element('#formCheckGx'));
    	    console.info(param);
        $http({
            method: 'POST',
            url: LN_BASE_URL+'VBS-LN-GXAPPLY-CHK',
            data : {
				'megid' : 'test',
				"user" : 'test',
				"param" : param,
				"correlid" : 'test'
			}
        }).then(function successCallback(response) {
            $scope.responseData = response.data;

            if ($scope.responseData.flag === 'failed') {
                editFailAlert($scope.responseData.message);

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            } else {
                editSuccessAlert();
                $scope.isFormDisabled = true;
                // Refresh the data table
                angular.element('#tblExtension').DataTable().ajax.reload(null, false);
                $timeout(function () {
                    $modalInstance.dismiss('cancel');
                }, 2000);
            }

        }, function errorCallback(response) {
            console.error('error ' + response);
            $modalInstance.dismiss('cancel');
        });
    	}
    	 

    // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    
   
    // Alert when operation is successful
    var editSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg: $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_EDIT_SUCCESSFUL')
        });
    };

    // Alert when operation failed
    var editFailAlert = function (message) {
        if (message === '' || message === null || message === undefined) {
            message = $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_EDIT_FAILED');
        }

        $scope.alerts.push({
            type: 'danger',
            msg: message
        });
    };

    // Close the alert
    var closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

});

app.controller('CheckGxModalInstanceCtrl', function ($scope, $modal, $timeout, $filter, toaster,lnShareDataService) {
    $scope.showEditOrgPopup = function () {
        var table = $('#tblExtension').DataTable();

        // If a row is selected
        if (table.row('.active').length === 1) {
        	lnShareDataService.common.setSelectedRowItems(table.row('.active').data());
        	console.info(table.row('.active').data());
        	if(table.row('.active').data().gxcapply_loan_ext_sts!='A'){
        		warnToast();
        	}else{
        		   $modal.open({
                       backdrop: 'static',
                       templateUrl: 'checkGxModal.html',
                       controller: 'CheckModalControl',
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

    };
    
    var warnToast = function () {
    	$timeout(function () {
            toaster.pop(
                'error',
                '注意',
                '此展期无需人工审核'
            );
        }, 0);
    };
});

//


