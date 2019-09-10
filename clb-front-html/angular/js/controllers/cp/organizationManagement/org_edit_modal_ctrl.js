'use strict';

app.controller('EditOrganizationModalInstanceCtrl',function ($scope,$modal,$timeout,$filter,toaster,cpShareDataService,$http,$rootScope) {

    //点击修改按钮弹出modal框
    $scope.showEditOrganizationPopup = function () {
        var orgTable = $('#tblOrgs').DataTable();

        // If a row is selected
        if (orgTable.row('.active').length === 1) {
            //save the row which is selected
            cpShareDataService.common.setChosenRowData(orgTable.row('.active').data());

            $modal.open({
                backdrop: 'static',
                templateUrl: 'editOrganizationModal.html',
                controller: 'OrganizationEditModalControl',
                size: 'lg'
            });


            var PROCESS_WITH_SYSTEM = "a96c6c40f6d548a093905a2823757288";//系统参数
            var PROCESS_STATUS = "8fa8c6bb2d7c4ccfbe2f2653bcacdc3a";//机构参数状态下拉框id
            var WORK_OF_WEEK = "94047c2f2ee548069a9c9c0ee5a35f76";//一周执行天数
            var EOM_EOY_FLAG = "7ea4808a651f4cacab9b531b2f93aad3";//执行日期标志
            var processWithSystem1 = [];
            var processStatus1 = [];
            var workOfWeek1 = [];
            var eomEoyFlag1 = [];
            //加载下拉框
            // angular.element(function () {
            //系统参数
            $http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'select/queryOptValueWithFilter',
                params: {
                    optId: PROCESS_WITH_SYSTEM
                }
            }).then(function (response) {
                var responseData = response.data;
                if (responseData.flag === 'success') {
                    // $scope.selectedDocumentType = responseData.optValueList;
                    processWithSystem1 = responseData.optValueList;
                    cpShareDataService.setProcessWithSystem(processWithSystem1);
                    $rootScope.processWithSystem = responseData.optValueList;
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
                if (responseData.flag === 'success') {
                    processStatus1 = responseData.optValueList;
                    cpShareDataService.setProcessStatus(processStatus1);
                    // console.log(cpShareDataService.getProcessStatus());
                    $rootScope.processStatus = responseData.optValueList;
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
                if (responseData.flag === 'success') {
                    workOfWeek1 = responseData.optValueList;
                    cpShareDataService.setWorkOfWeek(workOfWeek1);
                    $rootScope.workOfWeek = responseData.optValueList;
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
                if (responseData.flag === 'success') {
                    eomEoyFlag1 = responseData.optValueList;
                    cpShareDataService.setEomEoyFlag(eomEoyFlag1);
                    $rootScope.emoEoyFag = responseData.optValueList;
                }
            }, function () {
                toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
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

//用于初始化该modal框的controller
app.controller('OrganizationEditModalControl',function ($scope,$modalInstance,cpShareDataService,$http,$timeout,$interval,$filter,$rootScope) {


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



    //cancel按钮对应的方法
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    //根据获得的主键查询部门的具体信息
    // angular.element(function () {
        var org_id = cpShareDataService.common.getChosenRowData().org_id;
        var param = {
            'org_id':org_id
        };
        $http({
            method: 'POST',
            url: CP_URL.CP_ORG_INQ,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
        }).then(function successCallback(response) {

            if (response.status == 200) {//查询成功

                if (response.data.data != null) {
                    var org = response.data.data;
                    console.log(org);
                    $scope.fields.org_id = org.org_id;
                    $scope.fields.org_name = org.org_name;
                    // console.log(org.process_with_system);
                    // org.process_status;
                    // org.work_of_week;
                    // org.eom_eoy_flag;
                    $scope.fields.process_with_system = org.process_with_system;
                    for(var i = 0;i < $scope.processWithSystem.length;i++){
                        if($scope.processWithSystem[i].key == org.process_with_system){
                            $scope.selectedProcessWithSystem.item = $scope.processWithSystem[i];
                        }
                    };

                    $scope.fields.process_status = org.process_status;
                    for(var i = 0;i < $scope.processStatus.length;i++){
                        if($scope.processStatus[i].key == org.process_status){
                            $scope.selectedProcessStatus.item = $scope.processStatus[i];
                        }
                    };

                    $scope.fields.work_of_week = org.work_of_week;
                    for(var i = 0;i < $scope.workOfWeek.length;i++){
                        if($scope.workOfWeek[i].key == org.work_of_week){
                            $scope.selectedWorkOfWeek.item = $scope.workOfWeek[i];
                        }
                    };

                    $scope.fields.eom_eoy_flag = org.eom_eoy_flag;
                    for(var i = 0;i < $scope.emoEoyFag.length;i++){
                        if($scope.emoEoyFag[i].key == org.eom_eoy_flag){
                            $scope.selectedEomEoyFlag.item = $scope.emoEoyFag[i];
                        }
                    }
                    $scope.fields.curr_proc_date = org.curr_proc_date;
                    $scope.fields.last_proc_date = org.last_proc_date;
                    $scope.fields.next_proc_date = org.next_proc_date;
                    $scope.fields.accr_thru_date = org.accr_thru_date;
                    $scope.fields.last_accr_date = org.last_accr_date;
                    $scope.fields.next_accr_date = org.next_accr_date;

                    var now = new Date();
                    $scope.fields.last_maint_date = $filter('date')(now,'yyyy-MM-dd');

                    $scope.fields.public_holiday1 = org.public_holiday1;
                    $scope.fields.public_holiday2 = org.public_holiday2;
                    $scope.fields.public_holiday3 = org.public_holiday3;
                    $scope.fields.public_holiday4 = org.public_holiday4;
                    $scope.fields.public_holiday5 = org.public_holiday5;
                    $scope.fields.public_holiday6 = org.public_holiday6;
                    $scope.fields.public_holiday7 = org.public_holiday7;
                    $scope.fields.public_holiday8 = org.public_holiday8;
                    $scope.fields.public_holiday9 = org.public_holiday9;
                    $scope.fields.public_holiday10 = org.public_holiday10;
                    $scope.fields.public_holiday11 = org.public_holiday11;
                    $scope.fields.public_holiday12 = org.public_holiday12;
                    $scope.fields.public_holiday13 = org.public_holiday13;
                    $scope.fields.public_holiday14 = org.public_holiday14;
                    $scope.fields.public_holiday15 = org.public_holiday15;
                    $scope.fields.public_holiday16 = org.public_holiday16;
                    $scope.fields.public_holiday17 = org.public_holiday17;
                    $scope.fields.public_holiday18 = org.public_holiday18;
                    $scope.fields.public_holiday19 = org.public_holiday19;
                    $scope.fields.public_holiday20 = org.public_holiday20;
                    $scope.fields.public_holiday21 = org.public_holiday21;
                    $scope.fields.public_holiday22 = org.public_holiday22;
                    $scope.fields.public_holiday23 = org.public_holiday23;
                    $scope.fields.public_holiday24 = org.public_holiday24;
                    $scope.fields.public_holiday25 = org.public_holiday25;
                    $scope.fields.public_holiday26 = org.public_holiday25;
                    $scope.fields.public_holiday27 = org.public_holiday27;
                    $scope.fields.public_holiday28 = org.public_holiday28;
                    $scope.fields.public_holiday29 = org.public_holiday29;
                    $scope.fields.public_holiday30 = org.public_holiday30;



                }
            }
        });
    // })



    $scope.edit = function () {
        var param = getFormData(angular.element('#formEditOrganization'));
        //将下拉框的值放到param中
        param.process_with_system = $scope.fields.process_with_system;
        param.process_status = $scope.fields.process_status;
        param.work_of_week = $scope.fields.work_of_week;
        param.eom_eoy_flag = $scope.fields.eom_eoy_flag;
        $http({
            method: 'POST',
            url: CP_URL.cp_ORG_UPD,//直接访问clb-api
            data:{'megid': 'test',
                "user": 'test',
                "param": param,
                "correlid":'test'}
        }).then(function successCallback(response) {

            if (response.status == 200) {//查询成功

                if (response.data.code === '0000') {
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
        })
    }






    // //下面定义的几个数组按道理是要从数据库查询，但暂时不动后台，所以就僵硬的写死了，后续再改！！！！
    // $scope.PWSs = [
    //     {'value':'Y','name':'参考系统参数日期'},
    //     {'value':'N','name':'自定义日期'}
    // ];
    //
    // $scope.workDays = [
    //     {'value':'0','name':'0天'},
    //     {'value':'1','name':'1天'},
    //     {'value':'2','name':'2天'},
    //     {'value':'3','name':'3天'},
    //     {'value':'4','name':'4天'},
    //     {'value':'5','name':'5天'},
    //     {'value':'6','name':'6天'},
    //     {'value':'7','name':'7天'}
    // ];
    //
    // $scope.flags = [
    //     {'value':'M','name':'月末'},
    //     {'value':'Y','name':'年末'},
    //     {'value':'F','name':'月初'},
    //     {'value':'N','name':'未定义'}
    // ];
    //
    // $scope.PSs = [
    //     {'value':'0','name':'正常'},
    //     {'value':'1','name':'一小時后'},
    //     {'value':'2','name':'小批量'}
    // ];

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




