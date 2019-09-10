'use strict';
app.controller('AcctEntryDetailModalCtrl',function ($scope,$modal,fmShareDataService,$timeout,$filter,toaster) {
    $scope.showAcctEntryDetailModal = function () {

        var acctTable = $('#tblAcctEntries').DataTable();

        if (acctTable.row('.active').length === 1) {

            //save the row which is selected
            fmShareDataService.setAcctEntryFilter(acctTable.row('.active').data());

            $modal.open({
                backdrop: 'static',
                templateUrl: 'acctEntryDetailModal.html',
                controller: 'AcctEntryDetailModalControl',
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

app.controller('AcctEntryDetailModalControl',function ($scope,fmShareDataService,$modalInstance,$http,$interval) {
    //针对下拉框出现的问题的解决方法
        var fixChosenItemIntervalTask = $interval(function () {
            if (angular.element('#dc_flag1').chosen !== undefined) {

                angular.element('#dc_flag1').chosen({allow_single_deselect: true});

                $interval.cancel(fixChosenItemIntervalTask);
            }
        });

    var fixChosenWidth = function () {
        var fixWidthIntervalTask = $interval(function () {
            if (angular.element('#dc_flag1').attr('style') !== undefined) {

                angular.element('#dc_flag1').css('width','100%');
                $interval.cancel(fixWidthIntervalTask);
            }
        }, 100);
    };


    //取消按钮的单击事件
    $scope.cancelAcctEntry = function () {
        $modalInstance.dismiss('cancel');
    }

    $scope.dcFlags1 = [
        {'value':'D','name':'借'},
        {'value':'C','name':'贷'}
    ];
    var keys = fmShareDataService.getAcctEntryFilter();
    console.log(keys.dc_flag);
    var param = {
        'acct_item':keys.acct_item,

    }

    $http({
        method: 'POST',
        url: FM_URL.FM_ACCTENTRYDETAIL_INQ,//直接访问clb-api
        data:{'megid': 'test',
            "user": 'test',
            "param": param,
            "correlid":'test'}
    }).then(function successCallback(response){
        if(response.status == 200){//查询成功
            console.log(response);
            var result = response.data.data;

            //页面初始化
            $scope.tran_id1 = result.tran_id;
            $scope.acct_item1 = result.acct_item;
            $scope.cond_seq1 = result.cond_seq;
            // angular.element('#dc_flag1').val(keys.dc_flag).trigger('chosen:updated');
            angular.element('#dc_flag').val(result.dc_flag).trigger('chosen:updated');
            $scope.acct_org1 = result.acct_org;
            $scope.tran_amt_point1 = result.tran_amt_point;
            $scope.item_seq1 = result.item_seq;
            $scope.tran_desp1 = result.tran_desp;
        }
    });








})