'use strict';

app.controller('GXDeleteModalControl', function ($scope, $modal, $modalInstance, $filter, $interval, $timeout, $http, lnShareDataService) {

    // Prototypes
	 $scope.fields = {
	    		lncntrct_cntrct_no: undefined,
	    		gxcapply_id: undefined,
	    		gxcapply_loan_acct: undefined,
	    		gxcapply_cust_name: undefined,
	    		gxcapply_loan_due_date: undefined,
	    		gxcapply_extend_type: undefined,
	    		gxcapply_loan_amt: undefined,
	    		gxcapply_extend_date: undefined,
	    		gxcapply_extend_fee: undefined,
	    		gxcapply_extend_rate: undefined,
	    		gxcapply_extend_total_days: undefined,
	    		gxcapply_loan_ext_sts: undefined,
	    		gxcapply_apply_date: undefined,
	    		gxcapply_remark: undefined
	    };

    // Initialize data and placeholders
    $scope.fields = lnShareDataService.common.getSelectedRowItems();


    $scope.responseData = {
        flag: '',
        data: {},
        message: ''
    };

    $scope.alerts = [
        // { type: 'danger', msg: '' }
    ];

    $scope.isFormDisabled = false;

    // Add new organization
    $scope.remove = function () {
        $http({
            method: 'POST',
            url: LN_BASE_URL+'VBS-LN-GXAPPLY-DEL',
            data : {
				'megid' : 'test',
				"user" : 'test',
				"param" : {
	                'lncntrct_cntrct_no': $scope.fields.lncntrct_cntrct_no,
	            },
				"correlid" : 'test'
			}
        }).then(function successCallback(response) {
            $scope.responseData = response.data;

            if ($scope.responseData.flag === 'failed') {
                deleteFailAlert($scope.responseData.message);

                $timeout(function () {
                    closeAlert(0);
                }, 5000);
            } else {
                deleteSuccessAlert();
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
    };

    // Close modal
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // Alert when operation is successful
    var deleteSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg: $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_DELETE_SUCCESSFUL')
        });
    };

    // Alert when operation failed
    var deleteFailAlert = function (message) {
        if (message === '' || message === null || message === undefined) {
            message = $filter('translate')('pages.sm.org.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_ORG_DELETE_FAILED');
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

app.controller('DeleteGxModalInstanceCtrl', function ($scope, $modal, $timeout, $filter, toaster, lnShareDataService) {
    $scope.showDeleteOrgPopup = function () {
        var table = $('#tblExtension').DataTable();

        // If a row is selected
        if (table.row('.active').length === 1) {
        	lnShareDataService.common.setSelectedRowItems(table.row('.active').data());

            $modal.open({
                backdrop: 'static',
                templateUrl: 'deleteGxModal.html',
                controller: 'GXDeleteModalControl',
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

    };
});

