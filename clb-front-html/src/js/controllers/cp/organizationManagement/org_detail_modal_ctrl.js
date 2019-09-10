'use strict';
//点击detail按钮弹出机构详情modal框
app.controller('OrganizationDetailModalInstanceCtrl',function ($scope,$modal,$timeout,$filter,toaster,cpShareDataService) {
    $scope.showOrganizationDetailPopup = function () {
        var orgTable = $('#tblOrgs').DataTable();

        // If a row is selected
        if (orgTable.row('.active').length === 1) {
            //save the row which is selected
            cpShareDataService.common.setChosenRowData(orgTable.row('.active').data());

            $modal.open({
                backdrop: 'static',
                templateUrl: 'organizationDetailModal.html',
                controller: 'OrganizationDetailModalControl',
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

app.controller('OrganizationDetailModalControl',function ($scope,$modalInstance,cpShareDataService,$http) {

    //取消按钮的作用
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //根据获得的主键查询部门的具体信息
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

        if(response.status == 200){//查询成功

            if(response.data.data != null){
                var org = response.data.data;

                $scope.org_id = org.org_id;
                $scope.org_name = org.org_name;
                angular.element('#process_with_system').val(org.process_with_system).trigger('chosen:updated');
                console.log(org.process_with_system);
                angular.element('#process_status').val(org.process_status).trigger('chosen:updated');
                angular.element('#work_of_week').val(org.work_of_week).trigger('chosen:updated');
                angular.element('#eom_eoy_flag').val(org.eom_eoy_flag).trigger('chosen:updated');
                $scope.curr_proc_date = org.curr_proc_date;
                $scope.last_proc_date = org.last_proc_date;
                $scope.next_proc_date = org.next_proc_date;
                $scope.accr_thru_date = org.accr_thru_date;
                $scope.last_accr_date = org.last_accr_date;
                $scope.last_maint_date = org.last_maint_date;
                $scope.public_holiday1 = org.public_holiday1;
                $scope.public_holiday2 = org.public_holiday2;
                $scope.public_holiday3 = org.public_holiday3;
                $scope.public_holiday4 = org.public_holiday4;
                $scope.public_holiday5 = org.public_holiday5;
                $scope.public_holiday6 = org.public_holiday6;
                $scope.public_holiday7 = org.public_holiday7;
                $scope.public_holiday8 = org.public_holiday8;
                $scope.public_holiday9 = org.public_holiday9;
                $scope.public_holiday10 = org.public_holiday10;
                $scope.public_holiday11 = org.public_holiday11;
                $scope.public_holiday12 = org.public_holiday12;
                $scope.public_holiday13 = org.public_holiday13;
                $scope.public_holiday14 = org.public_holiday14;
                $scope.public_holiday15 = org.public_holiday15;
                $scope.public_holiday16 = org.public_holiday16;
                $scope.public_holiday17 = org.public_holiday17;
                $scope.public_holiday18 = org.public_holiday18;
                $scope.public_holiday19 = org.public_holiday19;
                $scope.public_holiday20 = org.public_holiday20;
                $scope.public_holiday21 = org.public_holiday21;
                $scope.public_holiday22 = org.public_holiday22;
                $scope.public_holiday23 = org.public_holiday23;
                $scope.public_holiday24 = org.public_holiday24;
                $scope.public_holiday25 = org.public_holiday25;
                $scope.public_holiday26 = org.public_holiday25;
                $scope.public_holiday27 = org.public_holiday27;
                $scope.public_holiday28 = org.public_holiday28;
                $scope.public_holiday29 = org.public_holiday29;
                $scope.public_holiday30 = org.public_holiday30;

            }
        }

        })





    //下面定义的几个数组按道理是要从数据库查询，但暂时不动后台，所以就僵硬的写死了，后续再改！！！！
    $scope.PWSs = [
        {'value':'Y','name':'参考系统参数日期'},
        {'value':'N','name':'自定义日期'}
    ];

    $scope.workDays = [
        {'value':'0','name':'0天'},
        {'value':'1','name':'1天'},
        {'value':'2','name':'2天'},
        {'value':'3','name':'3天'},
        {'value':'4','name':'4天'},
        {'value':'5','name':'5天'},
        {'value':'6','name':'6天'},
        {'value':'7','name':'7天'}
    ];

    $scope.flags = [
        {'value':'M','name':'月末'},
        {'value':'Y','name':'年末'},
        {'value':'F','name':'月初'},
        {'value':'N','name':'未定义'}
    ];

    $scope.PSs = [
        {'value':'0','name':'正常'},
        {'value':'1','name':'一小時后'},
        {'value':'2','name':'小批量'}
    ];

});