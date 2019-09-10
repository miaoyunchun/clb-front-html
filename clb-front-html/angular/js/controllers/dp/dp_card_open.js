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

app.controller('CardOpenController', function ($scope,$http,$filter,$timeout,toaster, $state,$stateParams) {
	
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
    		CardTpye: '',
    		cardNo:'',
    		custNo:'',
    		acctNo:'',
    		cardLevel:'',
    		setPwd:'',
    		cardPwd:'',
    		cardOpenDate:'',
    		confirmPwd:'',
    		expireDate:'',
    		prodId:''
    };
    
    $scope.goback = function () {
    	$state.go('app.dp.depManagement');
    };
    
    var idnbr = $stateParams.idNumber;
    var idtype = $stateParams.idType;
    var prod = $stateParams.prodCycle;
    var idNo = idtype + idnbr
    $scope.fields.custNo = idNo;
    $scope.fields.prodId = prod;
    $scope.fields.custLevel = level;
    
    $scope.next = function(){
    var datainfo = getFormData(angular.element('#formCardOpen'));
    $http({
        method: 'POST',
        url: 'http://127.0.0.1:8085/clb-consumer/VBS-DP-CARD-ADD',
        data:{'megid': 'test',
        	"user": 'test',
        	"param": datainfo,
        	"correlid":'test'}
    }).then(function successCallback(response) {
        $scope.responseData = response.data;
//        console.log("数据："+JSON.stringify(response.data));
        if ($scope.responseData.code === '0000') { 
        	flag = 'true';
        	$scope.fields.cardNo = response.data.data.card_number;
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
    
    }  
    
});
