'use strict';

app.controller('AddGeneralAcctingModalCtrl',function ($scope,$modal) {

    $scope.showAddGeneralAcctingModal = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addGeneralAcctingModal.html',
            controller: 'GeneralAcctingAddModalControl',
            size: 'lg'
        });
    }
})

app.controller('GeneralAcctingAddModalControl',function ($scope,$modalInstance,$http,$timeout) {

    $scope.billTypes = [
        {'value':'CNY','name':'人名币'},
        {'value':'USD','name':'美元'}
    ]

    $scope.balDireFlgs = [
        {'value':'0','name':'借方'},
        {'value':'1','name':'贷方'}
    ]

    $scope.crntPrdCDs = [
        {'value':'D','name':'借'},
        {'value':'C','name':'贷'},
    ]

    $scope.frezzStaus = [
        {'value':'0','name':'正常'},
        {'value':'1','name':'全额冻结'},
        {'value':'2','name':'部分冻结'}
    ]

    $scope.acctstatus = [
        {'value':'0','name':'正常'},
        {'value':'1','name':'清户'},
        {'value':'2','name':'模版'}
    ]
    $scope.intcFlgs = [
        {'value':'0','name':'不计息'},
        {'value':'1','name':'分段计息'},
        {'value':'2','name':'不分段计息'},
        {'value':'3','name':'协定户计息'},
        {'value':'4','name':'挂牌利率计息'},
    ]

    $scope.intcCycles = [
        {'value':'1','name':'按月'},
        {'value':'2','name':'按季'},
        {'value':'3','name':'按半年'},
        {'value':'4','name':'按年'},
    ]
    $scope.glPeroidUnits = [
        {'value':'M','name':'月'},
        {'value':'D','name':'天'},
        {'value':'Y','name':'年'},
        {'value':'W','name':'星期'},
        {'value':'N','name':'不定期'},
    ]

    $scope.glInstnInpLmt = [
        {'value':'1','name':'有权'},
        {'value':'0','name':'无权'}
    ]
    $scope.glInstnRcrdLmt = [
        {'value':'1','name':'有权'},
        {'value':'0','name':'无权'}
    ]
    $scope.glInstnClsaccLmt = [
        {'value':'1','name':'有权'},
        {'value':'0','name':'无权'}
    ]
    $scope.glAcctLmtRsv = [
        {'value':'1','name':'有权'},
        {'value':'0','name':'无权'}
    ]


//输入主键的blur事件，用来确定新添加的账务科目是否存在
    $scope.generalAcctIfExisted1 = function (){
        var param = getFormData(angular.element('#formAddGeneralAcct'));
        console.log(param);
        $http({
            method: 'POST',
            url: FM_URL.FM_GENERALACCTING_INQ,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
        }).then(function successCallback(response) {
            console.log(response);
            if(response.status == 200){//与后台交互成功
                var result = response.data;
                if(result.code === '0000'){//查询成功，存在
                    $scope.isFormDisabled = false;
                    //弹出存在提示
                    $scope.alerts = [];
                    existedAlert();

                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 5000);

                }else{ // 添加失败
                    $scope.alerts = [];
                }

            }else{                    //与后台交互失败
                $scope.alerts = [];
                errorConnect();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
            }



        })
    }

    //提交按钮的单击事件
    $scope.addGeneralAccting = function () {
        var param = getFormData(angular.element('#formAddGeneralAcct'));
        console.log(param);
        $http({
            method: 'POST',
            url: FM_URL.FM_GENERALACCTING_ADD,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
        }).then(function successCallback(response) {
            console.log(response);
            if(response.status == 200){//与后台交互成功
                var result = response.data;
                if(result.code === '0000'){//添加成功
                    $scope.isFormDisabled = true;
                    //弹出存在提示
                    $scope.alerts = [];
                    addSuccessAlert();

                    $timeout(function () {
                        $modalInstance.dismiss('cancel');
                    }, 5000);

                }else{ // 添加失败
                    $scope.isFormDisabled = false;
                    $scope.alerts = [];
                    addFailAlert();
                    $timeout(function () {
                        $scope.alerts = [];
                    },3000);
                }

            }else{                    //与后台交互失败
                $scope.alerts = [];
                errorConnect();
                $timeout(function () {
                    $scope.alerts = [];
                },3000);
            }



        })

    }


//取消按钮的单击事件
    $scope.cancelGeneralAccting = function () {
        $modalInstance.dismiss('cancel');
    }


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

    //添加的科目已存在时
    var existedAlert = function (message) {
        $scope.alerts.push({
            type:'danger',
            msg:'该科目编号已存在'
        });
    }
    //因网络原因操作失败
    var errorConnect = function (message) {
        $scope.alerts.push({
            type: 'danger',
            msg: '网络错误'
        });

    }
})




//日历的插件
app.controller('DateCtrl',function ($scope) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    }
});

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {

        // The value of the dropdown will be '? string: ?'
        // if the dropdown is not selected
        // Here we need to set it to an empty string
        if (n['value'] === '? string: ?') {
            n['value'] = '';
        }

        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}