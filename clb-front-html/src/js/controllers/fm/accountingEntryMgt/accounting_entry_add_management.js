'use strict';

app.controller('AddAcctEntryModalCtrl',function ($scope,$modal) {
    $scope.showAddAcctEntryModal = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addAcctEntryModal.html',
            controller: 'AcctEntryAddModalControl',
            size: 'lg'
        });
    }
})


app.controller('AcctEntryAddModalControl',function ($scope,$modalInstance,$http,$timeout) {
	$scope.fields={
			dc_flag:undefined
	}
	var SELECT_DC_FLAG="db8e76f9fb9a46a8923a95442394e0ec";
	$scope.selectedDcFlag={};
	$scope.dcFlagSelectOnChange=function(){
		$scope.fields.dc_flag=$scope.selectedDcFlag.item.key;
	}
	 angular.element(function(){
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
	 })
	
   /* $scope.dcFlags = [
        {'value':'D','name':'借'},
        {'value':'C','name':'贷'}
    ];*/

    //取消按钮单击事件
    $scope.cancelAcctEntry = function () {
        $modalInstance.dismiss('cancel');
    }

    //主键的blur事件，用于检测注册的主键是否存在
    $scope.ifExisted1 = function () {
        //获取输入的tran_id
        var tableParam = getFormData(angular.element('#formAddAcctEntry'));
        console.log(tableParam);
        $http({
            method:'POST',
            url:FM_URL.FM_ACCTENTRY_INQ,
            data:{'megid': 'test',
                "user": 'test',
                "param": tableParam,
                "correlid":'test'},
        }).then(function successCallback(response) {
            if(response.status == 200){//与后台交互成功
                var result = response.data.data;
                console.log(response);
                if(result != null){//输入的主键已经存在
                    $scope.alerts = [];
                    existedAlert();

                }else {
                    $scope.alerts = [];
                }

            }else {//与后台交互失败
                $scope.alerts = [];
                errorConnect();
            }
        })

    }

    //点击添加按钮的单击事件
    $scope.addAcctEntry = function () {
        var param = getFormData(angular.element('#formAddAcctEntry'));
        param.dc_flag=$scope.fields.dc_flag;
        // console.log(param);
        $http({
            method:'POST',
            url:FM_URL.FM_ACCTENTRY_ADD,
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'},
        }).then(function successCallback(response) {
            if(response.status == 200){//与后台交互成功
                var result = response.data.data;
                console.log(response);
                if(response.data.code === '0000'){//添加服务成功
                    $scope.isFormDisabled = true;//表格锁定，无法再次输入
                    $scope.alerts = [];
                    addSuccessAlert();

                    $timeout(function () {//3秒后modal框消失
                        $modalInstance.dismiss('cancel');
                    }, 3000);

                    //会计分录表格重新加载
                    angular.element('#tblAcctEntries').DataTable().ajax.reload(null, false);

                }else{//添加服务调用失败
                    $scope.isFormDisabled = false;
                    $scope.alerts = [];
                    addFailAlert();//添加失败提示
                }

            }else {//与后台交互失败
                $scope.alerts = [];
                errorConnect();
            }
        })
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