'use strict';

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

var flag = 'true';

app.controller('ShowCustInfoController', function ($scope,$http,$filter,$timeout,toaster, $state,$stateParams) {
	
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
	
	$scope.responseData = {
	        flag: '',
	        data: {},
	        message: ''
	    };

    $scope.fields = {
    		custType: '',
	    	idType: '',
	    	idNumber: '',
	    	custLevel: '',
	    	sex:'',
	    	nationality:'',
	    	name:'',
	    	city:'',
	    	address:'',
	    	postCode:'',
	    	phoneNo:'',
	    	cellPhoneNo:'',
	    	currency:'',
	    	subjectNo:'',
	    	openDate:'',
	    	endDate:'',
	    	org:'',
	    	operator:'',
	    	firstAmt:'',
	    	email:'',
	    	prodCycle:''
    };
    
    $scope.goback = function () {
    	$state.go('app.dp.depManagement');
    };
    
    var idnbr = $stateParams.idNumber;
    var custtype = $stateParams.custType;
    var idtype = $stateParams.idType;
    var level = $stateParams.custLevel;
    var idNo = idtype + idnbr
    $scope.fields.custType = custtype;

    $scope.fields.idType = idtype;
 
    $scope.fields.idNumber = idnbr;

    $scope.fields.custLevel = level;
    
    
    $http({
        method: 'POST',
        url: 'http://127.0.0.1:8085/clb-consumer/VBS-RM-PUSCUST-INQ',
        data:{'megid': 'test',
        	"user": 'test',
        	"param": {cust_number:idNo},
        	"correlid":'test'}
    }).then(function successCallback(response) {
        $scope.responseData = response.data;
//        console.log("数据："+JSON.stringify(response.data));
        if ($scope.responseData.code === '0000') { 
        	flag = 'true';
        	$scope.fields.sex = response.data.data.cust_gender;
        	$scope.fields.nationality = response.data.data.cust_gender;
        	$scope.fields.name = response.data.data.cust_name;
        	$scope.fields.city = response.data.data.cust_city;
        	$scope.fields.address = response.data.data.cust_address;
        	$scope.fields.postCode = response.data.data.cust_post_code;
        	$scope.fields.phoneNo = response.data.data.cust_phone_number;
        	$scope.fields.cellPhoneNo = response.data.data.cust_hand_phone;
        	$timeout(function () {
                toaster.pop(
                    'success',
                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_SUCCESSFUL'),
                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_CUST_INQ_SUCCESSFUL')
                );
            }, 0);

        } else {
        	flag = 'flase';
        	$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_INFO'),
                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_INPUT_DATA')
                );
            }, 0); 
        }
        
    }, function errorCallback(response) {
    	$timeout(function () {
            toaster.pop(
                'error',
                $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_INPUT_NULL')
            );
        }, 0);
    });
    
    var date = new Date().toISOString().slice(0, 10);
    var date2 = new Date();
    date2.setYear((date2.getFullYear() + 6));
    $scope.blur = function(){
    	var datainfo = getFormData(angular.element('#formCustInfo'));
    	var prod = datainfo.product_id;
    	$http({
            method: 'POST',
            url: 'http://127.0.0.1:8085/clb-consumer/VBS-CP-PROPAR-INQ',
            data:{'megid': 'test',
            	"user": 'test',
            	"param": {product_id:prod},
            	"correlid":'test'}
        }).then(function successCallback(response) {
            $scope.responseData = response.data;
            if ($scope.responseData.code === '0000') { 
            	$scope.fields.currency = response.data.data.product_ccy;
            	$scope.fields.subjectNo = response.data.data.subject_number;
            	$scope.fields.openDate = date;
            	$scope.fields.endDate = date2.toISOString().slice(0, 10);
            	$scope.fields.org = response.data.data.associate_org_id;
            	$scope.fields.operator = sessionStorage.getItem('user');
            	$timeout(function () {
                    toaster.pop(
                        'success',
                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_SUCCESSFUL'),
                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_SUCCESSFUL')
                    );
                }, 0);

            } else {
            	$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
                    );
                }, 0); 

            }
            
        }, function errorCallback(response) {
        	$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_PRODUCT_INQ_FAILED')
                );
            }, 0);
        });
    }
    
    $scope.next = function (){
    	var param = getFormData(angular.element('#formCustInfo'));
    	//不同的产品调用不同的开户服务
    	var url1='';
    	if (param.product_id.slice(0,6)==='M00111'){
    		url1='http://127.0.0.1:8085/clb-consumer/VBS-DP-M0011101-ADD'
    	}
    	if (param.product_id.slice(0,6)==='C00111'){
    		url1='http://127.0.0.1:8085/clb-consumer/VBS-DP-C0011102-ADD'
    	}
    	if (param.product_id.slice(0,6)==='P00112'){
    		url1='http://127.0.0.1:8085/clb-consumer/VBS-DP-P0011201-ADD'
    	}
    	if (param.product_id.slice(0,6)==='P00109'){
    		url1='http://127.0.0.1:8085/clb-consumer/VBS-DP-P0010909-ADD'
    	}
    	if (param.product_id.slice(0,6)==='M00113'){
    		url1='http://127.0.0.1:8085/clb-consumer/VBS-DP-M0011301-ADD'
    	}
    	if (param.product_id.slice(0,6)==='M00114'){
    		url1='http://127.0.0.1:8085/clb-consumer/VBS-DP-M0011401-ADD'
    	}
    	if (param.product_id.slice(0,6)==='M00115'){
    		url1='http://127.0.0.1:8085/clb-consumer/VBS-DP-M0011511-ADD'
    	}

    	if (flag="false"){//flag为FALSE时调用客户添加服务
    		$http({
                method: 'POST',
                url: 'http://127.0.0.1:8085/clb-consumer/VBS-RM-PUSCUST-ADD',
                data:{'megid': 'test',
                	"user": 'test',
                	"param": param,
                	"correlid":'test'}
            }).then(function successCallback(response) {
                if ($scope.responseData.code === '0000') { 
                	$timeout(function () {
                        toaster.pop(
                            'success',
                            $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_SUCCESSFUL'),
                            $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_CUST_ADD_SUCCESSFUL')
                        );
                    }, 0);
                	$http({//调用账户开户服务
                        method: 'POST',
                        url: url1,
                        data:{'megid': 'test',
                        	"user": 'test',
                        	"param": param,
                        	"correlid":'test'}
                    }).then(function successCallback(response) {
                        if ($scope.responseData.code === '0000') { 
                        	$timeout(function () {
                                toaster.pop(
                                    'success',
                                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_SUCCESSFUL'),
                                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_SUCCESSFUL')
                                );
                            }, 0);
                        	

                        } else {
                        	$timeout(function () {
                                toaster.pop(
                                    'error',
                                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_FAILED')
                                );
                            }, 0); 

                        }
                        
                    }, function errorCallback(response) {
                    	$timeout(function () {
                            toaster.pop(
                                'error',
                                $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                                $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_FAILED')
                            );
                        }, 0);
                    });

                } else {
                	$timeout(function () {
                        toaster.pop(
                            'error',
                            $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                            $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_CUST_ADD_FAILED')
                        );
                    }, 0); 

                }
                
            }, function errorCallback(response) {
            	$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_CUST_ADD_FAILED')
                    );
                }, 0);
            });
    	}else{
    		$http({//flag为TRUE时调用客户更新服务
                method: 'POST',
                url: 'http://127.0.0.1:8085/clb-consumer/VBS-RM-PUSCUST-MNT',
                data:{'megid': 'test',
                	"user": 'test',
                	"param": param,
                	"correlid":'test'}
            }).then(function successCallback(response) {            
                if ($scope.responseData.code === '0000') { 
                	$timeout(function () {
                        toaster.pop(
                            'success',
                            $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_SUCCESSFUL'),
                            $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_CUST_UPDATE_SUCCESSFUL')
                        );
                    }, 0);
                	$http({//调用账户开户服务
                        method: 'POST',
                        url: url1,
                        data:{'megid': 'test',
                        	"user": 'test',
                        	"param": param,
                        	"correlid":'test'}
                    }).then(function successCallback(response) {
                    	$scope.responseData = response.data;
                        if ($scope.responseData.code === '0000') { 
                        	$timeout(function () {
                                toaster.pop(
                                    'success',
                                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_SUCCESSFUL'),
                                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_SUCCESSFUL')
                                );
                            }, 0);
                        	var datainfo = getFormData(angular.element('#formCustInfo'));
                        	var idtype = datainfo.idType;
                        	var idnbr = datainfo.idNumber;
                        	var acctnbr = response.data.data.acct_nbr;
                        	var prod = datainfo.prodCycle;
                        	$state.go('app.dp.cardopen',{idNumber:idnbr,idType:idtype,prodCycle:prod,acctNbr:acctnbr});

                        } else {
                        	$timeout(function () {
                                toaster.pop(
                                    'error',
                                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                                    $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_FAILED')
                                );
                            }, 0); 

                        }
                        
                    }, function errorCallback(response) {
                    	$timeout(function () {
                            toaster.pop(
                                'error',
                                $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                                $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_FAILED')
                            );
                        }, 0);
                    });

                } else {
                	$timeout(function () {
                        toaster.pop(
                            'error',
                            $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                            $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_CUST_UPDATE_FAILED')
                        );
                    }, 0); 

                }
                
            }, function errorCallback(response) {
            	$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TITLES.DP_ACCT_TOASTER_TITLE_ERROR'),
                        $filter('translate')('pages.dp.DP_ACCT_TOASTER_TEXTS.DP_ACCT_OPEN_CUST_UPDATE_FAILED')
                    );
                }, 0);
            });
    	}
    }
    
});
