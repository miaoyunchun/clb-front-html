'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController',
    ['$scope', '$http', '$state', '$filter','$translate',
        function ($scope, $http, $state, $filter,$translate) {
            $scope.user = {};
            $scope.authError = null;
            $scope.arrLangs = [];
            $scope.selectedLang = {};
            $scope.selectedLang.langId = localStorage.getItem('NG_TRANSLATE_LANG_KEY') || $scope.arrLangs[0]['langId'];

            $scope.onLangTypeSelected = function () {
                $scope.user.langType = $scope.selectedLang.langId;
            };

            $scope.login = function () {
            	
                $scope.authError = null;

                $http({
                    method: 'POST',
                    url   : CLB_FRONT_BASE_URL + 'login/loginCheck',
                    params: {
                        'username': $scope.user.username,
                        'password': $scope.user.password,
                        'LangType': $scope.user.langType
                    }
                }).then(
                    function successfulCallback(response) {
                    	 var menuIds=response['data']['menuIds'];
                        if (response.data.flag === 'success' && menuIds!=null) {
                            var userInfo = response['data']['userInfoList'][0];
                            $.each(userInfo, function (index, value) {
                                sessionStorage.setItem(index.toString(), value.toString());
                                $state.go('app.dashboard-v2');
                            });
                            sessionStorage.setItem('langType', $scope.user.langType.toLowerCase());
                           //菜单权限ID
                            sessionStorage.setItem('menuIds',menuIds);
                          
                        } else {
                        	if(response.data.flag === 'success'){
                            	$scope.authError = response.data.message || $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_NO_AUTHORITY');
                            }else{
                            	$scope.authError = response.data.message || $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_LOGIN_FAILED');
                            }
                        }
                      //国际化
                   	 var langType = sessionStorage.getItem('langType');
                        $translate.use(langType === 'zh_cn' ? 'zh_CN' : langType);
                    }, function errorCallback() {
                        $scope.authError = $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_LOGIN_FAILED_DUE_TO_NETWORK_FAIL');
                    }
                );
            };

            angular.element(function () {
                $.each($scope.langs, function (index, item) {
                    $scope.arrLangs.push({
                        langId  : index,
                            langName: item
                    });
                });
                $scope.onLangTypeSelected();
            });
        }]
);
