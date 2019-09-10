'use strict';

/* Controllers */

app
// Flot Chart controller
    .controller('FlotChartDemoCtrl', ['$scope', '$timeout', '$translate', function ($scope, $timeout, $translate) {
        $scope.d = [[1, 6.5], [2, 6.5], [3, 7], [4, 8], [5, 7.5], [6, 7], [7, 6.8], [8, 7], [9, 7.2], [10, 7], [11, 6.8], [12, 7]];

        $scope.d0_1 = [[0, 7], [1, 6.5], [2, 12.5], [3, 7], [4, 9], [5, 6], [6, 11], [7, 6.5], [8, 8], [9, 7]];

        $scope.d0_2 = [[0, 4], [1, 4.5], [2, 7], [3, 4.5], [4, 3], [5, 3.5], [6, 6], [7, 3], [8, 4], [9, 3]];

        $scope.d1_1 = [[10, 120], [20, 70], [30, 70], [40, 60]];

        $scope.d1_2 = [[10, 50], [20, 60], [30, 90], [40, 35]];

        $scope.d1_3 = [[10, 80], [20, 40], [30, 30], [40, 20]];

        $scope.d2 = [];

        for (var i = 0; i < 20; ++i) {
            $scope.d2.push([i, Math.round(Math.sin(i) * 100) / 100]);
        }

        $scope.d3 = [
            {label: 'iPhone5S', data: 40},
            {label: 'iPad Mini', data: 10},
            {label: 'iPad Mini Retina', data: 20},
            {label: 'iPhone4S', data: 12},
            {label: 'iPad Air', data: 18}
        ];

        $scope.refreshData = function () {
            $scope.d0_1 = $scope.d0_2;
        };

        $scope.getRandomData = function () {
            var data        = [],
                totalPoints = 150;
            if (data.length > 0)
                data = data.slice(1);
            while (data.length < totalPoints) {
                var prev = data.length > 0 ? data[data.length - 1] : 50,
                    y    = prev + Math.random() * 10 - 5;
                if (y < 0) {
                    y = 0;
                } else if (y > 100) {
                    y = 100;
                }
                data.push(Math.round(y * 100) / 100);
            }
            // Zip the generated y values with the x values
            var res = [];
            for (var i = 0; i < data.length; ++i) {
                res.push([i, data[i]]);
            }
            return res;
        };

        $scope.d4 = $scope.getRandomData();

        // 因为后台的语言标志中，中文为zh_cn，
        // 但前端的中文标志为 zh_CN
        // 故在此做一下转换
        var langType = sessionStorage.getItem('langType');
        $translate.use(langType === 'zh_cn' ? 'zh_CN' : langType);
        /* //菜单权限
         $scope.showMenu= function(){
             //获取页面上所有带  menu 属性的元素
             var menus=$('[menu]');
             //遍历menus，依次处理
             $.each(menus,function(i,menu){
                 menu=$(menu);
                 //拿到menu的值
                 var menuId=menu.attr('menu');
                 //获取用户的菜单Id
                 var menuIds=sessionStorage.getItem("menuIds");
                 //判断是否隐藏
                 if(menuIds.indexOf(menuId)<0){
                     menu.hide();
                 }
                 console.log(menuId);
                 console.log(menuIds);
             })
         }
         $timeout(function(){
             $scope.showMenu();
         },500)*/
    }]);


