'use strict';

app.controller('EditAcctEntryModalCtrl',function ($scope,$modal,$timeout,$filter,fmShareDataService,toaster) {
    $scope.showEditAcctEntryModal = function () {
        var acctTable = $('#tblAcctEntries').DataTable();

        if (acctTable.row('.active').length === 1) {

            //save the row which is selected
            fmShareDataService.setAcctEntryFilter(acctTable.row('.active').data());

            $modal.open({
                backdrop: 'static',
                templateUrl: 'editAcctEntryModal.html',
                controller: 'AcctEntryEditModalControl',
                size: 'lg'
            })
        }else {
            $timeout(function () {
                toaster.pop(
                    'error',
                    $filter('translate')('pages.common.COMMON_TOAST_TITLES.COMMON_TOAST_TITLE_ERROR'),
                    $filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW')
                );
            }, 0);
        }

    }
})


app.controller('AcctEntryEditModalControl',function ($scope,fmShareDataService,$modalInstance,$http,$timeout) {
	$scope.fields={
			dc_flag:undefined
	}
	var SELECT_DC_FLAG="db8e76f9fb9a46a8923a95442394e0ec";
	$scope.selectedDcFlag={};
	$scope.dcFlagSelectOnChange=function(){
		$scope.fields.dc_flag=$scope.selectedDcFlag.item.key;
	}
	var fetchDcFlag=function(){
		//借贷标志
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_DC_FLAG
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.dcFlag = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
	}
	 angular.element(function(){
		 fetchDcFlag();
		 $timeout(function () {
			 queryAccountDetail();
	        }, 300);
		 
	 })
    /*$scope.dcFlags = [
        {'value':'D','name':'借'},
        {'value':'C','name':'贷'}
    ];*/
    //取消按钮的单击事件
    $scope.cancelAcctEntry = function () {
        $modalInstance.dismiss('cancel');
    };
    var queryAccountDetail=function(){
		    var param1 = fmShareDataService.getAcctEntryFilter();
		    console.log(param1.acct_item);
		    var param = {
		        'acct_item':param1.acct_item,
		    }
		    $http({
		        method: 'POST',
		        url: FM_URL.FM_ACCTENTRYDETAIL_INQ,//直接访问clb-api
		        data:{'megid': 'test',
		            "user": 'test',
		            "param": param,
		            "correlid":'test'}
		    }).then(function successCallback(response){
		        if(response.status == 200){//查询成功
		            console.log(response);
		            var result = response.data.data;
		           
		           // 页面初始化
		            $scope.tran_id = result.tran_id;
		            $scope.acct_item = result.acct_item;
		            $scope.cond_seq = result.cond_seq;
		        //    angular.element('#dc_flag').val(result.dc_flag).trigger('chosen:updated');
		            //如果下拉框为初始化，先初始化下拉框
		            if($scope.dcFlag==undefined){
		            	fetchDcFlag();
		            };
		            for(var i=0;i<$scope.dcFlag.length;i++){
		            	if($scope.dcFlag[i].key==result.dc_flag){
		            		$scope.selectedDcFlag.item=$scope.dcFlag[i];
		            		$scope.fields.dc_flag=$scope.dcFlag[i].key;
		            	}
		            };
		            $scope.acct_org = result.acct_org;
		            $scope.tran_amt_point = result.tran_amt_point;
		            $scope.item_seq = result.item_seq;
		            $scope.tran_desp = result.tran_desp;
		        }
		    });
    }
    //提交按钮的单击事件
    $scope.editAcctEntry = function () {
        var tableData = getFormData(angular.element('#formEditAcctEntry'));
        tableData.dc_flag=$scope.fields.dc_flag;
        console.log(tableData);
        $http({
            method: 'POST',
            url: FM_URL.FM_ACCTENTRY_UPD,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": tableData,
                "correlid":'test'}
        }).then(function successCallback(response){
            if(response.status == 200){//查询成功
                console.log(response);
                var result = response.data;
                console.log(result);
                if(result.code === '0000'){//修改服务使用成功
                    $scope.isFormDisabled = true;//表格锁定，无法再次输入
                    $scope.alerts = [];
                    addSuccessAlert();

                    $timeout(function () {//3秒后modal框消失
                        $modalInstance.dismiss('cancel');
                    }, 3000);

                    //会计分录表格重新加载
                    angular.element('#tblAcctEntries').DataTable().ajax.reload(null, false);
                }else{//修改失败
                    $scope.isFormDisabled = false;
                    $scope.alerts = [];
                    addFailAlert();
                }
            }
        });

    }


    $scope.alerts = [];
// Alert when operation is successful
    var addSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg: '操作成功'
        });
    };

// Alert when operation failed
    var addFailAlert = function (message) {
        $scope.alerts.push({
            type: 'danger',
            msg: '操作失败'
        });
    };

    //添加的科目已存在时
    var existedAlert = function (message) {
        $scope.alerts.push({
            type:'danger',
            msg:'该科目编号已存在'
        });
    }
    //因网络原因操作失败
    var errorConnect = function (message) {
        $scope.alerts.push({
            type: 'danger',
            msg: '网络错误'
        });

    }
})

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