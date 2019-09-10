'use strict';
var PerCustomers = null;
var param = null;
var st_cust = null;
var end_ind = null;
var perCustForm = null;
var page = null;
var screen = null;
var i=null;
var cust_name=null;
app.controller('PerCustomerPageCtrl',function ($scope,$http,$timeout,$filter,toaster) {
	$scope.isTableHidden=true;//先把表格隐藏
	$scope.perCustomerNextBtn=true;//把下一页按钮隐藏
    $scope.queryPerCustomer = function(){
        perCustForm = getFormData(angular.element('#cust_name'));//获取客户姓名
        cust_name=trim(perCustForm.cust_name);
        console.log(cust_name);
        if(cust_name){//去空格后判断是否为空，不为空时执行查询
        	i=0;
            page=i+1;
            screen=i+1;
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
    		      "mulpage_ind": "N",
    		      "name": cust_name,
    		      "st_cust": ""
    		    }
        	};
            $http({
        		method:'POST',
        		url:RM_URL.RM_PUSCUST_NAQ,//访问clb-consumer请求数据
        		data:{'megid':'test',
        			'user':'test',
        			'param':param,
        			'correlid':'test'}
        	}).then(function successCallback(response){//请求成功时执行代码
        		console.log("1111");
        		console.log(response);
        		console.log(response.data);
        		console.log(response.data.data);
        		
        		if(response.status=200){//查询成功
        			if(response.data.code=="0000"){
        				$scope.isTableHidden=false;//查询到数据时表格显示
        				$scope.perCustomerNextBtn=false;//查询到数据时下一页按钮显示
        				$scope.PerCustomers=response.data.data.list;
            			st_cust=response.data.data.nxt_cust;
            			end_ind=response.data.data.end_ind;
        			}else{
        				$scope.isTableHidden=true;//查不到数据时表格隐藏
        				$scope.perCustomerNextBtn=true;//查不到数据时下一页隐藏
                        $timeout(function () {
                            toaster.pop(
                                'error',
                                $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_QUERY_FAIL'),
                                $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE')
                            );
                        }, 0);
        			}
        		}else{
        			$scope.isTableHidden=true;//查不到数据时表格隐藏
    				$scope.perCustomerNextBtn=true;//查不到数据时下一页隐藏
        			$timeout(function () {
                        toaster.pop(
                            'error',
                            $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                            $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                        );
                    }, 0);
        		}
        	},function errorCallback(response){//请求失败时执行代码
        		$scope.isTableHidden=true;//查不到数据时表格隐藏
				$scope.perCustomerNextBtn=true;//查不到数据时下一页隐藏
        		$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_QUERY_FAIL2'),
                        $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE2')
                    );
                }, 0);
        	});
        }else{//表单为空时提示
        	$scope.isTableHidden=true;//查不到数据时表格隐藏
        	$timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_QUERY_FAIL'),
                    $filter('translate')('pages.rm.PCUST.PCUST_MGMT_TOAST_TEXTS.PCUST_MGMT_TOAST_TEXT_FAIL_CAUSE3')
                );
            }, 0);
        }
        
    }
    $scope.perCustomerNextPopup=function(){
    	if(end_ind=="N"){
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
    		      "name": cust_name,
    		      "st_cust": st_cust
    		    }
            };
        	 $http({
         		method:'POST',
         		url:RM_URL.RM_PUSCUST_NAQ,//访问clb-consumer请求数据
         		data:{'megid':'test',
         			'user':'test',
         			'param':param,
         			'correlid':'test'}
         	}).then(function successCallback(response){
         		if(response.status=200){//查询成功
         			console.log(response.data);
        			if(response.data.code=="0000"){
        				$scope.isTableHidden=false;//查询到数据时表格显示
        				$scope.perCustomerNextBtn=false;//查询到数据时下一页按钮显示
        				$scope.PerCustomers=response.data.data.list;
            			st_cust=response.data.data.nxt_cust;
            			end_ind=response.data.data.end_ind;
        			}else{
        				$scope.isTableHidden=true;//查不到数据时表格隐藏
        				$scope.perCustomerNextBtn=true;//查不到数据时下一页隐藏
                        $timeout(function () {
                            toaster.pop(
                                'error',
                                $filter('translate')('pages.cp.TOASTER_ERROR_MESSAGE.MESSAGE_HEAD'),
                                "No related customer found"
                            );
                        }, 0);
            			page=page-1;
            	        screen=screen-1;
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

function trim(str){ //删除左右两端的空格 
	 return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
} 
