'use strict';

app.factory('cpShareDataService',function () {
    var org = {
        org_id:'',
        org_name:'',
        process_status:'',
        process_with_system:'',
        curr_proc_date:'',
        last_proc_date:'',
        next_proc_date:'',
        accr_thru_date:'',
        last_accr_date:'',
        next_accr_date:'',
        last_maint_date:'',
        work_of_week:'',
        eom_eoy_flag:'',
        public_holiday1:'',
        public_holiday2:'',
        public_holiday3:'',
        public_holiday4:'',
        public_holiday5:'',
        public_holiday6:'',
        public_holiday7:'',
        public_holiday8:'',
        public_holiday9:'',
        public_holiday10:'',
        public_holiday11:'',
        public_holiday12:'',
        public_holiday13:'',
        public_holiday14:'',
        public_holiday15:'',
        public_holiday16:'',
        public_holiday17:'',
        public_holiday18:'',
        public_holiday19:'',
        public_holiday20:'',
        public_holiday21:'',
        public_holiday22:'',
        public_holiday23:'',
        public_holiday24:'',
        public_holiday25:'',
        public_holiday26:'',
        public_holiday27:'',
        public_holiday28:'',
        public_holiday29:'',
        public_holiday30:'',
        del:'',
        create_time:'',
        create_user:'',
        update_time:'',
        update_user:''
    };

    var product = {
        product_id:'',
        product_name:'',
        associate_org_id:'',
        subject_number:'',
        product_type:'',
        product_code:'',
        product_ccy:'',
        currency_support:'',
        multi_nstance:'',
        card_issurance:'',
        account_control:'',
        card_control:'',
        fee_control:'',
        interest_control:'',
        dp_control:'',
        last_maint_date:'',
        del:'',
        create_time:'',
        create_user:'',
        update_time:'',
        update_user:''
    };

    var sct_acct = {
        sct_id:'',
        sct_name:'',
        associate_org_id:'',
        sct_type:'',
        account_start_nbr:'',
        acct_end_nbr:'',
        account_current:'',
        account_next:'',
        last_maint_date:'',
        del:'',
        create_time:'',
        create_user:'',
        update_time:'',
        update_user:''
    };

    var sct_card = {
        sct_id:'',
        sct_name:'',
        associate_org_id:'',
        sct_type:'',
        card_bin:'',
        card_type:'',
        card_start_nbr:'',
        card_end_nbr:'',
        card_current:'',
        card_next:'',
        last_maint_date:'',
        del:'',
        create_time:'',
        create_user:'',
        update_time:'',
        update_user:''
    };

    var sct_deposit = {
        sct_id:'',
        sct_name:'',
        associate_org_id:'',
        min_amt:'',
        max_amt:'',
        deposite_period:'',
        withdraw_period:'',
        withdraw_times:'',
        cmp_ints_time:'',
        withdraw_amt:'',
        trans_deposite:'',
        last_maint_date:'',
        del:'',
        create_time:'',
        create_user:'',
        update_time:'',
        update_user:''
    };

    var sct_fee = {
        sct_id:'',
        sct_name:'',
        associate_org_id:'',
        sct_type:'',
        fee_tag:'',
        fee_type:'',
        fee_amt:'',
        fee_precent:'',
        fee_discount:'',
        fee_txn_amt:'',
        fee_txn_timed:'',
        fee_txn_timem:'',
        last_maint_date:'',
        fee_check_account:'',
        def_fee_tag:'',
        def_fee_type:'',
        def_fee_amt:'',
        def_fee_percent:'',
        def_fee_check_account:'',
        del:'',
        create_time:'',
        create_user:'',
        update_time:'',
        update_user:''
    };

    var sct_interest = {
        sct_id:'',
        sct_name:'',
        associate_org_id:'',
        sct_type:'',
        interest_type:'',
        interest_rate:'',
        floating_percent:'',
        last_maint_date:'',
        del:'',
        create_time:'',
        create_user:'',
        update_time:'',
        update_user:''
    };

    var tableType = {
        table_type:''
    };

    var btnFlag = {
        btn_flag:''
    };

    var common = {
        chosenRowData:{}
    };

    var processWithSystem = [];
    var processStatus = [];
    var workOfWeek = [];
    var eomEoyFlag = [];


    return{
        setProcessWithSystem:setProcessWithSystem,
        getProcessWithSystem:getProcessWithSystem,

        setProcessStatus:setProcessStatus,
        getProcessStatus:getProcessStatus,

        setWorkOfWeek:setWorkOfWeek,
        getWorkOfWeek:getWorkOfWeek,

        setEomEoyFlag:setEomEoyFlag,
        getEomEoyFlag:getEomEoyFlag,

        common:{
            setChosenRowData:setChosenRowData,
            getChosenRowData:getChosenRowData
        },
        setOrg:setOrg,
        getOrg:getOrg,

        setProduct:setProduct,
        getProduct:getProduct,

        setSCTAcct:setSCTAcct,
        getSCTAcct:getSCTAcct,

        setSCTCard:setSCTCard,
        getSCTCard:getSCTCard,

        setSCTDeposit:setSCTDeposit,
        getSCTDeposit:getSCTDeposit,

        setSCTFee:setSCTFee,
        getSCTFee:getSCTFee,

        setSCTInterest:setSCTInterest,
        getSCTInterest:getSCTInterest,

        setTableType:setTableType,
        getTableType:getTableType,

        setBtnFlag:setBtnFlag,
        getBtnFlag:getBtnFlag

    };

    function setProcessWithSystem(processWithSystem) {
        this.processWithSystem = processWithSystem;
    }
    function getProcessWithSystem() {
        return this.processWithSystem;
    }

    function setProcessStatus(processStatus) {
        this.processStatus = processStatus;
    }
    function getProcessStatus() {
        return this.processStatus;
    }

    function setWorkOfWeek(workOfWeek) {
        this.workOfWeek = workOfWeek;
    }
    function getWorkOfWeek() {
        return this.workOfWeek;
    }

    function setEomEoyFlag(eomEoyFlag) {
        this.eomEoyFlag = eomEoyFlag;
    }
    function getEomEoyFlag() {
        return this.eomEoyFlag;
    }

    function setChosenRowData(chosenRowData) {
        this.chosenRowData = chosenRowData;
    }
    function getChosenRowData() {
        return this.chosenRowData;
    }

    function setOrg(org) {
        this.org = org;
    };
    function getOrg(){
        return this.org;
    };



    function setProduct(product) {
        this.product = product;
    };
    function getProduct() {
        return this.product;
    };


    function setSCTAcct(sct_acct) {
        this.sct_acct = sct_acct;
    };
    function getSCTAcct() {
        return this.sct_acct;
    };


    function setSCTCard(sct_card) {
        this.sct_card = sct_card;
    };
    function getSCTCard() {
        return this.sct_card;
    };


    function setSCTDeposit(sct_deposit) {
        this.sct_deposit = sct_deposit;
    }
    function getSCTDeposit() {
        return this.sct_deposit;
    }


    function setSCTFee(sct_fee) {
        this.sct_fee = sct_fee;
    }
    function getSCTFee() {
        return this.sct_fee;
    }


    function setSCTInterest(sct_interest) {
        this.sct_interest = sct_interest;
    }
    function getSCTInterest() {
        return this.sct_interest;
    }

    function setTableType(tableType) {
        this.tableType = tableType;
    }
    function getTableType() {
        return this.tableType;
    }

    function setBtnFlag(btnFlag) {
        this.btnFlag = btnFlag;
    }
    function getBtnFlag() {
        return this.btnFlag;
    }
});