'use strict';

app.controller('acctDetailModalCtrl',function ($scope,$modal,$timeout,$filter,fmShareDataService) {

    $scope.showAcctDetailModal = function () {

        var tblAcctDetail = $('#tblAcctDetail').DataTable();

        if (tblAcctDetail.row('.active').length === 1) {

            //save the row which is selected
            fmShareDataService.setAcctingDetail(tblAcctDetail.row('.active').data());

            $modal.open({
                backdrop: 'static',
                templateUrl: 'acctingListDetailModal.html',
                controller: 'AcctingListDetailModalControl',
                size: 'lg'
            });
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

app.controller('AcctingListDetailModalControl',function ($scope,$modalInstance,$http,fmShareDataService) {
    $scope.dcflag = [
        {'value':'D','name':'借'},
        {'value':'C','name':'贷'}
    ]
    //取消按钮单击事件
    $scope.cancelAcctingDetail = function () {
        $modalInstance.dismiss('cancel');
    }

    var param = {
        tran_jour:fmShareDataService.getAcctingDetail().tran_jour,
        tran_seq:fmShareDataService.getAcctingDetail().tran_seq
    }
    console.log(param);

    $http({
        method: 'POST',
        url:FM_URL.FM_ACCTDETAIL_INQ ,//直接访问clb-api
        data:{'megid': 'test',
            "user": 'test',
            "param": param,
            "correlid":'test'}
    }).then(function successCallback(response){
        if(response.status == 200){//查询成功

            console.log(response);
            if(response.data.code == '0000'){
                var result = response.data.data;
                // //初始化modal框
                $scope.tran_jour = result.tran_jour;
                $scope.tran_seq = result.tran_seq;
                $scope.tran_id = result.tran_id;
                $scope.cond_seq = result.cond_seq;

                $scope.tran_date = result.tran_date;
                $scope.tran_time = result.tran_time;
                angular.element('#dc_flag').val(result.dc_flag).trigger('chosen:updated');
                $scope.acct_item = result.acct_item;

                $scope.acct_org = result.acct_org;
                $scope.tran_amt = result.tran_amt;
                $scope.item_seq = result.item_seq;
            }




        }
    });
})

