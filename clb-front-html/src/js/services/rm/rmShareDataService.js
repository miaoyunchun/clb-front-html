'use strict';

app.factory('rmShareDataService', function ($filter) {

    var custEventInformation={
    		ctale_func:'',
    		ctaleqo_cus_num:'',
    		ctaleqo_title:'',
    		hpn_date:''
    }
    var maintenanceHistoryInformation={
    		time_stamp:'',
    		trans_name:'',
    		cus_num:'',
    		list:''
    }
    var customerRelationInformation={
    		creal_cus_num:"",
    		creal_main_date:"",
    		creal_maker:"",
    		creal_mark:"",
    		creal_rel_cus:"",
    		creal_retype:"",
    		create_time:"",
    		create_user:"",
    		del:"",
    		update_time:"",
    		update_user:""
    }
    var customizedInformation={
    		crdmn_defined_content:"",
    		crdmn_defined_desc:"",
    		crdmn_defined_titl:"",
    		crdmn_last_main_date:"",
    		crdmn_maker:"",
    		crdmn_number:"",
    		create_time:"",
    		create_user:"",
    		del:"",
    		update_time:"",
    		update_user:""
    }
    return{
    	setCustEventInformation:setCustEventInformation,
    	getCustEventInformation:getCustEventInformation,
    	
    	setMaintenanceHistoryInformation:setMaintenanceHistoryInformation,
    	getMaintenanceHistoryInformation:getMaintenanceHistoryInformation,
    	
    	setCustomerRelationInformation:setCustomerRelationInformation,
    	getCustomerRelationInformation:getCustomerRelationInformation,
    	
    	setCustomizedInformation:setCustomizedInformation,
    	getCustomizedInformation:getCustomizedInformation
    }
    function setCustEventInformation(custEventInformation){
    	this.custEventInformation=custEventInformation;
    }
    function getCustEventInformation(){
    	return this.custEventInformation;
    }
    
    function setMaintenanceHistoryInformation(maintenanceHistoryInformation){
    	this.maintenanceHistoryInformation=maintenanceHistoryInformation;
    }
    function getMaintenanceHistoryInformation(){
    	return this.maintenanceHistoryInformation;
    }
    
    function setCustomerRelationInformation(customerRelationInformation){
    	this.customerRelationInformation=customerRelationInformation;
    }
    function getCustomerRelationInformation(){
    	return this.customerRelationInformation;
    }
    
    function setCustomizedInformation(customizedInformation){
    	this.customizedInformation=customizedInformation;
    }
    function getCustomizedInformation(){
    	return this.customizedInformation;
    }
    
    
    
    
    
    

});