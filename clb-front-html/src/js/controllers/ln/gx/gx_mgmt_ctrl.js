'use strict';

app
		.controller('AvailDateCtrl',
				function($scope) {
					$scope.today = function() {
						$scope.dt = new Date().toISOString().slice(0, 10); // Pick the yyyy-MM-dd part
					};
					$scope.today();

					$scope.clear = function() {
						$scope.dt = null;
					};

					// Disable weekend selection
					$scope.disabled = function(date, mode) {
						return (mode === 'day' && (date.getDay() === 0 || date
								.getDay() === 6));
					};

					$scope.toggleMin = function() {
						$scope.minDate = $scope.minDate ? null : new Date();
					};
					$scope.toggleMin();

					$scope.open = function($event) {
						$event.preventDefault();
						$event.stopPropagation();

						$scope.opened = true;
					};

					$scope.dateOptions = {
						formatYear : 'yy',
						startingDay : 1,
						class : 'datepicker'
					};

					$scope.format = 'yyyy-MM-dd';
				});

function getFormData($form) {
	var unindexed_array = $form.serializeArray();
	var indexed_array = {};

	$.map(unindexed_array, function(n, i) {

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

app
		.controller(
				'QueryContractCtrl',
				function($scope, $http, $filter, $timeout, toaster) {
					$scope.fields = {
						loanNbr : '',
						auditCustId : undefined,
						loanAccount : '',
						custName : '',
						loanDueDate : '',
						prodType : '',
						loanAmt : '',
						extendDate : '',
						extendFee : '',
						extendRate : '',
						remark : ''
					};

					$scope.blur = function() {
						var param = getFormData(angular
								.element('#formApplyExtension'));//{'lncntrct_cntrct_no':'621501201600002'};
						console.info(param);
						var contract_id = param.lncntrct_cntrct_no;
						if (contract_id === null || contract_id === "") {
							$timeout(function() {
								toaster.pop('error', '提示', '请输入合同编号');
							}, 0);
						} else {
							$http(
									{
										method : 'POST',
										url : LN_BASE_URL+'VBS-LN-GXAPPLY-AP1',//aboutGxAction!getLoanGxInfo
										data : {
											'megid' : 'test',
											"user" : 'test',
											"param" : param,
											"correlid" : 'test'
										}
									//	            params: getFormData(angular.element('#formApplyExtension'))
									})
									.then(
											function successCallback(response) {
												$scope.responseData = response.data;
												if ($scope.responseData.code == '0000') {
													$scope.fields.auditCustId = response.data.data.lncntrct_cust_no;
													$scope.fields.loanAccount = response.data.data.lncntrct_cust_no;
													$scope.fields.custName = response.data.data.lncntrct_cust_name;
													$scope.fields.loanDueDate = response.data.data.lncntrct_expiration_date;
													$scope.fields.prodType = response.data.data.lncntrct_prod_type;
													$scope.fields.loanAmt = response.data.data.lncntrct_cntrct_amount;//response.data.lncntrct_cntrct_amount;
												}
											});
						}
					}
				});

app.controller('FirstController', function($scope, $http, $filter, $timeout) {

	var closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	//	$scope.cancel = function(){
	//		var $form=$("#cancel").closest("formApplyExtension");
	//		var $names=$form.find("[type='text'],[type='password']");
	//		$names.each(function(){
	//			$(this).val("");
	//		})
	//	}
	$scope.cancel = function() {
		$scope.fields.auditCustId = "";
		$scope.fields.loanAccount = "";
		$scope.fields.custName = "";
		$scope.fields.loanDueDate = "";
		$scope.fields.prodType = "";
		$scope.fields.loanAmt = "";
		$scope.fields.loanNbr = "";
		$scope.fields.extendDate = "";
		$scope.fields.extendFee = "";
		$scope.fields.extendRate = "";
		$scope.fields.remark = "";
	}

	$scope.add = function() {
		$scope.alerts = [];
		//	alert("hah ");
		// Clear alerts
		var param = getFormData(angular.element('#formApplyExtension'));
		$http({
			method : 'POST',
			url : LN_URLLN-GXAPPLY-AP2,
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
					msg : '展期申请成功'
				});
				$scope.fields.auditCustId = "";
				$scope.fields.loanAccount = "";
				$scope.fields.custName = "";
				$scope.fields.loanDueDate = "";
				$scope.fields.prodType = "";
				$scope.fields.loanAmt = "";
				$scope.fields.loanNbr = "";
				$scope.fields.extendDate = "";
				$scope.fields.extendFee = "";
				$scope.fields.extendRate = "";
				$scope.fields.remark = "";
			}

		}, function errorCallback(response) {
			console.error('error ' + response);
			$modalInstance.dismiss('cancel');
		});
	};
});

// Alert when operation is successful
//var addSuccessAlert = function () {
//    $scope.alerts.push({
//        type: 'success',
//        msg: $filter('translate')('pages.sm.ORG_MGMT_ALERTS.ORG_MGMT_ALERT_SUCCESSFUL')
//    });
//};