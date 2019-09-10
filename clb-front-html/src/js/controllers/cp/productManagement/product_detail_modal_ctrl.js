'use strict';
//打開产品详细信息的按鈕，彈出一個modal框
app.controller('ProductDetailModalCtrl',function ($scope,$modal,$timeout,$filter,cpShareDataService,toaster) {
    $scope.showProductDetailPopup = function () {
        var proTable = $('#tblProducts').DataTable();

        // If a row is selected
        if (proTable.row('.active').length === 1) {
            //save the row which is selected
            cpShareDataService.common.setChosenRowData(proTable.row('.active').data());

            $modal.open({
                backdrop: 'static',
                templateUrl: 'productDetailModal.html',
                controller: 'ProductDetailModalControl',
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
});

app.controller('ProductDetailModalControl',function ($scope,$modalInstance,cpShareDataService,$http) {
    //cancel按钮的事件
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //进入modal框自动加载选择的产品的信息
    var productID = cpShareDataService.common.getChosenRowData().product_id;
    var param = {
        'product_id':productID
    }
    $http({
        method: 'POST',
        url: CP_URL.CP_PRO_INQ,//直接访问clb-api
        data:{'megid': 'test',
            "user": 'test',
            "param": param,
            "correlid":'test'}
    }).then(function successCallback(response){
        if(response.status == 200){//查询成功

            var productInfo = response.data.data;
            console.log(productInfo);
            $scope.product_id = productInfo.product_id;
            $scope.product_name = productInfo.product_name;
            $scope.associate_org_id = productInfo.associate_org_id;
            $scope.subject_number = productInfo.subject_number;
            angular.element('#product_type').val(productInfo.product_type).trigger('chosen:updated');
            $scope.product_code = productInfo.product_code;
            angular.element('#product_ccy').val(productInfo.product_ccy).trigger('chosen:updated');
            angular.element('#currency_support').val(productInfo.currency_support).trigger('chosen:updated');
            $scope.multi_nstance = productInfo.multi_nstance;
            angular.element('#card_issurance').val(productInfo.card_issurance).trigger('chosen:updated');
            $scope.account_control = productInfo.account_control;
            $scope.card_control = productInfo.card_control;
            $scope.fee_control = productInfo.fee_control;
            $scope.interest_control = productInfo.interest_control;
            $scope.dp_control = productInfo.dp_control;
            $scope.last_maint_date = productInfo.last_maint_date;
        }
    });


    $scope.proTypes = [
        {'value':'1','name':'信用卡'},
        {'value':'2','name':'贷款'},
        {'value':'3','name':'存款'},
    ];
    $scope.proCcys = [
        {'value':'CNY','name':'人民币'},
        {'value':'USD','name':'美元'},
        {'value':'JPY','name':'日元'}
    ];

    $scope.currencySups = [
        {'value':'1','name':'单币种'},
        {'value':'2','name':'多币种'}
    ];
    $scope.cardIssurances = [
        {'value':'1','name':'必须有卡'},
        {'value':'2','name':'可选'},
        {'value':'3','name':'无需卡'}
    ];

});