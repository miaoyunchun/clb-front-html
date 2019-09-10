'use strict';
//打開添加新機構的按鈕，彈出一個modal框
app.controller('AddOrganizationModalInstanceCtrl',function ($scope,$modal) {
    $scope.showAddOrganizationPopup = function () {
        $modal.open({
            backdrop: 'static',
            templateUrl: 'addOrganizationModal.html',
            controller: 'OrganizationAddModalControl',
            size: 'lg'
        });
    }
});


app.controller('OrganizationAddModalControl',function ($scope,$modalInstance,$http,$timeout,$interval,$filter) {

    $scope.fields = {
        org_id:'',
        org_name:'',
        //下拉框
        process_with_system:'',
        process_status:'',
        work_of_week:'',
        eom_eoy_flag:'',

        curr_proc_date:'',
        last_proc_date:'',
        next_proc_date:'',
        accr_thru_date:'',
        last_accr_date:'',
        last_maint_date:'',
        publicHoliday1:'',
        publicHoliday2:'',
        publicHoliday3:'',
        publicHoliday4:'',
        publicHoliday5:'',
        publicHoliday6:'',
        publicHoliday7:'',
        publicHoliday8:'',
        publicHoliday9:'',
        publicHoliday10:'',
        publicHoliday11:'',
        publicHoliday12:'',
        publicHoliday13:'',
        publicHoliday14:'',
        publicHoliday15:'',
        publicHoliday16:'',
        publicHoliday17:'',
        publicHoliday18:'',
        publicHoliday19:'',
        publicHoliday20:'',
        publicHoliday21:'',
        publicHoliday22:'',
        publicHoliday23:'',
        publicHoliday24:'',
        publicHoliday25:'',
        publicHoliday26:'',
        publicHoliday27:'',
        publicHoliday28:'',
        publicHoliday29:'',
        publicHoliday30:''
    }
    var PROCESS_WITH_SYSTEM = "a96c6c40f6d548a093905a2823757288";//系统参数
    var PROCESS_STATUS = "8fa8c6bb2d7c4ccfbe2f2653bcacdc3a";//机构参数状态下拉框id
    var WORK_OF_WEEK = "94047c2f2ee548069a9c9c0ee5a35f76";//一周执行天数
    var EOM_EOY_FLAG = "7ea4808a651f4cacab9b531b2f93aad3";//执行日期标志

    //加载下拉框
    angular.element(function () {
        //系统参数
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: PROCESS_WITH_SYSTEM
            }
        }).then(function (response) {
            var responseData = response.data;
            console.log(responseData);
            if (responseData.flag === 'success') {
                // $scope.selectedDocumentType = responseData.optValueList;
                $scope.processWithSystem = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });

//机构参数状态
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: PROCESS_STATUS
            }
        }).then(function (response) {
            var responseData = response.data;
            // console.log(responseData);
            if (responseData.flag === 'success') {
                // $scope.selectedDocumentType = responseData.optValueList;
                $scope.processStatus = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });

        //一周执行天数
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: WORK_OF_WEEK
            }
        }).then(function (response) {
            var responseData = response.data;
            // console.log(responseData);
            if (responseData.flag === 'success') {
                // $scope.selectedDocumentType = responseData.optValueList;
                $scope.workOfWeek = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });

        //执行日期标志
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
            params: {
                optId: EOM_EOY_FLAG
            }
        }).then(function (response) {
            var responseData = response.data;
            // console.log(responseData);
            if (responseData.flag === 'success') {
                // $scope.selectedDocumentType = responseData.optValueList;
                $scope.emoEoyFag = responseData.optValueList;
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });

    })

    //下拉框内容改变事件
    //系统参数
    $scope.selectedProcessWithSystem = {};
    $scope.processWithSystemSelectOnChange = function () {
        $scope.fields.process_with_system = $scope.selectedProcessWithSystem.item.key;
    }
    //机构参数状态
    $scope.selectedProcessStatus = {};
    $scope.processStatusSelectOnChange = function () {
        $scope.fields.process_status = $scope.selectedProcessStatus.item.key;
    }
    //一周执行天数
    $scope.selectedWorkOfWeek = {};
    $scope.workOfWeekSelectOnChange = function () {
        $scope.fields.work_of_week = $scope.selectedWorkOfWeek.item.key;
    }
    //执行日期标志
    $scope.selectedEomEoyFlag = {};
    $scope.eomEoyFlagSelectOnChange = function () {
        $scope.fields.eom_eoy_flag = $scope.selectedEomEoyFlag.item.key;
    }

    $scope.isFormDisabled = false;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //输入主键检测是否插入重复
    $scope.blur = function () {
        var param = getFormData(angular.element('#formAddOrganization'));
        console.log(param);
        $http({
            method: 'POST',
            url: CP_URL.CP_ORG_INQ,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
        }).then(function successCallback(response) {
            if(response.status == 200){//查询成功

                if(response.data.data != null){

                    //机构已存在，弹出提示
                    $scope.alerts = [];
                    addExistAlert();

                }else{

                    $scope.alerts = [];

                    var now = new Date();
                    $scope.fields.last_maint_date = $filter('date')(now,'yyyy-MM-dd');

                }

            }
        });

    }
    //点击add按钮添加新机构
    $scope.add = function () {
        var param = getFormData(angular.element('#formAddOrganization'));//添加机构的表信息
        // console.log(param);
        //将下拉框的值放到param中
        param.process_with_system = $scope.fields.process_with_system;
        param.process_status = $scope.fields.process_status;
        param.work_of_week = $scope.fields.work_of_week;
        param.eom_eoy_flag = $scope.fields.eom_eoy_flag;
        console.log(param);
        $http({
            method: 'POST',
            url: CP_URL.CP_ORG_ADD,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
        }).then(function successCallback(response) {
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

                    angular.element('#tblOrgs').DataTable().ajax.reload(null, false);
                }else{
                    $scope.alerts = [];
                    addFailAlert();

                    $timeout(function () {
                        $scope.alerts = [];
                    },3000);
                }
            }
        });
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

// Alert when the organization is existed
    var addExistAlert = function (message) {
        $scope.alerts.push({
            type:'danger',
            msg:'该机构已存在'
        });
    }


});





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