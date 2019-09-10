'use strict';
//打开科目详情的modal框
app.controller('ItemDetailModalCtrl',function ($scope,$modal,$timeout,fmShareDataService,toaster,$filter) {
    $scope.showItemDetailModal = function () {
        var subTable = $('#itemDetailList').DataTable();

        // If a row is selected
        if (subTable.row('.active').length === 1) {

            //save the row which is selected
            fmShareDataService.setItemDetailFiler(subTable.row('.active').data());
            
            $modal.open({
                 backdrop: 'static',
                 templateUrl: 'itemDetailModal.html',
                 controller: 'ItemDetailModalControl',
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

app.controller('ItemDetailModalControl',function ($scope,$interval,$modalInstance,$timeout,$http,fmShareDataService,$filter) {
    var msg=undefined;
	$scope.fields = {
    	txn_jour_t:undefined,
    	txn_time:undefined,
    	txn_descrip:undefined,
    	item_bal:undefined,
    	txn_instin:undefined,
    	txn_fxr:undefined,
    	dscrp_cod:undefined,
    	txn_unit:undefined,
    	txn_date_t:undefined,
    	doc_type:undefined,
    	txn_amt:undefined,
    	opr_nbr:undefined,
    	val_date:undefined,
    	second_amt:undefined,
    	txn_seq_nbr:undefined,
    	txn_type:undefined,
    	doc_nbr:undefined,
    	dc_cod:undefined,
    	rchr_nbr:undefined,
    	recon_nbr:undefined,
    	second_bal:undefined,
    	doc_end_no:undefined
	}

    //取消按钮事件
    $scope.cancelItem = function () {
        $modalInstance.dismiss('cancel');
    }

    //开启modal框时给页面初始化
    //获得选中的行的查询条件
    //"param":{"txn_jour":"12345678901234567891"}   VBS-FM-ITEMD-INQ
    var txn_jour_t=fmShareDataService.getItemDetailFiler().txn_jour_t;
    var txn_seq=fmShareDataService.getItemDetailFiler().txn_seq;
    var param = {
    	txn_jour:txn_jour_t+txn_seq
    };
    console.log(param);

    $http({
        method: 'POST',
        url:FM_URL.FM_ITEMD_INQ,//直接访问clb-api
        data:{'megid': 'test',
            "user": 'test',
            "param": param,
            "correlid":'test'}
    }).then(function successCallback(response){
        if(response.status == 200){//查询成功
        	console.log('结果');
            console.log(response);
            var itemDetailInfo=response.data.data;
            console.log(itemDetailInfo);
            if(response.data.code=="0000"){
            	//初始化modal框
                $scope.fields.txn_jour_t = itemDetailInfo.txn_jour_t;
                $scope.fields.txn_time = itemDetailInfo.txn_time;
                $scope.fields.txn_descrip = itemDetailInfo.txn_descrip;
                $scope.fields.item_bal = itemDetailInfo.item_bal;
                $scope.fields.txn_instin = itemDetailInfo.txn_instin;
                $scope.fields.txn_fxr = itemDetailInfo.txn_fxr;
                $scope.fields.dscrp_cod = itemDetailInfo.dscrp_cod;
                $scope.fields.txn_unit = itemDetailInfo.txn_unit;
                $scope.fields.txn_date_t = itemDetailInfo.txn_date_t;
                $scope.fields.doc_type = itemDetailInfo.doc_type;
                $scope.fields.txn_amt = itemDetailInfo.txn_amt;
                $scope.fields.opr_nbr = itemDetailInfo.opr_nbr;
                $scope.fields.val_date = itemDetailInfo.val_date;
                $scope.fields.second_amt = itemDetailInfo.second_amt;
                $scope.fields.txn_seq_nbr = itemDetailInfo.txn_seq_nbr;
                $scope.fields.txn_type = itemDetailInfo.txn_type;
                $scope.fields.doc_nbr = itemDetailInfo.doc_nbr;
                $scope.fields.dc_cod = itemDetailInfo.dc_cod;
                $scope.fields.rchr_nbr = itemDetailInfo.rchr_nbr;
                $scope.fields.recon_nbr = itemDetailInfo.recon_nbr;
                $scope.fields.second_bal = itemDetailInfo.second_bal;
                $scope.fields.doc_end_no = itemDetailInfo.doc_end_no;
            }else{
            	msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_DETAIL_FAIL');
                $scope.alerts = [];
                detailFailAlert();

                $timeout(function () {
                    $scope.alerts = [];
                },3000);
            }
            
        }else{
    		msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_CONNECT_FAIL');
            $scope.alerts = [];
            detailFailAlert();
            $timeout(function () {
                $scope.alerts = [];
            },3000);
        }
    },function errorCallback(response){//请求失败时执行代码
		msg=$filter('translate')('pages.fm.TRAD_LIST.ALERTS_CONNECT_FAIL');
        $scope.alerts = [];
        detailFailAlert();
        $timeout(function () {
            $scope.alerts = [];
        },3000);
	});
    $scope.alerts = [];
// 当操作成功时弹窗
   var detailSuccessAlert = function () {
       $scope.alerts.push({
           type: 'success',
           msg: msg
       });
   };
//操作失败时弹窗
   var detailFailAlert = function (message) {
       $scope.alerts.push({
           type: 'danger',
           msg: msg
       });
   }; 
})