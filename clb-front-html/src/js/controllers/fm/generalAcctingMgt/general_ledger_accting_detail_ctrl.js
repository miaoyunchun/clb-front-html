'use strict';

app.controller('GeneralAcctingDetailModalCtrl',function ($scope,$modal,$timeout,$filter,toaster,fmShareDataService) {
    $scope.showGeneralAcctingDetailModal = function () {
        var acctTable = $('#tblGeneralAccting').DataTable();

        if (acctTable.row('.active').length === 1) {

            //save the row which is selected
            fmShareDataService.setGeneralAcct(acctTable.row('.active').data());

        $modal.open({
            backdrop: 'static',
            templateUrl: 'generalAcctingDetailModal.html',
            controller: 'GeneralAcctingDetailModalControl',
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

app.controller('GeneralAcctingDetailModalControl',function ($scope,$modalInstance,$timeout,$filter,$http,fmShareDataService) {
    $scope.balDireFlgs1 = [
        {'value':'0','name':'借方'},
        {'value':'1','name':'贷方'}
    ]

    $scope.crntPrdCDs1 = [
        {'value':'D','name':'借'},
        {'value':'C','name':'贷'}
    ]

    $scope.frezzStaus1 = [
        {'value':'0','name':'正常'},
        {'value':'1','name':'全额冻结'},
        {'value':'2','name':'部分冻结'}
    ]

    $scope.acctstatus1 = [
        {'value':'0','name':'正常'},
        {'value':'1','name':'清户'},
        {'value':'2','name':'模板'}
    ]

    $scope.intcFlgs1 = [
        {'value':'0','name':'不计息'},
        {'value':'1','name':'分段计息'},
        {'value':'2','name':'不分段计息'},
        {'value':'3','name':'协定户计息'},
        {'value':'4','name':'挂牌利率计息'}
    ]
    $scope.intcCycles1 = [
        {'value':'1','name':'按月'},
        {'value':'2','name':'按季'},
        {'value':'3','name':'按半年'},
        {'value':'4','name':'按年'}
    ]

    $scope.glPeroidUnits1 = [
        {'value':'M','name':'月'},
        {'value':'D','name':'天'},
        {'value':'Y','name':'年'},
        {'value':'W','name':'周'},
        {'value':'N','name':'不定期'},
    ]

    $scope.glInstnInpLmt1 = [
        {'value':'1','name':'有权'},
        {'value':'0','name':'无权'}
    ]

    $scope.glInstnRcrdLmt1 = [
        {'value':'1','name':'有权'},
        {'value':'0','name':'无权'}
    ]

    $scope.glInstnClsaccLmt1 =[
        {'value':'1','name':'有权'},
        {'value':'0','name':'无权'}
    ]

    $scope.glAcctLmtRsv1 = [
        {'value':'Y','name':'是'},
        {'value':'N','name':'否'}
    ]

    $scope.acctPageFmt = [
        {'value':'1','name':'内部明细帐'},
        {'value':'2','name':'固定资产'},
        {'value':'3','name':'外汇买卖'},
        {'value':'4','name':'外汇结售'},
        {'value':'5','name':'销帐'},
        {'value':'6','name':'表外计息'},
        {'value':'7','name':'表外不计息'}
    ]

    $scope.acctModes = [
        {'value':'1','name':'逐笔'},
        {'value':'2','name':'汇总'},
        {'value':'3','name':'两者都有'}
    ]

    $scope.glFinbusn = [
        {'value':'1','name':'人民币业务'},
        {'value':'2','name':'外汇业务'},
        {'value':'3','name':'政策性业务'}
    ]

    $scope.openModes = [
        {'value':'1','name':'批开户所有营业机构网点'},
        {'value':'2','name':'批开户所有考核网点'},
        {'value':'3','name':'逐户开户'}
    ]

    $scope.intrRcrdFlgs = [
        {'value':'0','name':'结息不入账'},
        {'value':'1','name':'结息自动入账'}
    ]

    $scope.glAccgetTaxFlgs = [
        {'value':'0','name':'不计税'},
        {'value':'1','name':'按余额计税'},
        {'value':'2','name':'按余额扣减计税'}
    ]
    $scope.glAccgetFeeFlgs = [
        {'value':'0','name':'不计提'},
        {'value':'1','name':'计提'}
    ]

    $scope.glAccgetInvestBndFlgs = [
        {'value':'0','name':'不计提'},
        {'value':'1','name':'计提'}
    ]
    $scope.glAccgetLgtmInvst = [
        {'value':'0','name':'不计提'},
        {'value':'1','name':'计提'}
    ]

    $scope.dlayFlags = [
        {'value':'0','name':'未逾期'},
        {'value':'1','name':'逾期'}
    ]
    $scope.extnStatus = [
        {'value':'0','name':'未展期'},
        {'value':'1','name':'展期'}
    ]
    //取消按钮的单击事件
    $scope.cancelGeneralAccting = function () {
        $modalInstance.dismiss('cancel');
    }

    var key = fmShareDataService.getGeneralAcct();
    console.log(key.item_key);
    var param = {
        'item_key':key.item_key
    }
    $http({
        method: 'POST',
        url: FM_URL.FM_GENERALACCTING_INQ,//直接访问clb-api
        data:{'megid': 'test',
            "user": 'test',
            "param": param,
            "correlid":'test'}
    }).then(function successCallback(response) {
        console.log(response);
        if(response.status == 200){//与后台交互成功
            var result = response.data;
            if(result.code === '0000') {//查询成功
                //页面初始化
                fillGeneralAcct(result.data);
            }
        }else{                    //与后台交互失败
            $scope.alerts = [];
            errorConnect();
            $timeout(function () {
                $scope.alerts = [];
            },3000);
        }


    })

    function fillGeneralAcct(result) {
        $scope.item_key = result.item_key;
        $scope.buss_type = result.buss_type;
        $scope.item_name = result.item_name;
        $scope.face_bal = result.face_bal;

        $scope.afc_bal = result.afc_bal;
        angular.element('#bal_dire_flg').val(result.bal_dire_flg).trigger('chosen:updated');
        $scope.dr_gl_intr_typ = result.dr_gl_intr_typ;
        $scope.dr_gl_mass_amt_rang = result.dr_gl_mass_amt_rang;

        $scope.cr_gl_intr_typ = result.cr_gl_intr_typ;
        $scope.cr_gl_mass_amt_rang = result.cr_gl_mass_amt_rang;
        $scope.dr_flt_intr = result.dr_flt_intr;
        $scope.cr_flt_intr = result.cr_flt_intr;

        $scope.tprd_acc_bal = result.tprd_acc_bal;
        angular.element('#crnt_prd_cd').val(result.crnt_prd_cd).trigger('chosen:updated');
        $scope.acct_largst_bal = result.acct_largst_bal;
        $scope.over_draw_lagst_amt = result.over_draw_lagst_amt;

        $scope.over_draw_start_dt = result.over_draw_start_dt;
        $scope.last_acc_int_dt = result.last_acc_int_dt;
        $scope.last_tsf_accbal_dt = result.last_tsf_accbal_dt;
        $scope.last_acc_dt = result.last_acc_dt;

        $scope.opac_dt = result.opac_dt;
        $scope.close_dt = result.close_dt;
        angular.element('#frz_sts').val(result.frz_sts).trigger('chosen:updated');
        angular.element('#acct_sts').val(result.acct_sts).trigger('chosen:updated');

        angular.element('#intc_flg').val(result.intc_flg).trigger('chosen:updated');
        angular.element('#intc_cycle').val(result.intc_cycle).trigger('chosen:updated');
        $scope.pay_int_acct_no = result.pay_int_acct_no;
        $scope.cola_int_acct_no = result.cola_int_acct_no;

        $scope.gl_peroid_nums_n = result.gl_peroid_nums_n;
        angular.element('#gl_peroid_unit').val(result.gl_peroid_unit).trigger('chosen:updated');
        $scope.respon_cent = result.respon_cent;
        angular.element('#gl_instn_inq_lmt').val(result.gl_instn_inq_lmt).trigger('chosen:updated');

        angular.element('#gl_instn_rcrd_lmt').val(result.gl_instn_rcrd_lmt).trigger('chosen:updated');
        angular.element('#gl_instn_clsacc_lmt').val(result.gl_instn_clsacc_lmt).trigger('chosen:updated');
        angular.element('#gl_acct_lmt_rsv').val(result.gl_acct_lmt_rsv).trigger('chosen:updated');
        angular.element('#acct_page_fmt').val(result.acct_page_fmt).trigger('chosen:updated');

        angular.element('#acct_mode').val(result.acct_mode).trigger('chosen:updated');
        $scope.opun_inst = result.opun_inst;
        $scope.cust_no = result.cust_no;
        $scope.opun_cod = result.opun_cod;

        angular.element('#gl_finbusn').val(result.gl_finbusn).trigger('chosen:updated');
        $scope.gl_author = result.gl_author;
        $scope.amndr_no = result.amndr_no;
        $scope.second_bill_type = result.second_bill_type;

        $scope.second_last_bal = result.second_last_bal;
        $scope.second_bal = result.second_bal;
        angular.element('#open_mode').val(result.open_mode).trigger('chosen:updated');
        angular.element('#intr_rcrd_flg').val(result.intr_rcrd_flg).trigger('chosen:updated');

        angular.element('#gl_accget_tax_flg').val(result.gl_accget_tax_flg).trigger('chosen:updated');
        angular.element('#gl_accget_fee_flg').val(result.gl_accget_fee_flg).trigger('chosen:updated');
        angular.element('#gl_accget_invest_bnd_flg').val(result.gl_accget_invest_bnd_flg).trigger('chosen:updated');
        angular.element('#gl_accget_lgtm_invst_prof').val(result.gl_accget_lgtm_invst_prof).trigger('chosen:updated');

        $scope.gl_check_flg = result.gl_check_flg;
        $scope.gl_book_sub_flg = result.gl_book_sub_flg;
        $scope.gl_accget_reserved7 = result.gl_accget_reserved7;
        $scope.gl_accget_reserved8 = result.gl_accget_reserved8;

        $scope.gl_accget_reserved9 = result.gl_accget_reserved9;
        $scope.gl_accget_reserved10 = result.gl_accget_reserved10;
        $scope.gl_mod_num_n = result.gl_mod_num_n;
        $scope.gl_max_sub_no = result.gl_max_sub_no;

        $scope.gl_info_cod_filler = result.gl_info_cod_filler;
        $scope.oppo_acct_no = result.oppo_acct_no;
        $scope.auto_invst_intr_cod = result.auto_invst_intr_cod;
        $scope.auto_invst_flt_intr = result.auto_invst_flt_intr;

        $scope.cost_cntr = result.cost_cntr;
        $scope.due_dt = result.due_dt;
        angular.element('#dlay_flg').val(result.dlay_flg).trigger('chosen:updated');
        $scope.over_draw_accum = result.over_draw_accum;

        angular.element('#extn_sts').val(result.extn_sts).trigger('chosen:updated');
        $scope.dt_bgst_seq_no_n = result.dt_bgst_seq_no_n;
        $scope.opac_instn = result.opac_instn;
        var now = new Date();
        $scope.op_time_stamp = $filter('date')(now,'yyyy-MM-dd');

        $scope.crnt_day_dr_amt = result.crnt_day_dr_amt;
        $scope.crnt_day_cr_amt = result.crnt_day_cr_amt;
        $scope.crnt_day_dr_qty = result.crnt_day_dr_qty;
        $scope.crnt_day_cr_qty = result.crnt_day_cr_qty;

        $scope.mnaccum_dr_amt = result.mnaccum_dr_amt;
        $scope.mnaccum_cr_amt = result.mnaccum_cr_amt;
        $scope.mnaccum_dr_item = result.mnaccum_dr_item;
        $scope.mnaccum_cr_item = result.mnaccum_cr_item;

        $scope.mnaccum_dr_bal = result.mnaccum_dr_bal;
        $scope.mnaccum_cr_bal = result.mnaccum_cr_bal;
        $scope.ssn_dr_totl_amt = result.ssn_dr_totl_amt;
        $scope.ssn_cr_totl_amt = result.ssn_cr_totl_amt;

        $scope.ssn_dr_totl_number = result.ssn_dr_totl_number;
        $scope.ssn_cr_totl_number = result.ssn_cr_totl_number;
        $scope.ssn_dr_totl_bal = result.ssn_dr_totl_bal;
        $scope.ssn_cr_totl_bal = result.ssn_cr_totl_bal;

        $scope.yr_accum_dr_amt = result.yr_accum_dr_amt;
        $scope.yr_accum_cr_amt = result.yr_accum_cr_amt;
        $scope.yr_accum_dr_qty = result.yr_accum_dr_qty;
        $scope.yr_accum_cr_qty = result.yr_accum_cr_qty;

        $scope.yr_accum_dr_bal = result.yr_accum_dr_bal;
        $scope.yr_accum_cr_bal = result.yr_accum_cr_bal;
        $scope.lst_prt_rcd_dt = result.lst_prt_rcd_dt;
        $scope.max_prnt_txn_no = result.max_prnt_txn_no;

        $scope.last_bal = result.last_bal;
        $scope.second_bill_dr_amt = result.second_bill_dr_amt;
        $scope.second_bill_cr_amt = result.second_bill_cr_amt;
        $scope.acct_max_bal = result.acct_max_bal;

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

//日历的插件
app.controller('DateCtrl',function ($scope) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    }
});

