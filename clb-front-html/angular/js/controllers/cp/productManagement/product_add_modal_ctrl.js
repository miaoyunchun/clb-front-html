'use strict';
//打開添加新产品的按鈕，彈出一個modal框
app.controller('AddProductModalCtrl',function ($scope,$modal) {
    $scope.showAddProductPopup = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addProductModal.html',
            controller: 'ProductAddModalControl',
            size: 'lg'
        });
    }
});
//被指定的控制该modal框的controller
app.controller('ProductAddModalControl',function ($scope,$modalInstance,$http,$timeout,$filter) {


    $scope.alerts = [];
    $scope.isFormDisabled = false;

    $scope.fields = {
        productID:'',
        productName:'',
        associateOrgID:'',
        subjectNumber:'',
        productType:'',
        productCode:'',
        productCcy:'',
        currencySupport:'',
        multiNstance:'',
        cardIssurance:'',
        accountControl:'',
        cardControl:'',
        feeControl:'',
        interestControl:'',
        dpControl:'',
        lastMaintDate:''
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    //在输入产品号之后，查询是否存在该用户，存在就显示在页面上
    $scope.blur = function () {

        var param = getFormData(angular.element('#formAddProduct'));//添加产品的表信息
        $http({
            method: 'POST',
            url: CP_URL.CP_PRO_INQ,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
        }).then(function successCallback(response){
            if(response.status == 200){//与后台连接成功

                if(response.data.data != null){//查询到存在该产品
                    angular.element('#btnSave').disabled = true;
                    var result = response.data.data;
                    console.log(result);
                    //给页面赋值
                    $scope.product_name = result.product_name;
                    $scope.associate_org_id = result.associate_org_id;
                    $scope.subject_number = result.subject_number;
                    // $scope.product_type = result.product_type;
                    angular.element('#product_type').val(result.product_type).trigger('chosen:updated');
                    $scope.product_code = result.product_code;
                    angular.element('#product_ccy').val(result.product_ccy).trigger('chosen:updated');
                    angular.element('#currency_support').val(result.currency_support).trigger('chosen:updated');
                    $scope.multi_nstance = result.multi_nstance;
                    angular.element('#card_issurance').val(result.card_issurance).trigger('chosen:updated');
                    $scope.account_control = result.account_control;
                    $scope.card_control = result.card_control;
                    $scope.fee_control = result.fee_control;
                    $scope.interest_control = result.interest_control;
                    $scope.dp_control = result.dp_control;
                    $scope.last_maint_date = result.last_maint_date;
                    //产品已存在的提示
                    $scope.alerts = [];
                    addExistAlert();
                    // angular.element('#btnSave').attr('disabled') === true;

                }else{//没有查询到，除了主键框其他框都清空
                    $scope.product_name = '';
                    $scope.associate_org_id = '';
                    $scope.subject_number = '';
                    // $scope.product_type = '';
                    angular.element('#product_type').val('').trigger('chosen:updated');
                    $scope.product_code = '';
                    angular.element('#product_ccy').val('').trigger('chosen:updated');
                    angular.element('#currency_support').val('').trigger('chosen:updated');
                    $scope.multi_nstance = '';
                    angular.element('#card_issurance').val('').trigger('chosen:updated');
                    $scope.account_control = '';
                    $scope.card_control = '';
                    $scope.fee_control = '';
                    $scope.interest_control = '';
                    $scope.dp_control = '';

                    var now = new Date();
                    $scope.last_maint_date = $filter('date')(now,'yyyy-MM-dd');
                }
            }
        });

    }
//添加按钮的事件
    $scope.add = function () {
        var param1 = getFormData(angular.element('#formAddProduct'));//添加产品的表信息
        console.log(param1);
        $http({
            method: 'POST',
            url:CP_URL.CP_PRO_ADD,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": param1,
                "correlid":'test'}
        }).then(function successCallback(response){
            if(response.status == 200){//与后台交互成功
                console.log(response.data);
                if(response.data.code === '0000'){//插入成功
                    $scope.isFormDisabled = true;
                    //插入成功，弹出提示
                    $scope.alerts = [];
                    addSuccessAlert();

                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 5000);
                    angular.element('#tblProducts').DataTable().ajax.reload(null, false);
                }else{
                    $scope.alerts = [];
                    //插入失败
                    addFailAlert();


                }
            }
        });
    }







    $scope.proTypes = [
        {'value':'1','name':'信用卡'},
        {'value':'2','name':'贷款'},
        {'value':'3','name':'存款'},
    ];
    $scope.proCcys = [
        {'value':'CNY','name':'人民币'},
        {'value':'USD','name':'美元'},
        {'value':'JPY','name':'日元'},
    ];

    $scope.currencySups = [
        {'value':'1','name':'单币种'},
        {'value':'2','name':'多币种'},
    ];

    $scope.cardIssurances = [
        {'value':'1','name':'必须有卡'},
        {'value':'2','name':'可选'},
        {'value':'3','name':'无需卡'},
    ];

    $scope.alerts = [];
    // Alert when operation is successful
    var addSuccessAlert = function () {
        $scope.alerts.push({
            type: 'success',
            msg: '操作成功'
        });
    };


// Alert when operation failed
    var addFailAlert = function (message) {
        $scope.alerts.push({
            type: 'danger',
            msg: '操作失败'
        });
    };

//日历的插件
    app.controller('DateCtrl',function ($scope) {
        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        }
    });

    // Alert when the organization is existed
    var addExistAlert = function (message) {
        $scope.alerts.push({
            type:'danger',
            msg:'该产品id已存在，请重新设置'
        });
    }

});



