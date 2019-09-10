'use strict';

app.controller('BtnDeleteModalCtrl',function(){
	
});


app.controller('DeleteBtnModalInstanceCtrl',function($scope, $modal, $filter, toasterUtils, shareDataService){
	$scope.showDeletePosPopup = function(){
		 var table = angular.element('#tblButtons').DataTable();

	        if (table.row('.active').length === 1) {
	            shareDataService.common.setSelectedRowItems(table.row('.active').data());

	            // debugger;

	            $modal.open({
	                backdrop   : 'static',
	                templateUrl: 'deleteBtnModal.html',
	                controller : 'BtnDeleteModalCtrl',
	                size       : 'lg'
	            });
	        } else {
	            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
	        }
	};
});