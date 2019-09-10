'use strict';
//打开科目详情的modal框
app.controller('SubjectDetailModalCtrl',function ($scope,$modal,$timeout,fmShareDataService,$filter,toaster) {

    $scope.showSubjectDetailModal = function () {

        var subTable = $('#tblSubjects').DataTable();

        if (subTable.row('.active').length === 1) {

            //save the row which is selected
            fmShareDataService.setSubjectFilter(subTable.row('.active').data());

            $modal.open({
                 backdrop: 'static',
                 templateUrl: 'subjectDetailModal.html',
                 controller: 'SubjectDetailModalControl',
                 size: 'lg'
             });
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

app.controller('SubjectDetailModalControl',function ($scope,$interval,$modalInstance,$http,fmShareDataService,$filter,toaster) {
    //科目级别
    $scope.itemLevels2 = [
        {'value':'1','name':'一级'},
        {'value':'2','name':'二级'},
        {'value':'3','name':'三级'}
    ];
    //余额方向
    $scope.balDireFlags = [
        {'value':'0','name':'借方'},
        {'value':'1','name':'贷方'},
        {'value':'2','name':'可借可贷'}
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
            $scope.item_key = subjectInfo.item_key;
            angular.element('#item_level').val(subjectInfo.item_level).trigger('chosen:updated');
            $scope.item_name = subjectInfo.item_name;
            $scope.op_time_stamp = subjectInfo.op_time_stamp;

            angular.element('#bal_dire_flg').val(subjectInfo.bal_dire_flg).trigger('chosen:updated');
            angular.element('#gl_account').val(subjectInfo.gl_account).trigger('chosen:updated');
            angular.element('#cal_gl_account').val(subjectInfo.cal_gl_account).trigger('chosen:updated');
            angular.element('#class_item').val(subjectInfo.class_item).trigger('chosen:updated');
            angular.element('#fx_item_flag').val(subjectInfo.fx_item_flag).trigger('chosen:updated');
            angular.element('#in_out_flag').val(subjectInfo.in_out_flag).trigger('chosen:updated');
            angular.element('#buss_type').val(subjectInfo.buss_type).trigger('chosen:updated');
            angular.element('#tran_amt_dir').val(subjectInfo.tran_amt_dir).trigger('chosen:updated');

            $scope.item_start_date = subjectInfo.item_start_date;
            $scope.item_end_date = subjectInfo.item_end_date;

            // angular.element('#product_ccy').val(productInfo.product_ccy).trigger('chosen:updated');


        }
    });
})