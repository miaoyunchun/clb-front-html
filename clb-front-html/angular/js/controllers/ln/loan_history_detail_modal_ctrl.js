'use strict';

app.controller('LnHistoryQueryModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http ,lnShareDataService, formUtils) {

	

    // Initialize data and placeholders

    $scope.fields = {
    		lnctranf_id: lnShareDataService.common.getSelectedRowItems().lnctranf_id,
    		lnctranf_account: undefined,
    		lnctranf_card_no: undefined,
    		lnctranf_desc: undefined,
    		lnctranf_date: undefined,
    		lnctranf_time: undefined,
    		lnctranf_amt_before_trans: undefined,
    		lnctranf_amt_in_trans: undefined,
    		lnctranf_amt_after_trans: undefined,
    		lnctranf_remark: undefined,
    		lnctranf_contract_id: undefined,
    		lnctranf_pay_way: undefined
    };

    //进入modal页面自动加载详细信息
    //step1:根据客户号查询账户信息
	 $http(
		{
			method : 'POST',
			url : LN_BASE_URL+'VBS-LN-LOGDETAL-INQ',// 贷款详情查询
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
});

app.controller('DetailLnHistoryModalControl', function ($scope, $modal,$timeout, $filter,toaster,lnShareDataService) {
	 $scope.detailLnHistory = function () {
	   var table = $('#tblLoanHistoryQuery').DataTable();
	   lnShareDataService.common.setSelectedRowItems(table.row('.active').data());
       // If a row is selected
       if (table.row('.active').length === 1) {
        	   $modal.open({
                   backdrop: 'static',
                   templateUrl: 'lnHistoryDetail.html',
                   controller: 'LnHistoryQueryModalControl',
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
