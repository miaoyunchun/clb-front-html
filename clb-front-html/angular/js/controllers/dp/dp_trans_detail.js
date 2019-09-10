'use strict';

app.controller('TransDetailModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http ,dpDataService, formUtils) {

	

    // Initialize data and placeholders

    $scope.fields = {
    		trans_no: undefined,
    		trans_code: undefined,
    		trans_desc: undefined,
    		trans_sequence: undefined,
    		before_trans_amt: undefined,
    		trans_date: undefined,
    		trans_acct: undefined,
    		trans_amt: undefined,
    		trans_time: undefined,
    		trans_card_no: undefined,
    		after_trans_amt: undefined,
    		trans_remark: undefined
    };


    $scope.fields = dpDataService.common.getSelectedRowItems();
    

	 $http(
		{
			method : 'POST',
			url : 'http://127.0.0.1:8085/clb-consumer/VBS-DP-TRANSACT-INQ',//交易详情查询
			data : {
				'megid' : 'test',
				"user" : 'test',
				"param" : $scope.fields,
				"correlid" : 'test'
			}
		// params:
		// getFormData(angular.element('#formApplyExtension'))
		})
		.then(
				function successCallback(response) {
					$scope.responseData = response.data;
					if ($scope.responseData.code == '0000') {
						$scope.fields.gxcapply_id= response.data.data.id;
						$scope.fields.gxcapply_loan_acct= response.data.data.loan_account;
						$scope.fields.gxcapply_cust_name= response.data.data.cust_name;
						$scope.fields.gxcapply_loan_due_date= response.data.data.loan_due_date;
						$scope.fields.gxcapply_extend_type= response.data.data.extend_type;
						$scope.fields.gxcapply_extend_date= response.data.data.extend_date;
						$scope.fields.gxcapply_extend_total_days= response.data.data.extend_total_days;
						$scope.fields.gxcapply_loan_ext_sts= response.data.data.loan_ext_sts;
						$scope.fields.gxcapply_remark= response.data.data.remark;
						$scope.fields.gxcapply_apply_date= response.data.data.apply_date;
					}
				});
    // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
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

app.controller('DpDetailModalControl', function ($scope, $modal,$timeout, $filter,toaster,dpDataService) {
	 $scope.showAddOrgPopup = function () {
	   var table = $('#tblExtension').DataTable();

       // If a row is selected
       if (table.row('.active').length === 1) {
           dpDataService.common.setSelectedRowItems(table.row('.active').data());

           $modal.open({
               backdrop: 'static',
               templateUrl: 'detailGxModal.html',
               controller: 'TransDetailModalControl',
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
});
