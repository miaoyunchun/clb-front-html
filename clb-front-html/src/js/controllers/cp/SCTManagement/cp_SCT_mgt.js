'use strict';

app.controller('SCTPageCtrl',function ($scope,toaster,$timeout,$filter,$http,cpShareDataService,$interval) {
    
    
    $scope.resetTable = function () {
        angular.element('#table_types').val('').trigger('chosen:updated');
    }
    var fixChosenWidth = function () {
        var fixWidthIntervalTask = $interval(function () {
            if (angular.element('#deposit_trans_deposite_chosen').attr('style') !== undefined
                && angular.element('#fee_fee_tag_chosen').attr('style') !== undefined
                && angular.element('#fee_fee_type_chosen').attr('style') !== undefined
                && angular.element('#acct_sct_type_chosen').attr('style') !== undefined
                && angular.element('#card_sct_type_chosen').attr('style') !== undefined
                && angular.element('#fee_sct_type_chosen').attr('style') !== undefined
                && angular.element('#interest_sct_type_chosen').attr('style') !== undefined
                && angular.element('#card_card_type_chosen').attr('style') !== undefined
                && angular.element('#interest_interest_type_chosen').attr('style') !== undefined) {

                angular.element('#deposit_trans_deposite_chosen').css('width', '100%');
                angular.element('#fee_fee_tag_chosen').css('width', '100%');
                angular.element('#fee_fee_type_chosen').css('width','100%');
                angular.element('#acct_sct_type_chosen').css('width','100%');
                angular.element('#card_sct_type_chosen').css('width','100%');
                angular.element('#fee_sct_type_chosen').css('width','100%');
                angular.element('#interest_sct_type_chosen').css('width','100%');
                angular.element('#card_card_type_chosen').css('width','100%');
                angular.element('#interest_interest_type_chosen').css('width','100%');
                $interval.cancel(fixWidthIntervalTask);
            }
        }, 100);
    };

    $scope.tables = [
        {'value':'1','name':'账户控制表'},
        {'value':'2','name':'卡片控制表'},
        {'value':'3','name':'存款控制表'},
        {'value':'4','name':'费用控制表'},
        {'value':'5','name':'利率控制表'},
    ];
    $scope.interestTypes = [
        {'value':'1','name':'固定利率'},
        {'value':'2','name':'浮动利率'},
    ];

    $scope.cardTypes = [
        {'value':'1','name':'金卡'},
        {'value':'2','name':'普卡'}
    ];
    $scope.transFlags = [
        {'value':'0','name':'自动转存'},
        {'value':'1','name':'不转存'}
    ];

    $scope.feeTags = [
        {'value':'E','name':'Charge fee every time'},
        {'value':'A','name':'Charge fee according to txn amt'},
        {'value':'T','name':'Charge fee according to time'}
    ];

    $scope.feeTypes = [
        {'value':'F','name':'Fix amount fee '},
        {'value':'P','name':'Percent fee'},
        {'value':'N','name':'No fee'}
    ];
    $scope.accts = [
        {'value':'001','name':'账户控制表'}
    ];
    $scope.cards = [
        {'value':'002','name':'卡片控制表'}
    ];
    $scope.fees = [
        {'value':'003','name':'费用控制表'}
    ];
    $scope.interests = [
        {'value':'004','name':'利率控制表'}
    ];
    //针对下拉框出现的问题的解决方法
    var fixChosenItemIntervalTask = $interval(function () {
        if (angular.element('#table_types').chosen !== undefined
            && angular.element('#deposit_trans_deposite').chosen !== undefined
            && angular.element('#fee_fee_tag').chosen !== undefined
            && angular.element('#fee_fee_type').chosen !== undefined
            && angular.element('#acct_sct_type').chosen !== undefined
            && angular.element('#card_sct_type').chosen !== undefined
            && angular.element('#fee_sct_type').chosen !== undefined
            && angular.element('#interest_sct_type').chosen !== undefined
            &&  angular.element('#card_card_type').chosen !== undefined
            && angular.element('#interest_interest_type').chosen !== undefined) {

            angular.element('#table_types').chosen({allow_single_deselect: true});
            angular.element('#deposit_trans_deposite').chosen({allow_single_deselect: true});
            angular.element('#fee_fee_tag').chosen({allow_single_deselect: true});
            angular.element('#fee_fee_type').chosen({allow_single_deselect: true});
            angular.element('#acct_sct_type').chosen({allow_single_deselect: true});
            angular.element('#card_sct_type').chosen({allow_single_deselect: true});
            angular.element('#fee_sct_type').chosen({allow_single_deselect: true});
            angular.element('#interest_sct_type').chosen({allow_single_deselect: true});
            angular.element('#card_card_type').chosen({allow_single_deselect: true});
            angular.element('#interest_interest_type').chosen({allow_single_deselect: true});
            $interval.cancel(fixChosenItemIntervalTask);
        }
    });


    $scope.isAcctHidden = true;
    $scope.isCardHidden = true;
    $scope.isDepositHidden = true;
    $scope.isFeeHidden = true;
    $scope.isInterestHidden = true;

    //查询sct按钮
    $scope.querySCT = function () {
        fixChosenWidth();
        var formData = getFormData(angular.element('#formSCTFilter'));
        console.log(formData.table_types);
        if(formData.table_types !== ''){
            var param = {
                'sct_id':formData.sct_id
            };

            //将查询的表的类型保存起来
            var tableType = {
                'table_type':formData.table_types
            };
            cpShareDataService.setTableType(tableType);



            var queryUrl;//查询访问后台的地址
            if(formData.table_types === '1'){
                //账户控制表
                queryUrl = CP_URL.CP_SCTACCT_INQ;
            }else if(formData.table_types === '2'){//卡片控制表

                queryUrl = CP_URL.CP_SCTCARD_INQ;
            }else if(formData.table_types === '3'){//存款控制表

                queryUrl = CP_URL.CP_SCTDEPOSIT_INQ;
            }else if(formData.table_types === '4'){//费用控制表

                queryUrl = CP_URL.CP_SCTFEE_INQ;
            }else if(formData.table_types === '5'){//利率控制表

                queryUrl = CP_URL.CP_SCTINTS_INQ;
            }

            $http({
                method: 'POST',
                url: queryUrl,//直接访问clb-api
                data:{'megid': 'test',
                    "user": 'test',
                    "param": param,
                    "correlid":'test'}
            }).then(function successCallback(response){
                if(response.status == 200){//和后台交互成功

                    if(response.data.data != null){//查询到了结果

                        var result = response.data.data;
                        console.log(result);
                        //一个表显示，其他表隐藏
                        switch (formData.table_types){
                            case '1':
                                $scope.isAcctHidden = false;
                                $scope.isCardHidden = true;
                                $scope.isDepositHidden = true;
                                $scope.isFeeHidden = true;
                                $scope.isInterestHidden = true;
                                cpShareDataService.setSCTAcct(result);

                                $scope.keyEnabled = true;
                                $scope.commonEnabled = true;

                                $scope.commitBtnhide = true;
                                $scope.cancelBtnhide = true;
                                $scope.editBtnHide = false;
                                $scope.addBtnHide = false;
                                //表显示数据
                                fillSCTAcct(result);
                                break;

                            case '2':
                                $scope.isAcctHidden = true;
                                $scope.isCardHidden = false;
                                $scope.isDepositHidden = true;
                                $scope.isFeeHidden = true;
                                $scope.isInterestHidden = true;
                                fillSCTCard(result);

                                $scope.keyEnabled = true;
                                $scope.commonEnabled = true;

                                $scope.commitBtnhide = true;
                                $scope.cancelBtnhide = true;
                                $scope.editBtnHide = false;
                                $scope.addBtnHide = false;
                                cpShareDataService.setSCTCard(result);
                                break;

                            case '3':
                                $scope.isAcctHidden = true;
                                $scope.isCardHidden = true;
                                $scope.isDepositHidden = false;
                                $scope.isFeeHidden = true;
                                $scope.isInterestHidden = true;
                                fillSCTDeposit(result);

                                $scope.keyEnabled = true;
                                $scope.commonEnabled = true;

                                $scope.commitBtnhide = true;
                                $scope.cancelBtnhide = true;
                                $scope.editBtnHide = false;
                                $scope.addBtnHide = false;
                                cpShareDataService.setSCTDeposit(result);
                                break;

                            case '4':
                                $scope.isAcctHidden = true;
                                $scope.isCardHidden = true;
                                $scope.isDepositHidden = true;
                                $scope.isFeeHidden = false;
                                $scope.isInterestHidden = true;
                                fillSCTFee(result);


                                $scope.keyEnabled = true;
                                $scope.commonEnabled = true;

                                $scope.commitBtnhide = true;
                                $scope.cancelBtnhide = true;
                                $scope.editBtnHide = false;
                                $scope.addBtnHide = false;
                                cpShareDataService.setSCTFee(result);
                                break;

                            case '5':
                                $scope.isAcctHidden = true;
                                $scope.isCardHidden = true;
                                $scope.isDepositHidden = true;
                                $scope.isFeeHidden = true;
                                $scope.isInterestHidden = false;
                                fillSCTInterest(result);

                                $scope.keyEnabled = true;
                                $scope.commonEnabled = true;

                                $scope.commitBtnhide = true;
                                $scope.cancelBtnhide = true;
                                $scope.editBtnHide = false;
                                $scope.addBtnHide = false;
                                cpShareDataService.setSCTInterest(result);
                                break;
                        }

                    }else {
                        $timeout(function () {
                            toaster.pop(
                                'error',
                                $filter('translate')('pages.cp.TOASTER_ERROR_MESSAGE.MESSAGE_HEAD'),
                                $filter('translate')('pages.cp.TOASTER_ERROR_MESSAGE.MESSAGE_CONTENT')
                            );
                        }, 0);

                    }
                }
            });
        }else{
            $timeout(function () {
                toaster.pop(
                    'error',
                    '？？？',
                    '请输入查询必要的数据'
                );
            }, 0);
        }



        
    };

    //查询成功后点击编辑按钮实现更新
    $scope.editForm = function () {
        $scope.keyEnabled = true;//主键不能更改
        $scope.commonEnabled = false;//可修改项不再锁定
        $scope.commitBtnhide = false;//提交按钮显示
        $scope.cancelBtnhide = false;//取消按钮显示
        $scope.editBtnHide = true;//修改按钮消失
        $scope.addBtnHide = true;//添加按钮消失

        var btnFlag = {
            'btn_flag':'edit'
        };
        cpShareDataService.setBtnFlag(btnFlag);//该标志位表明当前操作是修改

        var now = new Date();
        $scope.acct_last_maint_date = $filter('date')(now,'yyyy-MM-dd');//最后维护日期改为系统日期
        $scope.card_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
        $scope.fee_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
        $scope.interest_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
        $scope.deposit_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
    }


    //点击提交按钮后的事件
    $scope.commitForm = function () {
        $scope.keyEnabled = true;//主键不能更改

        var tabletype = cpShareDataService.getTableType().table_type;
        var btnFlag = cpShareDataService.getBtnFlag().btn_flag;
        console.log(tabletype + "::::" + btnFlag);


        var param;
        if(tabletype === '1'){       //账户控制表
            param = getFormData(angular.element('#formSCTAcct'));
        }else if(tabletype === '2'){//卡片控制表
            param = getFormData(angular.element('#formSCTCard'));
        }else if(tabletype === '3'){//存款表
            param = getFormData(angular.element('#formSCTDeposit'));
        }else if(tabletype === '4'){//费用表
            param = getFormData(angular.element('#formSCTFee'));
        }else if(tabletype === '5'){//利率表
            param = getFormData(angular.element('#formSCTInterest'));
        }
        console.log(param);

        if(btnFlag === 'add'){                                     //提交的是添加数据的操作
            var addUrl;//添加的api地址
            if(tabletype === '1'){       //账户控制表
                addUrl = CP_URL.CP_SCTACCT_ADD;
            }else if(tabletype === '2'){//卡片控制表
                addUrl = CP_URL.CP_SCTCARD_ADD;
            }else if(tabletype === '3'){//存款表
                addUrl = CP_URL.CP_SCTDEPOSIT_ADD;
            }else if(tabletype === '4'){//费用表
                addUrl = CP_URL.CP_SCTFEE_ADD;
            }else if(tabletype === '5'){//利率表
                addUrl = CP_URL.CP_SCTINTS_ADD;
            }

            $http({
                method: 'POST',
                url: addUrl,//直接访问clb-api
                data:{'megid': 'test',
                    "user": 'test',
                    "param": param,
                    "correlid":'test'}
            }).then(function successCallback(response){
                if(response.status == 200){//和后台交互成功
                    console.log(response.data);
                    if(response.data.code == '0000'){//操作成功
                        $scope.commonEnabled = true;//可修改项锁定
                        $scope.commitBtnhide = true;//提交按钮隐藏
                        $scope.cancelBtnhide = true;//取消按钮隐藏
                        $scope.editBtnHide = false;//修改按钮显示
                        $scope.addBtnHide = false;//添加按钮显示

                        $timeout(function () {
                            toaster.pop(
                                'success',
                                '操作成功',
                                '插入操作成功'
                            );
                        }, 0);

                    }else {

                        //弹出操作失败的消息，其他不变
                        $timeout(function () {
                            toaster.pop(
                                'error',
                                '操作失败',
                                '插入失败'
                            );
                        }, 0);

                    }
                }
            });


        } else if(btnFlag === 'edit'){                                                   //提交的是修改表的操作


            var editUrl;//修改的api地址
            var tabletype = cpShareDataService.getTableType().table_type;
            if(tabletype === '1'){       //账户控制表
                editUrl = CP_URL.CP_SCTACCT_UPD;
            }else if(tabletype === '2'){//卡片控制表
                editUrl = CP_URL.CP_SCTCARD_UPD;
            }else if(tabletype === '3'){//存款表
                editUrl = CP_URL.CP_SCTDEPOSIT_UPD;
            }else if(tabletype === '4'){//费用表
                editUrl = CP_URL.CP_SCTFEE_UPD;
            }else if(tabletype === '5'){//利率表
                editUrl = CP_URL.CP_SCTINTS_UPD;
            }
            console.log(editUrl);

            $http({
                method: 'POST',
                url: editUrl,//直接访问clb-api
                data:{'megid': 'test',
                    "user": 'test',
                    "param": param,
                    "correlid":'test'}
            }).then(function successCallback(response){
                if(response.status == 200){//和后台交互成功
                    console.log(response.data);
                    if(response.data.code == '0000'){//操作成功
                        $scope.commonEnabled = true;//可修改项不再锁定
                        $scope.commitBtnhide = true;//提交按钮显示
                        $scope.cancelBtnhide = true;//取消按钮显示
                        $scope.editBtnHide = false;//修改按钮消失
                        $scope.addBtnHide = false;//添加按钮消失

                        $timeout(function () {
                            toaster.pop(
                                'success',
                                '操作成功',
                                '更新操作成功'
                            );
                        }, 0);

                    }else {

                        //弹出操作失败的消息，其他不变
                        $timeout(function () {
                            toaster.pop(
                                'error',
                               '操作失败',
                                '更新操作失败'
                            );
                        }, 0);

                    }
                }
            });
        }

    }


    //add按钮事件
    $scope.addForm = function () {
        $scope.keyEnabled = false;//主键也可输入
        $scope.commonEnabled = false;//可修改项不再锁定
        $scope.commitBtnhide = false;//提交按钮显示
        $scope.cancelBtnhide = false;//取消按钮显示
        $scope.editBtnHide = true;//修改按钮消失
        $scope.addBtnHide = true;//添加按钮消失

        var btnFlag = {
            'btn_flag':'add'
        };
        cpShareDataService.setBtnFlag(btnFlag);//该标志位表明当前操作是添加
        clearSCTAcct();
        clearSCTCard();
        clearSCTDepost();
        clearSCTFee();
        clearSCTInterest();
    }


    //cancel按钮事件
    $scope.cancelForm = function () {
        $scope.keyEnabled = true;//主键不能更改
        $scope.commonEnabled = true;//可修改项锁定
        $scope.commitBtnhide = true;//提交按钮隐藏
        $scope.cancelBtnhide = true;//取消按钮隐藏
        $scope.editBtnHide = false;//修改按钮出现
        $scope.addBtnHide = false;//添加按钮出现

        var tabletype = cpShareDataService.getTableType().table_type;
        var tabledata;
        if(tabletype === '1'){   //账户
            var acctform = cpShareDataService.getSCTAcct();//获取保存的账户数据
            fillSCTAcct(acctform);
        }else if(tabletype === '2'){ //卡片
            var cardForm = cpShareDataService.getSCTCard();//获取保存的卡片信息
            //将数据显示在表格中。。
            fillSCTCard(cardForm);
        }else if(tabletype === '3'){ //存款
            var depositForm = cpShareDataService.getSCTDeposit();//获取保存的存款信息
            fillSCTDeposit(depositForm);
        }else if(tabletype === '4'){ //费用
            var feeForm = cpShareDataService.getSCTFee();//获取保存的费用信息
            fillSCTFee(feeForm);
        }else if(tabletype === '5'){ //利率
            var interestForm = cpShareDataService.getSCTInterest();//获得保存利率信息
            fillSCTInterest(interestForm);
        }

    }



    //将结果填充到sct账户表中
    var fillSCTAcct = function (formData) {
        $scope.acct_sct_id = formData.sct_id;
        $scope.acct_sct_name = formData.sct_name;
        $scope.acct_associate_org_id = formData.associate_org_id;

        angular.element('#acct_sct_type').val(formData.sct_type).trigger('chosen:updated');
        $scope.acct_account_start_nbr = formData.account_start_nbr;
        $scope.acct_acct_end_nbr = formData.acct_end_nbr;
        $scope.acct_account_current = formData.account_current;
        $scope.acct_account_next = formData.account_next;
        if(formData.last_maint_date === ''){
            var now = new Date();
            $scope.acct_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
        }else {
            $scope.acct_last_maint_date = formData.last_maint_date;
        }
    }
    //清空sct账户表
    var clearSCTAcct = function () {
        $scope.acct_sct_id = '';
        $scope.acct_sct_name = '';
        $scope.acct_associate_org_id = '';
        angular.element('#acct_sct_type').val('').trigger('chosen:updated');
        $scope.acct_account_start_nbr = '';
        $scope.acct_acct_end_nbr = '';
        $scope.acct_account_current = '';
        $scope.acct_account_next = '';

        var now = new Date();
        $scope.acct_last_maint_date = $filter('date')(now,'yyyy-MM-dd');

    }

    //将查询结果填充到sct卡片表中
    var fillSCTCard = function (formData) {
        $scope.card_sct_id = formData.sct_id;
        $scope.card_sct_name = formData.sct_name;
        $scope.card_associate_org_id = formData.associate_org_id;
        // $scope.card_sct_type = formData.sct_type;
        angular.element('#card_sct_type').val(formData.sct_type).trigger('chosen:updated');

        $scope.card_card_bin = formData.card_bin;
        // $scope.card_card_type = formData.card_type;
        angular.element('#card_card_type').val(formData.card_type).trigger('chosen:updated');
        $scope.card_card_start_nbr = formData.card_start_nbr;
        $scope.card_card_end_nbr = formData.card_end_nbr;

        $scope.card_card_current = formData.card_current;
        $scope.card_card_next = formData.card_next;

        var now = new Date();
        $scope.card_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
    }
    //清空sct卡片表
    var clearSCTCard = function () {
        $scope.card_sct_id = '';
        $scope.card_sct_name = '';
        $scope.card_associate_org_id = '';
        angular.element('#card_sct_type').val('').trigger('chosen:updated');

        $scope.card_card_bin = '';
        // $scope.card_card_type = '';
        angular.element('#card_card_type').val('').trigger('chosen:updated');
        $scope.card_card_start_nbr = '';
        $scope.card_card_end_nbr = '';

        $scope.card_card_current = '';
        $scope.card_card_next = '';

        var now = new Date();
        $scope.card_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
    }

    //将查询结果填充到sct存款表中
    var fillSCTDeposit = function (formData) {
        $scope.deposit_sct_id = formData.sct_id;
        $scope.deposit_sct_name = formData.sct_name;
        $scope.deposit_associate_org_id = formData.associate_org_id;
        angular.element('#deposit_trans_deposite').val(formData.trans_deposite).trigger('chosen:updated');

        $scope.deposit_max_amt = formData.max_amt;
        $scope.deposit_deposite_period = formData.deposite_period;
        $scope.deposit_withdraw_period = formData.withdraw_period;
        $scope.deposit_withdraw_times = formData.withdraw_times;

        $scope.deposit_cmp_ints_time = formData.cmp_ints_time;
        $scope.deposit_withdraw_amt = formData.withdraw_amt;
        $scope.deposit_min_amt = formData.min_amt;

        var now = new Date();
        $scope.deposit_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
    }
    //清空sct存款表
    var clearSCTDepost = function () {
        $scope.deposit_sct_id = '';
        $scope.deposit_sct_name = '';
        $scope.deposit_associate_org_id = '';
        angular.element('#deposit_trans_deposite').val('').trigger('chosen:updated');

        $scope.deposit_max_amt = '';
        $scope.deposit_deposite_period = '';
        $scope.deposit_withdraw_period = '';
        $scope.deposit_withdraw_times = '';

        $scope.deposit_cmp_ints_time = '';
        $scope.deposit_withdraw_amt = '';
        $scope.deposit_min_amt = '';

        var now = new Date();
        $scope.deposit_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
    }

    //将结果填充到sct费用表中
    var fillSCTFee = function (formData) {
        $scope.fee_sct_id = formData.sct_id;
        $scope.fee_sct_name = formData.sct_name;
        $scope.fee_associate_org_id = formData.associate_org_id;
        // $scope.fee_sct_type = formData.sct_type;
        angular.element('#fee_sct_type').val(formData.sct_type).trigger('chosen:updated');

        angular.element('#fee_fee_tag').val(formData.fee_tag).trigger('chosen:updated');
        angular.element('#fee_fee_type').val(formData.fee_type).trigger('chosen:updated');
        $scope.fee_fee_amt = formData.fee_amt;
        $scope.fee_fee_precent = formData.fee_precent;

        $scope.fee_fee_discount = formData.fee_discount;
        $scope.fee_fee_txn_amt = formData.fee_txn_amt;
        $scope.fee_fee_txn_timed = formData.fee_txn_timed;
        $scope.fee_fee_txn_timem = formData.fee_txn_timem;

        var now = new Date();
        $scope.fee_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
        $scope.fee_fee_check_account = formData.fee_fee_check_account;
        $scope.fee_def_fee_tag = formData.def_fee_tag;
        $scope.fee_def_fee_type = formData.def_fee_type;

        $scope.fee_def_fee_amt = formData.def_fee_amt;
        $scope.fee_def_fee_percent = formData.def_fee_percent;
        $scope.fee_def_fee_check_account = formData.def_fee_check_account;
    }
    //清空sct费用表
    var clearSCTFee = function () {
        $scope.fee_sct_id = '';
        $scope.fee_sct_name = '';
        $scope.fee_associate_org_id = '';
        angular.element('#fee_sct_type').val('').trigger('chosen:updated');

        angular.element('#fee_fee_tag').val('').trigger('chosen:updated');
        angular.element('#fee_fee_type').val('').trigger('chosen:updated');
        $scope.fee_fee_amt = '';
        $scope.fee_fee_precent = '';

        $scope.fee_fee_discount = '';
        $scope.fee_fee_txn_amt = '';
        $scope.fee_fee_txn_timed = '';
        $scope.fee_fee_txn_timem = '';

        var now = new Date();
        $scope.fee_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
        $scope.fee_fee_check_account = '';
        $scope.fee_def_fee_tag = '';
        $scope.fee_def_fee_type = '';

        $scope.fee_def_fee_amt = '';
        $scope.fee_def_fee_percent = '';
        $scope.fee_def_fee_check_account = '';
    }

    //将查询结果填充到sct利率表中
    var fillSCTInterest = function (formData) {
        $scope.interest_sct_id = formData.sct_id;
        $scope.interest_sct_name = formData.sct_name;
        $scope.interest_associate_org_id = formData.associate_org_id;

        // $scope.interest_sct_type = formData.sct_type;
        angular.element('#interest_sct_type').val(formData.sct_type).trigger('chosen:updated');
        // $scope.interest_interest_type = formData.interest_type;
        angular.element('#interest_interest_type').val(formData.interest_type).trigger('chosen:updated');
        $scope.interest_interest_rate = formData.interest_rate;

        $scope.interest_floating_percent = formData.floating_percent;
        var now = new Date();
        $scope.interest_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
    }
    //清空sct利率表
    var clearSCTInterest = function () {
        $scope.interest_sct_id = '';
        $scope.interest_sct_name = '';
        $scope.interest_associate_org_id = '';

        angular.element('#interest_sct_type').val('').trigger('chosen:updated');
        angular.element('#interest_interest_type').val('').trigger('chosen:updated');
        $scope.interest_interest_rate = '';

        $scope.interest_floating_percent = '';
        var now = new Date();
        $scope.interest_last_maint_date = $filter('date')(now,'yyyy-MM-dd');
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
//日期插件
app.controller('DateCtrl',function ($scope) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    }
});