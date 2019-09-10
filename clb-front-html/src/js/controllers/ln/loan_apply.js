'use strict';


//日期框控件
app.controller('AvailDateCtrl', function ($scope) {
    $scope.today = function () {
        $scope.dt = new Date().toISOString().slice(0, 10); // Pick the yyyy-MM-dd part
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    $scope.format = 'yyyy-MM-dd';
});

//获取表单数据
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

//贷款方法控制
app.controller('lnController', function ($scope,$http, $filter,$timeout,toaster,formUtils) {
	
	var flag = 'true';
	//关闭提示框
	var closeAlert = function (index) {
	    $scope.alerts.splice(index, 1);
	};
	
	$scope.fields = {
			document_type: '',
			document_number: '',
			customer_name: '',
			customers_birthday: '',
			highest_degree: '',
			monthly_salary: '',
			consumption_level: '',
			engaged_in_occupation: '',
			credit_rating:'',
			loan_type:'',
			company_name:'',
			company_logo:'',
			company_size:'',
			loan_product_list:'',
			loan_amount:'',
			customer_number:''
	    };
	var SELECT_DOCUMENT_TYPE="933a62fc696943978b5e17cb6ac48596";
	
	
	var SELECT_HIGHEST_DEGREE="4e098cd705bb494c8f5930f3cf479365";
	
	
	var SELECT_CONSUMPTION_LEVEL="7f97bec237f143848430524ec016b219";
	
	
	var SELECT_CREDIT_RATING="d011ab71b7f74fb5a34ca3713f908393";
	
	
	var SELECT_COMPANY_SIZE="a6d8396ce963464491a93d1c61678cb4";
	
	
	var SELECT_LOAN_TYPE="8fb2c31b0d6742b8954e610128001d22";
	
	
	var SELECT_LOAN_PRODUCT_LIST="a569c5b68bb14ceab3a5a364df303a2e";
	
	$scope.selectedDocumentType={};
    $scope.documentTypeSelectOnChange= function() {
        $scope.fields.document_type = $scope.selectedDocumentType.item.key;
    };
    
  //最高学历
	$scope.selectedHighestDegree={};
	$scope.highestDegreeSelectOnChange= function() {
        $scope.fields.highest_degree = $scope.selectedHighestDegree.item.key;
    };  
    // 消费水平
    $scope.selectedConsumptionLevel={};
	$scope.consumptionLevelSelectOnChange= function() {
        $scope.fields.consumption_level = $scope.selectedConsumptionLevel.item.key;
    };
	//信用等级
    $scope.selectedcreditRating={};
	$scope.creditRatingSelectOnChange= function() {
        $scope.fields.credit_rating = $scope.selectedcreditRating.item.key;
    };
  // 贷款类型
    $scope.selectedloanType={};
	$scope.loanTypeSelectOnChange= function() {
        $scope.fields.loan_type = $scope.selectedloanType.item.key;
    };
 // 公司规模
    $scope.selectedcompanySize={};
	$scope.companySizeSelectOnChange= function() {
        $scope.fields.company_size = $scope.selectedcompanySize.item.key;
    };
 //  贷款产品表（临时）
    $scope.selectedloanProductList={};
	$scope.loanProductListSelectOnChange= function() {
        $scope.fields.loan_product_list = $scope.selectedloanProductList.item.key;
    };
	
	    angular.element(function () {
	    	//证件类型
	   	 
	   	        $http({
	   	            method: 'POST',
	   	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	   	            params: {
	   	                optId: SELECT_DOCUMENT_TYPE
	   	            }
	   	        }).then(function (response) {
	   	            var responseData = response.data;

	   	            if (responseData.flag === 'success') {
	   	                $scope.documentType = responseData.optValueList;
	   	            }
	   	        }, function () {
	   	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	   	        });
	   	   
	   	    //最高学历
	   	    
	   	        $http({
	   	            method: 'POST',
	   	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	   	            params: {
	   	                optId: SELECT_HIGHEST_DEGREE
	   	            }
	   	        }).then(function (response) {
	   	            var responseData = response.data;

	   	            if (responseData.flag === 'success') {
	   	                $scope.highestDegree = responseData.optValueList;
	   	            }
	   	        }, function () {
	   	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	   	        });
	   	    
	   	//消费水平
	   	    
	   	    	 $http({
	   		            method: 'POST',
	   		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	   		            params: {
	   		                optId: SELECT_CONSUMPTION_LEVEL
	   		            }
	   		        }).then(function (response) {
	   		            var responseData = response.data;

	   		            if (responseData.flag === 'success') {
	   		                $scope.consumptionLevel = responseData.optValueList;
	   		            }
	   		        }, function () {
	   		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	   		        });
	   	   
	   	    //信用等级
	   	   
	   	    	 $http({
	   		            method: 'POST',
	   		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	   		            params: {
	   		                optId: SELECT_CREDIT_RATING
	   		            }
	   		        }).then(function (response) {
	   		            var responseData = response.data;

	   		            if (responseData.flag === 'success') {
	   		                $scope.creditRating = responseData.optValueList;
	   		            }
	   		        }, function () {
	   		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	   		        });
	   	   
	   	    //公司规模
	   	   
	   	    	 $http({
	   		            method: 'POST',
	   		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	   		            params: {
	   		                optId: SELECT_COMPANY_SIZE
	   		            }
	   		        }).then(function (response) {
	   		            var responseData = response.data;

	   		            if (responseData.flag === 'success') {
	   		                $scope.companySize = responseData.optValueList;
	   		            }
	   		        }, function () {
	   		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	   		        });
	   	    
	   	    //贷款类型
	   	   
	   	    	 $http({
	   		            method: 'POST',
	   		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	   		            params: {
	   		                optId: SELECT_LOAN_TYPE
	   		            }
	   		        }).then(function (response) {
	   		            var responseData = response.data;

	   		            if (responseData.flag === 'success') {
	   		                $scope.loanType = responseData.optValueList;
	   		            }
	   		        }, function () {
	   		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	   		        });
	   	   
	   	    //贷款产品（临时）
	   	    
	   	    	 $http({
	   		            method: 'POST',
	   		            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	   		            params: {
	   		                optId: SELECT_LOAN_PRODUCT_LIST
	   		            }
	   		        }).then(function (response) {
	   		            var responseData = response.data;

	   		            if (responseData.flag === 'success') {
	   		                $scope.loanProductList = responseData.optValueList;
	   		            }
	   		        }, function () {
	   		            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	   		        });
	   	  
		 });
	
	
	
	//查询
	 $scope.checkblur = function () {
		 var param=getFormData(angular.element('#formLnApply'));//{'lncntrct_cntrct_no':'621501201600002'};
		 var document_type=param.document_type;
		 var document_number=param.document_number;
		 var cust_nbr = "0"+document_number;
		 $scope.fields.customer_number = cust_nbr;
		 if(document_type===null||document_type===""){
			 $timeout(function () {
                 toaster.pop(
                     'error',
                     '提示',
                     '请输入证件类型'
                 );
             }, 0);
		 }else if(document_number==null||document_number==""){
			 $timeout(function () {
                 toaster.pop(
                     'error',
                     '提示',
                     '请输入证件号码'
                 );
             }, 0);
		 }else{
			 //判断是否为系统用户
			 $http({
		            method: 'POST',
		            url: LN_BASE_URL+'VBS-RM-PUSCUST-INQ',//aboutGxAction!getLoanGxInfo
		            data:{'megid': 'test',
			            	"user": 'test',
			            	"param": {cust_number:cust_nbr},
			            	"correlid":'test'}
		        }).then(function successCallback(response) {
		        	$scope.responseData = response.data;
		            if (response.data.code === '0000'){	
		            	$scope.fields.customer_name = response.data.data.cust_name;
		            	//判断是否有客户贷款信息
		            	 $http({
		     	            method: 'POST',
		     	            url: LN_BASE_URL+'VBS-LN-CUSTOMER-INQ',
		     	            data:{'megid': 'test',
		     		            	"user": 'test',
		     		            	"param": {customer_number:cust_nbr},
		     		            	"correlid":'test'}
		     	        }).then(function successCallback(response) {
		     	        	$scope.responseData = response.data;
		     	            if (response.data.code === '0000') {	
		     	            	flag = 'true';
		     	            	console.info(response.data);
		     	                $scope.fields.customers_birthday = response.data.data.birth;
		     	                $scope.fields.highest_degree = response.data.data.high_degree;
		     	                $scope.fields.monthly_salary = response.data.data.salary;
		     	                $scope.fields.consumption_level = response.data.data.consumption_level;
		     	                $scope.fields.engaged_in_occupation = response.data.data.job;
		     	                $scope.fields.credit_rating = response.data.data.quality_level;
			     	            $scope.fields.loan_type = response.data.data.loan_customerid;
		     	                $scope.fields.company_name = response.data.data.company_name;
		     	                $scope.fields.company_logo = response.data.data.listed_company_mark;
		     	                $scope.fields.company_size = response.data.data.company_scale;
		     	                
		     	            }else{
		     	            	flag = 'false';
			     	          	 $timeout(function () {
				                     toaster.pop(
				                         'error',
				                         '提示',
				                         '您是本行客户，请继续填写贷款信息'
				                     );
				                 }, 0);
		     	            }
		     	        })
		            	
		            }else{
		            	$scope.fields.document_number="";
		            	 $timeout(function () {
		                     toaster.pop(
		                         'error',
		                         '提示',
		                         '您不是本行客户，请开户'
		                     );
		                 }, 0);
		            }
		        });
	    }
	 }
	
	 $scope.cancel=function(){
		 formUtils.clearForm($scope.fields);
		 $scope.selectedDocumentType.item=undefined;
		 $scope.selectedHighestDegree.item=undefined;
		 $scope.selectedConsumptionLevel.item=undefined;
		 $scope.selectedcreditRating.item=undefined;
		 $scope.selectedloanType.item=undefined;
		 $scope.selectedcompanySize.item=undefined;
		 $scope.selectedloanProductList.item=undefined;
	 }
	 
	 
	 $scope.add = function () {
			$scope.alerts = [];
		    // Clear alerts
			var param=getFormData(angular.element('#formLnApply'));
			//将下拉框值放入param中
			param.document_type=$scope.fields.document_type;
			param.high_degree=$scope.fields.highest_degree;
			param.consumption_level=$scope.fields.consumption_level;
			param.quality_level=$scope.fields.credit_rating;
			param.loan_documention=$scope.fields.loan_type;
			param.company_scale=$scope.fields.company_size;
			param.lncappf_prod_code=$scope.fields.loan_product_list;
						//true表示该客户已经存在贷款信息
						if (flag == 'true') {
							//进行客户信息更新操作
							$http(
									{
										method : 'POST',
										url : LN_BASE_URL+'VBS-LN-CUSTOMER-UPD',
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
										msg : '客户信息更新失败'
									});
									$timeout(function() {
										closeAlert(0);
									}, 5000);

								} else {
									//贷款申请
									$http({
								        method: 'POST',
								        url: LN_BASE_URL+'VBS-LN-APPLY-ADD',
								        data:{'megid': 'test',
								        	"user": 'test',
								        	"param": param,
								        	"correlid":'test'}
								    }).then(function successCallback(response) {
								        $scope.responseData = response.data;

								        if ($scope.responseData.code != '0000') {
								        	$scope.alerts.push({
								        	        type: 'danger',
								        	        msg: '失败'
								        	    });
								        	$timeout(function () {
								                closeAlert(0);
								            }, 5000);
								        	
								        } else {
								            // Display an alert
								        	$scope.alerts.push({
							        	        type: 'success',
							        	        msg: '贷款申请成功'
							        	    });
								        	
								        	$timeout(function () {
								                closeAlert(0);
								            }, 5000);
								        	$scope.cancel();
								        	/*formUtils.resetChosen(angular.element('#formLnApply'));
								        	//清空表单
								        	$scope.fields.customer_name = "";
					     	                $scope.fields.customers_birthday = "";
					     	                $scope.fields.highest_degree = "";
					     	                $scope.fields.monthly_salary = "";
					     	                $scope.fields.consumption_level = "";
					     	                $scope.fields.engaged_in_occupation = "";
					     	                $scope.fields.credit_rating = "";
						     	            $scope.fields.loan_type = "";
					     	                $scope.fields.company_name = "";
					     	                $scope.fields.company_logo = "";
					     	                $scope.fields.company_size = "";
					     	                $scope.fields.document_number = "";
					     	                $scope.fields.loan_product_list = "";
					     	                $scope.fields.loan_amount = "";
					     	                $scope.fields.card_number = "";*/
					     	                
								        }

								    }, function errorCallback(response) {
								        console.error('error ' + response);
								        $modalInstance.dismiss('cancel');
								    });
								}

							}, function errorCallback(response) {
								console.error('error ' + response);
								$modalInstance.dismiss('cancel');
							})
						}else {
							//flag 为false时，进行添加客户信息操作
							$http(
									{
										method : 'POST',
										url : LN_BASE_URL+'VBS-LN-CUSTOMER-ADD',
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
										msg : '客户信息添加失败'
									});
									$timeout(function() {
										closeAlert(0);
									}, 5000);

								}  else {
									$http({
								        method: 'POST',
								        url: LN_BASE_URL+'VBS-LN-APPLY-ADD',
								        data:{'megid': 'test',
								        	"user": 'test',
								        	"param": param,
								        	"correlid":'test'}
								    }).then(function successCallback(response) {
								        $scope.responseData = response.data;

								        if ($scope.responseData.code != '0000') {
								        	$scope.alerts.push({
								        	        type: 'danger',
								        	        msg: '贷款申请失败'
								        	    });
								        	$timeout(function () {
								                closeAlert(0);
								            }, 5000);
								        	
								        } else {
								            // Display an alert
								        	 $scope.alerts.push({ type: "success", msg: '贷款申请成功'});
								        	 $timeout(function() {
													closeAlert(0);
												}, 5000);
								        	 $scope.fields.customer_name = "";
						     	                $scope.fields.customers_birthday = "";
						     	                $scope.fields.highest_degree = "";
						     	                $scope.fields.monthly_salary = "";
						     	                $scope.fields.consumption_level = "";
						     	                $scope.fields.engaged_in_occupation = "";
						     	                $scope.fields.credit_rating = "";
							     	            $scope.fields.loan_type = "";
						     	                $scope.fields.company_name = "";
						     	                $scope.fields.company_logo = "";
						     	                $scope.fields.company_size = "";
								        }

								    }, function errorCallback(response) {
								        console.error('error ' + response);
								        $modalInstance.dismiss('cancel');
								    });
								}

							}, function errorCallback(response) {
								console.error('error ' + response);
								$modalInstance.dismiss('cancel');
							})
						}

					};
	 
	});

