'use strict';

var CLB_FRONT_BASE_URL = 'http://127.0.0.1:80/clb-front/';

var CP_URL ={
    CP_ORG_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-ORGPAR-ADD',//添加机构
    CP_ORG_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-CP-ORGPAR-INQ',//查询机构
    CP_ORG_LIST:'http://127.0.0.1:8090/clb-consumer/VBS-CP-ORGPAR-LIST',//查询机构列表
    cp_ORG_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-ORGPAR-UPD',//更新机构信息

    CP_PRO_LIST:'http://127.0.0.1:8090/clb-consumer/VBS-CP-PROPAR-LIST',//查询产品列表
    CP_PRO_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-CP-PROPAR-INQ',//查询单条产品信息
    CP_PRO_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-PROPAR-ADD',//添加产品信息
    CP_PRO_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-PROPAR-UPD',//更新产品信息

    CP_SCTACCT_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTACCT-INQ',//单条账户查询
    CP_SCTCARD_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTCARD-INQ',//卡片信息查询
    CP_SCTDEPOSIT_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTDP-INQ',//存款信息查询
    CP_SCTFEE_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTFEE-INQ',//费用信息查询
    CP_SCTINTS_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTINTS-INQ',//利率信息查询

    CP_SCTACCT_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTACCT-ADD',//账户信息添加
    CP_SCTCARD_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTCARD-ADD',//卡片信息添加
    CP_SCTDEPOSIT_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTDP-ADD',//存款信息添加
    CP_SCTFEE_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTFEE-ADD',//费用信息添加
    CP_SCTINTS_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTINTS-ADD',//利率信息添加

    CP_SCTACCT_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTACCT-UPD',//账户信息更新
    CP_SCTCARD_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTCARD-UPD',//卡片信息更新
    CP_SCTDEPOSIT_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTDP-UPD',//存款信息更新
    CP_SCTFEE_UPD: 'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTFEE-UPD',//费用信息更新
    CP_SCTINTS_UPD: 'http://127.0.0.1:8090/clb-consumer/VBS-CP-SCTINTS-UPD'//利率信息更新


};
var RM_URL ={
	RM_BUSCUST_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-RM-BUSCUST-ADD',//新增对公客户
	RM_BUSCUST_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-RM-BUSCUST-UPD',//对公客户维护
	RM_BUSCUST_NAQ:'http://127.0.0.1:8090/clb-consumer/VBS-RM-BUSCUST-NAQ',//客户姓名查询
	RM_CUSTREL_MNT:'http://127.0.0.1:8090/clb-consumer/VBS-RM-CUSTREL-MNT',//客户关系增删改查
	
	RM_CUSTREL_EQY:'http://127.0.0.1:8090/clb-consumer/VBS-RM-CUSTREL-EQY',//客户关系列表查询
	RM_CUSTALE_MNT:'http://127.0.0.1:8090/clb-consumer/VBS-RM-CUSTALE-MNT',//客户事件增删改查
	RM_CUSTALE_EQY:'http://127.0.0.1:8090/clb-consumer/VBS-RM-CUSTALE-EQY',//客户事件列表查询
	RM_SPEITEM_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-RM-SPEITEM-UPD',//自定义信息增删改查
	
	RM_SPEITME_EQY:'http://127.0.0.1:8090/clb-consumer/VBS-RM-SPEITME-EQY',//自定义信息列表查询
	RM_CUSHIST_HIS:'http://127.0.0.1:8090/clb-consumer/VBS-RM-CUSHIST-HIS',//维护历史列表查询
	RM_CUSHIST_ITM:'http://127.0.0.1:8090/clb-consumer/VBS-RM-CUSHIST-ITM',//维护历史明细查询
	RM_PUSCUST_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-RM-PUSCUST-INQ',//个人客户查询
	
	RM_PUSCUST_MNT:'http://127.0.0.1:8090/clb-consumer/VBS-RM-PUSCUST-MNT',//个人客户更新
	RM_PUSCUST_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-RM-PUSCUST-ADD',//新增个人客户
	RM_PUSCUST_NAQ:'http://127.0.0.1:8090/clb-consumer/VBS-RM-PUSCUST-NAQ'//个人客户姓名查询
};
var FM_URL = {
    FM_SUBJECT_LIST:'http://127.0.0.1:8090/clb-consumer/VBS-FM-SUBPAR-LIST',//科目信息列表查询

    FM_SUBJECT_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ITEMIFO-INQ',//根据主键查询科目的详细信息
    FM_SUBJECT_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ITEMIFO-UPD',//更新科目信息
    FM_SUBJECT_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ITEMIFO-ADD',//科目信息插入
    
    FM_TRAD_LIST :'http://127.0.0.1:8090/clb-consumer/VBS-FM-TRAD-LIST',//科目信息查询
    FM_ITEMD_LIST:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ITEMD-LIST',//科目明细列表查询
    FM_ITEMD_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ITEMD-INQ',//科目明细查询
    FM_TXN_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-FM-TXN-INQ',//交易流水单条查询
    FM_TXN_JUR:'http://127.0.0.1:8090/clb-consumer/VBS-FM-TXN-JUR',//添加交易流水
    FM_TXN_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-FM-TXN-UPD',//修改交易流水

    FM_ACCT_ENTRY_LIST:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ACCT-LIST',//会计分录列表查询
    FM_ACCTENTRY_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ACCTENTRY-INQ',//會計分錄單條查詢是否存在
    FM_ACCTENTRYDETAIL_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ACCTENTRYDETAIL-INQ',//根据主键查询会计分录的详细信息
    FM_ACCTENTRY_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ACCT-ADD',//会计分录插入
    FM_ACCTENTRY_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ACCT-UPD',//会计分录信息修改

    FM_ACCTLIST_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ACCTINGLIST-INQ',//记账分录明细列表查询
    FM_ACCTDETAIL_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ACCTD-INQ',//记账分录明细单条查询

    FM_GENERALACCTING_LIST:'http://127.0.0.1:8090/clb-consumer/VBS-FM-GENERALACCTING-LIST',//总账账务列表查询

    FM_GENERALACCTING_INQ:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ITEM-INQ',//总账科目单条查询
    FM_GENERALACCTING_ADD:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ITEM-ADD', //总账科目信息插入
    FM_GENERALACCTING_UPD:'http://127.0.0.1:8090/clb-consumer/VBS-FM-ITEM-UPD'//总账科目信息修改
};

var LN_BASE_URL='http://127.0.0.1:8090/clb-consumer/';









