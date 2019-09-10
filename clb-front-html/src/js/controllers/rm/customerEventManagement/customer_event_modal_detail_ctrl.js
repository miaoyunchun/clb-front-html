'use strict';
var custEventInformation=undefined;
var param=undefined;
//点击维护按钮，弹出维护客户事件的modal框
app.controller('customerEventDetailModalCtrl',function ($scope,$modal,rmShareDataService) {
    $scope.getInformation = function (index) {
    	console.log(index);
    	console.log($scope.CustomerEvents[index]);
    	custEventInformation={
			"ctale_func": "q",
			"ctale_cus_num": $scope.CustomerEvents[index].ctaleqo_cus_num,
    	    "ctale_title": $scope.CustomerEvents[index].ctaleqo_title,
    	    "ctale_hpn_date": $scope.CustomerEvents[index].hpn_date
        }
    	console.log(custEventInformation);
    	//把数据存入service中
    	rmShareDataService.setCustEventInformation(custEventInformation);
        $modal.open({
            backdrop: 'static',
            templateUrl: 'customerEventDetailModal.html',
            controller: 'CustomerEventDetailModalCtrl1',
            size: 'lg'
        });
    }
});

app.controller('CustomerEventDetailModalCtrl1',function ($scope,$modalInstance,$http,$filter,$timeout,rmShareDataService) {
	
		$scope.fields = {//页面表单数据
			'ctaleTitle': '',
			'ctaleMark': '',
			'ctaleCusNum': '',
			'ctaleHpnDate': '',
			'updateTime': '',
			'updateUser': ''
			
		};
	   //点击cancel按钮关闭modal框
	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	    //自动查询数据
    	//从service中取出数据
    	param = rmShareDataService.getCustEventInformation();
    	$http({
    		method: 'POST',
            url: RM_URL.RM_CUSTALE_MNT,//访问clb-consumer请求数据
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
    	}).then(function successCallback(response){
    		if(response.status==200){//添加成功
    			console.log('返回结果');
    			console.log(response.data);
    			if(response.data.code=="0000"){
    				if(response.data.data.update_time){
        				$scope.fields.updateTime=response.data.data.update_time.substr(0,10);
        			};
        			$scope.fields.ctaleTitle=response.data.data.ctale_title;
        			$scope.fields.ctaleMark=response.data.data.ctale_mark;
        			$scope.fields.ctaleCusNum=response.data.data.ctale_cus_num;
        			$scope.fields.ctaleHpnDate=response.data.data.ctale_hpn_date;
        			$scope.fields.updateUser=response.data.data.update_user;
    			}else{
    				$timeout(function () {
	                    toaster.pop(
	                        'error',
	                        $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_QUERY_FAIL'),
	                        $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE7')
	                    );
	                }, 0);
    			}
    		}else{
    			$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                        $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                    );
                }, 0);
    		}
    	},function errorCallback(response){//请求失败时执行代码
    		$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                    $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                );
            }, 0);
    	});
	    
	    
}); 

