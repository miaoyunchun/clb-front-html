'use strict';
app.factory('fmShareDataService',function () {
    var subjectFilter = {
        item_key:'',
        item_level:''
    };

    var acctEntryFilter = {
        acct_item:'',
        tran_id:'',
        cond_seq:'',
        dc_flag:'',
        acct_org:'',
        tran_amt_point:'',
        item_seq:'',
        tran_desp:''
    }
    var itemDetailFiler = {
    	txn_jour_t:'',
    	txn_seq:''
    };
    var tradDetailFiler = {
    	txn_jour:''
    };
    var generalAcct = {
            item_key:''
        };
    var acctingDetail = {
            tran_jour:'',
            tran_seq:''
        };

    return{
        setSubjectFilter:setSubjectFilter,
        getSubjectFilter:getSubjectFilter,

        setAcctEntryFilter:setAcctEntryFilter,
        getAcctEntryFilter:getAcctEntryFilter,
        
        setItemDetailFiler:setItemDetailFiler,
        getItemDetailFiler:getItemDetailFiler,
        
        setTradDetailFiler:setTradDetailFiler,
        getTradDetailFiler:getTradDetailFiler,
        
        setGeneralAcct:setGeneralAcct,
        getGeneralAcct:getGeneralAcct,

        setAcctingDetail:setAcctingDetail,
        getAcctingDetail:getAcctingDetail
    }
    function setSubjectFilter(subjectFilter) {
        this.subjectFilter = subjectFilter;
    }
    function getSubjectFilter() {
        return this.subjectFilter;
    }
    
    function setAcctEntryFilter(acctEntryFilter) {
        this.acctEntryFilter = acctEntryFilter;
    }
    function getAcctEntryFilter() {
        return this.acctEntryFilter;
    }
    
    
    function setItemDetailFiler(itemDetailFiler) {
        this.itemDetailFiler = itemDetailFiler;
    }
    function getItemDetailFiler() {
        return this.itemDetailFiler;
    }
    
    
    function setTradDetailFiler(tradDetailFiler) {
        this.tradDetailFiler = tradDetailFiler;
    }
    function getTradDetailFiler() {
        return this.tradDetailFiler;
    }
    
    function setGeneralAcct(generalAcct) {
        this.generalAcct = generalAcct;
    }
    function getGeneralAcct() {
        return this.generalAcct;
    }

    function setAcctingDetail(acctingDetail) {
        this.acctingDetail = acctingDetail;
    }
    function getAcctingDetail() {
        return this.acctingDetail;
    }
    
});