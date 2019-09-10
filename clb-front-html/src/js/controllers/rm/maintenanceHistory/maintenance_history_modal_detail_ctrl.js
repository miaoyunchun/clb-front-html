'use strict';
//点击维护按钮，弹出维护客户事件的modal框
var maintenanceHistoryInformation=undefined;
var historyData=undefined;
var param=undefined;
var msg=undefined;
app.controller('maintenanceHistoryDetailModalCtrl',function ($scope,$http,$modal,$timeout,$filter,toaster,rmShareDataService) {
    $scope.getHistoryInformation = function (index) {
    	console.log(index);
    	console.log($scope.MaintenanceHistory[index]);
    	param={
    		"count": "",
		    "limit": "02",
		    "max_key": "",
		    "min_key": "",
		    "order": {},
		    "page": "01",
		    "screen": "1",
		    "search":{
				"time_stamp":$scope.MaintenanceHistory[index].time_stamp,
				"trans_name":$scope.MaintenanceHistory[index].trans_name,
				"number":$scope.MaintenanceHistory[index].cus_num,
				"st_item":"",
				"mulpage_ind":'N'
		    },
        };
    	$http({
    		method: 'POST',
            url: RM_URL.RM_CUSHIST_ITM,//访问clb-consumer请求数据
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
    	}).then(function successCallback(response){
    		console.log(response);
    		console.log(response.data);
    		if(response.status=="200"){
    			if(response.data.code=="0000"){
    				maintenanceHistoryInformation={
						time_stamp:$scope.MaintenanceHistory[index].time_stamp,
			    		trans_name:$scope.MaintenanceHistory[index].trans_name,
			    		cus_num:$scope.MaintenanceHistory[index].cus_num,
			    		list:response.data.data.list
    				}
    				console.log('2222');
	    			console.log(maintenanceHistoryInformation);
	    			//把数据存入service中
	    	    	rmShareDataService.setMaintenanceHistoryInformation(maintenanceHistoryInformation);
    				$modal.open({
    		            backdrop: 'static',
    		            templateUrl: 'maintenanceHistoryModalForm.html',
    		            controller: 'maintenanceHistoryDetailModalCtrl1',
    		            size: 'lg'
    		        });
    			}else{
    				$timeout(function () {
                        toaster.pop(
                            'error',
                            $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_QUERY_FAIL'),
	                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE')
                        );
                    }, 0);
    			}
    		}else{
    			$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                    );
                }, 0);
    		}
    	},function errorCallback(response){//请求失败时执行代码
    		msg=$filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2');
            $scope.alerts = [];
            hisFailAlert();

            $timeout(function () {
                $scope.alerts = [];
            },3000);
    	});
    }
});

app.controller('maintenanceHistoryDetailModalCtrl1',function ($scope,$modalInstance,$http,$filter,$timeout,rmShareDataService) {
		$scope.fields = {//页面表单数据
			'hisCustNum': '',
			'timeStamp': '',
			'transName': ''
		};
	   //点击cancel按钮关闭modal框
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    
	  //从service中取出数据
	    historyData = rmShareDataService.getMaintenanceHistoryInformation();
		console.log('data');
		console.log(historyData);
		$scope.fields.hisCustNum=historyData.cus_num;
		$scope.fields.timeStamp=historyData.time_stamp;
		$scope.fields.transName=historyData.trans_name;
		$scope.MaintenanceHistorys=historyData.list;
	    
}); 

