'use strict';
var formData=undefined;
var param=undefined;
var page=undefined;
var limit=undefined;
var MaintenanceHistory=undefined;
var mulpage_ind=undefined;
var st_time=undefined;
app.controller('MaintenanceHistoryPageCtrl',function ($scope,$http,$timeout,$filter,toaster) {
		$scope.isTableHidden=true;//先把表格隐藏
		$scope.queryMaintHistory = function(){
        formData = getFormData(angular.element('#his_cust_num'));//获取客户号
        console.log(formData.his_cust_num);
        if(formData.his_cust_num.length=='19'){
        	page=1;
        	screen=1;
        	param={
        		"count": "",
    		    "limit": "05",
    		    "max_key": "",
    		    "min_key": "",
    		    "order": {},
    		    "page": page,
    		    "screen": screen,
    		    "search":{
    				"mulpage_ind":mulpage_ind,
    				"number":formData.his_cust_num,
    				"st_time":st_time
    		    },
            };
        	console.log(param);
        	$http({
		        method:'POST',
		        url:RM_URL.RM_CUSHIST_HIS,//访问clb-consumer请求数据
		        data:{'megid':'test',
		        	  'user':'test',
		        	  'param':param,
		        	  'correlid':'test'}
		    }).then(function successCallback(response){
		    	console.log(response);
		    	console.log(response.data);
		    	if(response.status=="200"){
		    		if(response.data.code=="0000"){
		    			$scope.isTableHidden=false;//查到数据时表格显示
		    			$scope.MaintenanceHistory=response.data.data.list;
		    			mulpage_ind=response.data.data.mulpage_ind;
		    			st_time=response.data.data.nxt_time;
			    	}else{
			    		$scope.isTableHidden=true;//查不到数据时表格隐藏
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
        		$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                    );
                }, 0);
        	});
        	
        	
        }else{
        	$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_QUERY_FAIL'),
                    $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE6')
                );
            }, 0);
        }
    }
	$scope.maintHistoryNextPopup=function(){
		console.log(mulpage_ind);
		if(mulpage_ind=="Y"){
			page=page+1;
        	screen=screen+1;
        	param={
        		"count": "",
    		    "limit": "05",
    		    "max_key": "",
    		    "min_key": "",
    		    "order": {},
    		    "page": page,
    		    "screen": screen,
    		    "search":{
    				"mulpage_ind":mulpage_ind,
    				"number":formData.his_cust_num,
    				"st_time":st_time
    		    },
            };
        	$http({
		        method:'POST',
		        url:RM_URL.RM_CUSHIST_HIS,//访问clb-consumer请求数据
		        data:{'megid':'test',
		        	  'user':'test',
		        	  'param':param,
		        	  'correlid':'test'}
		    }).then(function successCallback(response){
		    	console.log(response.data);
		    	console.log(response);
		    	if(response.status=="200"){
		    		if(response.data.code=='0000'){
		    			$scope.isTableHidden=false;//查到数据时表格显示
		    			$scope.MaintenanceHistory=response.data.data.list;
		    			mulpage_ind=response.data.data.mulpage_ind;
		    			st_time=response.data.data.nxt_time;
		    		}else{
		    			$scope.isTableHidden=true;//查不到数据时表格隐藏
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
        		$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                        $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                    );
                }, 0);
        	});
		}else{
			$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_QUERY_FAIL'),
                    $filter('translate')('pages.rm.CRDMN.CRDMN_MGMT_TOAST_TEXTS.CRDMN_MGMT_TOAST_TEXT_FAIL_CAUSE4')
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
