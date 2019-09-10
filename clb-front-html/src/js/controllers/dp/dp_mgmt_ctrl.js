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

app.controller('CustInfoController', function ($scope,$http,$filter,$timeout,toaster, $state,dpDataService) {
	
	$scope.responseData = {
	        flag: '',
	        data: {},
	        message: ''
	    };

    $scope.fields = {
    		custType: '',
	    	idType: '',
	    	idNumber: ''
    };
    
    $scope.cancel =	function(){
		$scope.fields.custType ="";
        $scope.fields.idType = "";
        $scope.fields.idNumber = "";
        $scope.fields.custLevel = "";
	};
	
$scope.next = function () {
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
    $scope.alerts = [];
    var datainfo = getFormData(angular.element('#formAcctOpen'));
    var custtype=datainfo.custType;
    var type=datainfo.idType;
    var id=datainfo.idNumber;
    var level=datainfo.custLevel
    var idNo=type+id;
//     console.log("数据>>>>>>>>>>>>"+JSON.stringify(datainfo));
    
            	$state.go('app.dp.custinfo',{idNumber:id,idType:type,custType:custtype,custLevel:level});
       
};
});





