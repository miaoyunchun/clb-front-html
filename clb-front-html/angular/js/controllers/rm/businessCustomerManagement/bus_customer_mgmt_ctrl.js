'use strict';
var BusCustomers = null;
var param = null;
var st_cust = null;
var end_ind = null;
var perCustForm = null;
var page = null;
var screen = null;
var bcust_name=null;
var all_count=null;
app.controller('BusinessCustomerPageCtrl',function ($scope,$http,$timeout,$filter,toaster) {
	$scope.isTableHidden=true;//先把表格和下一页隐藏
	
    $scope.queryBusCustomer = function(){
    	BusCustomers = getFormData(angular.element('#bcust_name'));//对公客户姓名
    	bcust_name=trim(BusCustomers.bcust_name);
    	console.log(bcust_name);
        if(bcust_name){//去空格后判断是否为空
            page=0;
            screen=0;
            param={
        		"count": "",
    		    "limit": "05",
    		    "map_dir": "F",
    		    "max_key": "",
    		    "min_key": "",
    		    "order": {},
    		    "page": page,
    		    "screen": screen,
    		    "search": {
    		      "mulpage_ind": "",
    		      "name": bcust_name,
    		      "st_cust": ""
    		    }
        	};
            console.log(param);
            $http({
        		method:'POST',
        		url:RM_URL.RM_BUSCUST_NAQ,//访问clb-consumer请求数据
        		data:{'megid':'test',
        			'user':'test',
        			'param':param,
        			'correlid':'test'}
        	}).then(function successCallback(response){//请求成功时执行代码
        		
        		console.log('111');
        		console.log(response);
        		console.log(response.data);
        		console.log(response.data.data);
        		if(response.status=200){//查询成功
        			if(response.data.code=="0000"){
        				$scope.isTableHidden=false;//查询到数据时表格显示
        				$scope.BusCustomers=response.data.data.list;
            			st_cust=response.data.data.nxt_cust;
            			end_ind=response.data.data.end_ind;
            			all_count=response.data.data.all_count;
        			}else{
        				$scope.isTableHidden=true;//查不到数据时表格隐藏
                        $timeout(function () {
                            toaster.pop(
                                'error',
                                $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_QUERY_FAIL'),
                                $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE')
                            );
                        }, 0);
        			}
        		}else{
        			$timeout(function () {
                        toaster.pop(
                            'error',
                            $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                            $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                        );
                    }, 0);
        		}
        	},function errorCallback(response){//请求失败时执行代码
        		$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                        $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                    );
                }, 0);
        	});
        }else{//表单为空时提示
        	$scope.isTableHidden=true;//查不到数据时表格隐藏
        	$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_QUERY_FAIL'),
                    $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE3')
                );
            }, 0);
        }
    }  
    $scope.busCustomerNextPopup=function(){
    	console.log(page);
    	console.log((page+1)<Math.ceil(all_count/5));
    	if((page+1)<Math.ceil(all_count/5)){//end_ind=="N 后台返回结果可能有问题，end_ind结果只有N，所以在这里自己计算页数
    		page=page+1;
            screen=screen+1;
        	param={
        		"count": "",
    		    "limit": "05",
    		    "map_dir": "F",
    		    "max_key": "",
    		    "min_key": "",
    		    "order": {},
    		    "page": page,
    		    "screen": screen,
    		    "search": {
    		      "mulpage_ind": end_ind,
    		      "name": bcust_name,
    		      "st_cust": st_cust
    		    }
            };
        	 $http({
         		method:'POST',
         		url:RM_URL.RM_BUSCUST_NAQ,//访问clb-consumer请求数据
         		data:{'megid':'test',
         			'user':'test',
         			'param':param,
         			'correlid':'test'}
         	}).then(function successCallback(response){
         		if(response.status=200){//查询成功
         			console.log(response.data);
        			if(response.data.data.all_count!="0"){
        				$scope.isTableHidden=false;//查询到数据时表格显示
        				$scope.BusCustomers=response.data.data.list;
            			st_cust=response.data.data.nxt_cust;
            			end_ind=response.data.data.end_ind;
            			console.log('end_ind');
            			console.log(end_ind);
        			}else{
        				$scope.isTableHidden=true;//查不到数据时表格隐藏
                        $timeout(function () {
                            toaster.pop(
                                'error',
                                $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_QUERY_FAIL'),
                                $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE')
                            );
                        }, 0);
            			page=page-1;
            	        screen=screen-1;
        			}
         		}else{
         			$timeout(function () {
                        toaster.pop(
                            'error',
                            $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                            $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                        );
                    }, 0);
         		}
         	},function errorCallback(response){//请求失败时执行代码
        		$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                        $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                    );
                }, 0);
        	});
    	}else{
            $timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_QUERY_FAIL'),
                    $filter('translate')('pages.rm.BCUST.BCUST_MGMT_TOAST_TEXTS.BCUST_MGMT_TOAST_TEXT_FAIL_CAUSE4')
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

function trim(str){ //删除左右两端的空格 
	 return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
} 
