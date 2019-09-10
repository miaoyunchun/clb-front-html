'use strict';
var param=undefined;
var page=undefined;
var limit=undefined;
var screen=undefined;
var CustomerEvents=undefined;
var mulpage_ind=undefined;
var st_title=undefined;
var st_hpdate=undefined;
var formData=undefined;
var custEvent=undefined;
app.controller('CustomerEventPageCtrl',function ($scope,$http,$timeout,$filter,toaster) {
	$scope.isTableHidden=true;//先把表格隐藏
    $scope.queryCustomerEvent = function(){
        formData=getFormData(angular.element('#formCustomerEventFilter'));//获取客户事件表单
        console.log(formData);
        if(formData.ctale_cus_num.length=="19"){
        	page=1;
        	screen=1;
        	param={
        		"count": "",
    		    "limit": "10",
    		    "map_dir": "",
    		    "max_key": "",
    		    "min_key": "",
    		    "order": {},
    		    "page": page,
    		    "screen": screen,
    		    "search":{
    				"cus_num":formData.ctale_cus_num,
    				"title":formData.ctale_title,
    				"hpn_date":formData.ctale_hpn_date,
    				"mulpage_ind":mulpage_ind,
    				"st_title":st_title,
    				"st_hpdate":st_hpdate
    		    },
            };
	    	$http({
		        method:'POST',
		        url:RM_URL.RM_CUSTALE_EQY,//访问clb-consumer请求数据
		        data:{'megid':'test',
		        	  'user':'test',
		        	  'param':param,
		        	  'correlid':'test'}
		    }).then(function successCallback(response){
		    	console.log('结果');
		    	console.log(response);
		    	console.log(response.data);
		    	if(response.status=="200"){
		    		if(response.data.code=='0000'){
		    			$scope.isTableHidden=false;//查询到数据时表格显示
        				$scope.CustomerEvents=response.data.data.list;
        				mulpage_ind=response.data.data.mulpage_ind;
            			st_title=response.data.data.st_title;
            			st_hpdate=response.data.data.st_hpdate;
		    		}else{
		    			$scope.isTableHidden=true;//查不到数据时表格隐藏
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
        }else{
        	$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_QUERY_FAIL'),
                    $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE6')
                );
            }, 0);
        }
    };
    $scope.customerNextPopup=function(){
    	console.log(mulpage_ind);
    	if(mulpage_ind=="N"){
    		page=page+1;
        	screen=screen+1;
        	param={
        		"count": "",
    		    "limit": "10",
    		    "map_dir": "",
    		    "max_key": "",
    		    "min_key": "",
    		    "order": {},
    		    "page": page,
    		    "screen": screen,
    		    "search":{
    				"cus_num":formData.ctale_cus_num,
    				"title":formData.ctale_title,
    				"hpn_date":formData.ctale_hpn_date,
    				"mulpage_ind":mulpage_ind,
    				"st_title":st_title,
    				"st_hpdate":st_hpdate
    		    },
            };
        	console.log(param);
        	$http({
		        method:'POST',
		        url:RM_URL.RM_CUSTALE_EQY,//访问clb-consumer请求数据
		        data:{'megid':'test',
		        	  'user':'test',
		        	  'param':param,
		        	  'correlid':'test'}
		    }).then(function successCallback(response){
		    	if(response.status=="200"){
		    		if(response.data.code=='0000'){
		    			console.log(response);
				    	console.log(response.data);
				    	$scope.CustomerEvents=response.data.data.list;
				    	mulpage_ind=response.data.data.mulpage_ind;
            			st_title=response.data.data.st_title;
            			st_hpdate=response.data.data.st_hpdate;
		    		}else{
		    			$scope.isTableHidden=true;//查不到数据时表格隐藏
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
        	
    	}else{
    		$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_QUERY_FAIL'),
                    $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE4')
                );
            }, 0);
    	}
    }
    
});




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
