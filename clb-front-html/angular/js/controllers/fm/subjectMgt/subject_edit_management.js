'use strict';
//打开更新科目的modal框
app.controller('EditSubjectModalCtrl',function ($scope,$modal,$timeout,fmShareDataService,toaster,$filter) {
    $scope.showEditSubjectModal = function () {

        var subTable = $('#tblSubjects').DataTable();

        // If a row is selected
        if (subTable.row('.active').length === 1) {

            //save the row which is selected
            fmShareDataService.setSubjectFilter(subTable.row('.active').data());

             $modal.open({
                 backdrop: 'static',
                 templateUrl: 'editSubjectModal.html',
                 controller: 'SubjectEditModalControl',
                 size: 'lg'
            })
        } else {
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

app.controller('SubjectEditModalControl',function ($scope,fmShareDataService,$interval,$modalInstance,$filter,$http,$timeout) {
	$scope.fields = {
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
	
	 $scope.selectedItemLevel={};
	 $scope.selectedBalDireFlg={};
	 $scope.selectedParamItemLevel={};
	 $scope.selectedBalDireFlags={};
	 $scope.selectedGlAccount={};
	 $scope.selectedCalGlAccounts={};
	 $scope.selectedClassItems={};
	 $scope.selectedFxItemFlags={};
	 $scope.selectedInOutFlags={};
	 $scope.selectedBussTypes={};
	 $scope.selectedTranAmtDirs={};
	 	//科目级别
		$scope.itemLevelSelectOnChange= function() {
	        $scope.fields.item_level = $scope.selectedItemLevel.item.key;
	    };
	    //余额方向
		$scope.balDireFlgSelectOnChange= function() {
	        $scope.fields.bal_dire_flg = $scope.selectedBalDireFlg.item.key;
	    };
	    //总账账户
	    $scope.glAccountSelectOnChange= function() {
	        $scope.fields.gl_account = $scope.selectedGlAccount.item.key;
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
	
    var fetchItemLevel=function(){
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
	                $scope.itemLevel = responseData.optValueList;
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
	                $scope.balDireFlg = responseData.optValueList;
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
	                $scope.glAccount = responseData.optValueList;
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
   
    }
    angular.element(function () {
    	//科目级别
    	fetchItemLevel();
    	$timeout(function () {
    		query();
        }, 600);
    });
	
	//科目级别
    $scope.itemLevels2 = [
        {'value':'1','name':'一级'},
        {'value':'2','name':'二级'},
        {'value':'3','name':'三级'}
    ];
    //余额方向
    $scope.balDireFlags = [
        {'value':'0','name':'借方'},
        {'value':'1','name':'贷方'}
    ];

    //总账账户
    $scope.glAccounts = [
        {'value':'Y','name':'总账账户'},
        {'value':'N','name':'非总账账户'}
    ];
    //参与总账计算
    $scope.calGlAccounts = [
        {'value':'Y','name':'参与总账计算'},
        {'value':'N','name':'不参与总账计算'}
    ];
    //明细科目标志
    $scope.classItems = [
        {'value':'Y','name':'最明细科目'},
        {'value':'N','name':'非最明细科目'}
    ];
    //外汇买卖科目标志
    $scope.fxItemFlags = [
        {'value':'0','name':'非外汇买卖'},
        {'value':'1','name':'结售汇'},
        {'value':'3','name':'代客套汇往来'}
    ];
    //表内外科目标志
    $scope.inOutFlags = [
        {'value':'0','name':'表内'},
        {'value':'1','name':'表外'}
    ];
    //业务类别（科目性质）
    $scope.bussTypes = [
        {'value':'001','name':'资产'},
        {'value':'002','name':'负债'}
    ];
    //发生额方向
    $scope.tranAmtDirs = [
        {'value':'0','name':'贷方'},
        {'value':'1','name':'借方'}
    ];
    //针对下拉框出现的问题的解决方法
    /*var fixChosenItemIntervalTask = $interval(function () {
        if (angular.element('#item_level').chosen !== undefined
            && angular.element('#bal_dire_flg').chosen !== undefined
            && angular.element('#gl_account').chosen !== undefined
            && angular.element('#cal_gl_account').chosen !== undefined
            && angular.element('#class_item').chosen !== undefined
            && angular.element('#fx_item_flag').chosen !== undefined
            && angular.element('#in_out_flag').chosen !== undefined
            && angular.element('#buss_type').chosen !== undefined
            && angular.element('#tran_amt_dir').chosen !== undefined) {

          //  angular.element('#item_level').chosen({allow_single_deselect: true});
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
    });*/

    //取消按钮事件
    $scope.cancelSubject = function () {
        $modalInstance.dismiss('cancel');
    }

    //开启modal框时给页面初始化
    //获得选中的行的查询条件
    var param = {
        item_key:fmShareDataService.getSubjectFilter().item_key,
        item_level:fmShareDataService.getSubjectFilter().item_level
    };
    var query=function(){
    $http({
        method: 'POST',
        url:FM_URL.FM_SUBJECT_INQ ,//直接访问clb-api
        data:{'megid': 'test',
            "user": 'test',
            "param": param,
            "correlid":'test'}
    }).then(function successCallback(response){
        if(response.status == 200){//查询成功
            var subjectInfo = response.data.data;
            console.log(subjectInfo);
            //初始化modal框
            $scope.fields.item_key = subjectInfo.item_key;
            $scope.fields.item_name = subjectInfo.item_name;
            if($scope.itemLevel==undefined||$scope.balDireFlags==undefined||$scope.glAccounts==undefined||$scope.calGlAccounts==undefined||
            		$scope.classItems==undefined||$scope.fxItemFlags==undefined||$scope.inOutFlags==undefined||$scope.bussTypes==undefined||$scope.tranAmtDirs==undefined){
            	fetchItemLevel();
            	
            }
        	for(var i=0;i<$scope.itemLevel.length;i++){
            	if($scope.itemLevel[i].key==subjectInfo.item_level){
            		$scope.selectedItemLevel.item=$scope.itemLevel[i];
            		$scope.fields.item_level=$scope.itemLevel[i].key;
            	}
            		
            }
        	for(var i=0;i<$scope.balDireFlg.length;i++){
            	if($scope.balDireFlg[i].key==subjectInfo.bal_dire_flg){
            		$scope.selectedBalDireFlg.item=$scope.balDireFlg[i];
            		$scope.fields.bal_dire_flg=$scope.balDireFlg[i].key;
            	}
            		
            }
        	for(var i=0;i<$scope.glAccount.length;i++){
            	if($scope.glAccount[i].key==subjectInfo.gl_account){
            		$scope.selectedGlAccount.item=$scope.glAccount[i];
                	$scope.fields.gl_account=$scope.glAccount[i].key;
            	}
            	
        	}
        	
        	for(var i=0;i<$scope.calGlAccounts.length;i++){
            	if($scope.calGlAccounts[i].key==subjectInfo.cal_gl_account){
            		$scope.selectedCalGlAccounts.item=$scope.calGlAccounts[i];
            		$scope.fields.cal_gl_account=$scope.calGlAccounts[i].key;
            	}
            		
            }
        	
        	for(var i=0;i<$scope.classItems.length;i++){
            	if($scope.classItems[i].key==subjectInfo.class_item){
            		$scope.selectedClassItems.item=$scope.classItems[i];
            		$scope.fields.class_item=$scope.classItems[i].key;
            	}
            		
            }
        	
        	for(var i=0;i<$scope.fxItemFlags.length;i++){
            	if($scope.fxItemFlags[i].key==subjectInfo.fx_item_flag){
            		$scope.selectedFxItemFlags.item=$scope.fxItemFlags[i];
            		$scope.fields.fx_item_flag=$scope.fxItemFlags[i].key;
            	}
            		
            }
        	for(var i=0;i<$scope.inOutFlags.length;i++){
            	if($scope.inOutFlags[i].key==subjectInfo.in_out_flag){
            		$scope.selectedInOutFlags.item=$scope.inOutFlags[i];
            		$scope.fields.in_out_flag=$scope.inOutFlags[i].key;
            	}
            		
            }
        	for(var i=0;i<$scope.bussTypes.length;i++){
            	if($scope.bussTypes[i].key==subjectInfo.buss_type){
            		$scope.selectedBussTypes.item=$scope.bussTypes[i];
            		$scope.fields.buss_type=$scope.bussTypes[i].key;
            	}
            		
            }
        	for(var i=0;i<$scope.tranAmtDirs.length;i++){
            	if($scope.tranAmtDirs[i].key==subjectInfo.tran_amt_dir){
            		$scope.selectedTranAmtDirs.item=$scope.tranAmtDirs[i];
            		$scope.fields.tran_amt_dir=$scope.tranAmtDirs[i].key;
            	}
            		
            }
        	
            var now = new Date();
          //  $scope.op_time_stamp = $filter('date')(now,'yyyy-MM-dd');

           /* angular.element('#bal_dire_flg').val(subjectInfo.bal_dire_flg).trigger('chosen:updated');
            angular.element('#gl_account').val(subjectInfo.gl_account).trigger('chosen:updated');
            angular.element('#cal_gl_account').val(subjectInfo.cal_gl_account).trigger('chosen:updated');
            angular.element('#class_item').val(subjectInfo.class_item).trigger('chosen:updated');
            angular.element('#fx_item_flag').val(subjectInfo.fx_item_flag).trigger('chosen:updated');
            angular.element('#in_out_flag').val(subjectInfo.in_out_flag).trigger('chosen:updated');
            angular.element('#buss_type').val(subjectInfo.buss_type).trigger('chosen:updated');
            angular.element('#tran_amt_dir').val(subjectInfo.tran_amt_dir).trigger('chosen:updated');*/

            $scope.fields.item_start_date = subjectInfo.item_start_date;
            $scope.fields.item_end_date = subjectInfo.item_end_date;

            // angular.element('#product_ccy').val(productInfo.product_ccy).trigger('chosen:updated');


        }
    });
    };

    //编辑按钮的单击事件
    $scope.editSubject = function () {
     //   var param = getFormData(angular.element('#formEditSubject'));

        $http({
            method: 'POST',
            url:FM_URL.FM_SUBJECT_UPD,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": $scope.fields,
                "correlid":'test'}
        }).then(function successCallback(response){
            if(response.status == 200){//查询成功
                console.log(response.data);
                if(response.data.code === '0000'){
                    $scope.isFormDisabled = true;
                    $scope.alerts = [];
                    addSuccessAlert();
                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 5000);
                    angular.element('#tblSubjects').DataTable().ajax.reload(null, false);
                }else {
                    $scope.isFormDisabled = false;

                    $scope.alerts = [];
                    addFailAlert();

                }

            }else {
                $scope.alerts = [];
                addFailAlert();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
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