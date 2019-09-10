'use strict';

app.factory('lnShareDataService', function ($filter) {
	var common = {
	        selectedRowItems: {}
	    };
    
	 return {
	        common: {
	            setSelectedRowItems: setSelectedRowItems,
	            getSelectedRowItems: getSelectedRowItems
	        }
	 }
	 
	  /* Common items */
	    function setSelectedRowItems(_selectedRowItems) {
	        common.selectedRowItems = _selectedRowItems;
	    }

	    function getSelectedRowItems() {
	        return common.selectedRowItems;
	    }
});