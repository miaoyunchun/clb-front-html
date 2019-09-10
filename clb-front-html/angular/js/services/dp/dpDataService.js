'use strict';

app.factory('dpDataService', function ($filter) {
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