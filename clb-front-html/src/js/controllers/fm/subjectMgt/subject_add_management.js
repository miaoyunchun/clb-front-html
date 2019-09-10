'use strict';
//打开添加科目的modal框
app.controller('AddSubjectModalCtrl',function ($scope,$modal) {
    $scope.showAddSubjectModal = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addSubjectModal.html',
            controller: 'SubjectAddModalControl',
            size: 'lg'
        });
    }
})

app.controller('SubjectAddModalControl',function ($scope,$modalInstance,$interval,$filter,$http,$timeout,dateTimeUtils,toaster) {
	
	
	
	$scope.fields={
			item_key:		undefined,
			item_level:		undefined,
			item_name:		undefined,
			op_time_stamp:	$filter('date')(new Date(),'yyyy-MM-dd'),
			bal_dire_flg:	undefined,
			gl_account:		undefined,
			cal_gl_account:	undefined,
			class_item:		undefined,
			fx_item_flag:	undefined,
			in_out_flag:	undefined,
			buss_type:		undefined,
			tran_amt_dir:	undefined,
			item_start_date:undefined,
			item_end_date:	undefined
			
	}
	
	
	
	var SELECT_PARAM_ITEM_LEVEL="85b76a12776c4bcf9c6365aaa8d8631b";
	var SELECT_BAL_DIRE_FALG="4206b27ecb0746c2b92f4438bde451fd";
	var SELECT_GL_ACCOUNT="1124d5aeb3824550980290ffb94646cb";
	var SELECT_CAL_GL_ACCOUNT="3496f37f132a4ac3a38b3d2ca3d13536";
	var SELECT_CLASS_ITEM="d22d279698594a688cef1dd40eeb6fb0";
	var SELECT_FX_ITEM_FALG="f739438f5d18453697c3e1ac15238116";
	var SELECT_IN_OUT_FLAG="bbac57ce395e42c099b6c8a347b943b1";
	var SELECT_BUSS_TYPE="9b6ce29955e24cd992b85aa178550e9c";
	var SELECT_TRAN_AMT_DIR="e338a9a0e6464d9abeefbdb2ac3b9c94";
	
	
	
	
	 $scope.selectedParamItemLevel={};
	 $scope.selectedBalDireFlags={};
	 $scope.selectedGlAccounts={};
	 $scope.selectedCalGlAccounts={};
	 $scope.selectedClassItems={};
	 $scope.selectedFxItemFlags={};
	 $scope.selectedInOutFlags={};
	 $scope.selectedBussTypes={};
	 $scope.selectedTranAmtDirs={};
	 
	 //科目级别
	$scope.paramItemLevelSelectOnChange= function() {
        $scope.fields.item_level = $scope.selectedParamItemLevel.item.key;
    };
    //余额方向
	$scope.balDireFlagsSelectOnChange= function() {
        $scope.fields.bal_dire_flg = $scope.selectedBalDireFlags.item.key;
    };
    //总账账户
    $scope.glAccountssSelectOnChange= function() {
        $scope.fields.gl_account = $scope.selectedGlAccounts.item.key;
    };
    //总账计算
    $scope.calGlAccountsSelectOnChange= function() {
        $scope.fields.cal_gl_account = $scope.selectedCalGlAccounts.item.key;
    };
    //最明细科目
    $scope.classItemsSelectOnChange= function() {
        $scope.fields.class_item = $scope.selectedClassItems.item.key;
    };
    //外汇买卖科目标志
    $scope.fxItemFlagsSelectOnChange= function() {
        $scope.fields.fx_item_flag = $scope.selectedFxItemFlags.item.key;
    };
    //表内外科目标识
    $scope.inOutFlagsSelectOnChange= function() {
        $scope.fields.in_out_flag = $scope.selectedInOutFlags.item.key;
    };
    //业务类别
    $scope.bussTypessSelectOnChange= function() {
        $scope.fields.buss_type = $scope.selectedBussTypes.item.key;
    };
  //发生额方向
    $scope.tranAmtDirssSelectOnChange= function() {
        $scope.fields.tran_amt_dir = $scope.selectedTranAmtDirs.item.key;
    };
	
    
    angular.element(function () {
    	//科目级别
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_PARAM_ITEM_LEVEL
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.paramItemLevel = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
 
    //余额方向
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_BAL_DIRE_FALG
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.balDireFlags = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });

    //总账账户
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_GL_ACCOUNT
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.glAccounts = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
    //参与总账计算
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_CAL_GL_ACCOUNT
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.calGlAccounts = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
    //明细科目标志
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_CLASS_ITEM
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.classItems = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
    //外汇买卖科目标志
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_FX_ITEM_FALG
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.fxItemFlags = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
    //表内外科目标志
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_IN_OUT_FLAG
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.inOutFlags = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
    //业务类别（科目性质）
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_BUSS_TYPE
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.bussTypes = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
    //发生额方向
		 $http({
	            method: 'POST',
	            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
	            params: {
	                optId: SELECT_TRAN_AMT_DIR
	            }
	        }).then(function (response) {
	            var responseData = response.data;

	            if (responseData.flag === 'success') {
	                $scope.tranAmtDirs = responseData.optValueList;
	            }
	        }, function () {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
	        });
    
    });
    //针对下拉框出现的问题的解决方法
    var fixChosenItemIntervalTask = $interval(function () {
        if (angular.element('#item_level').chosen !== undefined
            && angular.element('#bal_dire_flg').chosen !== undefined
            && angular.element('#gl_account').chosen !== undefined
            && angular.element('#cal_gl_account').chosen !== undefined
            && angular.element('#class_item').chosen !== undefined
            && angular.element('#fx_item_flag').chosen !== undefined
            && angular.element('#in_out_flag').chosen !== undefined
            && angular.element('#buss_type').chosen !== undefined
            && angular.element('#tran_amt_dir').chosen !== undefined) {

            angular.element('#item_level').chosen({allow_single_deselect: true});
            angular.element('#bal_dire_flg').chosen({allow_single_deselect: true});
            angular.element('#gl_account').chosen({allow_single_deselect: true});
            angular.element('#cal_gl_account').chosen({allow_single_deselect: true});
            angular.element('#class_item').chosen({allow_single_deselect: true});
            angular.element('#fx_item_flag').chosen({allow_single_deselect: true});
            angular.element('#in_out_flag').chosen({allow_single_deselect: true});
            angular.element('#buss_type').chosen({allow_single_deselect: true});
            angular.element('#tran_amt_dir').chosen({allow_single_deselect: true});

            $interval.cancel(fixChosenItemIntervalTask);
        }
    });
    //操作时间默认为系统当前日期
    var now = new Date();
    $scope.op_time_stamp = $filter('date')(now,'yyyy-MM-dd');

    //取消按钮事件
    $scope.cancelSub = function () {
        $modalInstance.dismiss('cancel');
    }

    //判断是否重复添加，在输入主键后设置一个blur事件
    $scope.ifExisted = function () {
        var tableParam = getFormData(angular.element('#formAddSubject'));
        console.log(tableParam);
        $http({
            method:'POST',
            url:FM_URL.FM_SUBJECT_INQ,
            data:{'megid': 'test',
                "user": 'test',
                "param": tableParam,
                "correlid":'test'}
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
            type:'danger',
            msg:'网络错误'
        });
    }
    //添加按钮的单击事件
    $scope.addSubject = function () {
        /*var param = getFormData(angular.element('#formAddSubject'));
        console.log(param);*/
    	$scope.fields.item_start_date=dateTimeUtils.getYyyyMmDd(new Date($scope.fields.item_start_date));
    	$scope.fields.item_end_date=dateTimeUtils.getYyyyMmDd(new Date($scope.fields.item_end_date));
        $http({
            method:'POST',
            url:FM_URL.FM_SUBJECT_ADD,
            data:{'megid': 'test',
                "user": 'test',
                "param": $scope.fields,
                "correlid":'test'}
        }).then(function successCallback(response) {
            if(response.status == 200){//与后台交互成功
                console.log(response);
                if(response.data.code === '0000'){//添加服务成功
                    $scope.alerts = [];
                    addSuccessAlert();

                    $scope.isFormDisabled = true;

                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 5000);
                    angular.element('#tblSubjects').DataTable().ajax.reload(null, false);
                }else{//添加失败
                    $scope.isFormDisabled = false;
                    $scope.alerts = [];
                    //插入失败
                    addFailAlert();
                }

            }else {//与后台交互失败
                $scope.alerts = [];
                errorConnect();
            }
        })
    }



})



//日期插件
app.controller('DateCtrl',function ($scope) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
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