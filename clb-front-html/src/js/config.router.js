'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {

                $urlRouterProvider
                    .otherwise('/app/dashboard-v2');
                $stateProvider
                    .state('app', {
                        abstract   : true,
                        url        : '/app',
                        templateUrl: 'tpl/app.html'
                    })
                    .state('app.dashboard-v1', {
                        url        : '/dashboard-v1',
                        templateUrl: 'tpl/app_dashboard_v1.html',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/controllers/chart.js']);
                                }]
                        }
                    })
                    .state('app.dashboard-v2', {
                        url        : '/dashboard-v2',
                        templateUrl: 'tpl/app_dashboard_v2.html',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['js/controllers/chart.js']);
                                }]
                        }
                    })
                   
                    .state('app.ui.toaster', {
                        url        : '/toaster',
                        templateUrl: 'tpl/ui_toaster.html',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('toaster').then(
                                        function () {
                                            return $ocLazyLoad.load('js/controllers/toaster.js');
                                        }
                                    );
                                }]
                        }
                    })
                    .state('app.ui.jvectormap', {
                        url        : '/jvectormap',
                        templateUrl: 'tpl/ui_jvectormap.html',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load('js/controllers/vectormap.js');
                                }]
                        }
                    })
                    .state('app.ui.googlemap', {
                        url        : '/googlemap',
                        templateUrl: 'tpl/ui_googlemap.html',
                        resolve    : {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load([
                                        'js/app/map/load-google-maps.js',
                                        'js/app/map/ui-map.js',
                                        'js/app/map/map.js']).then(
                                        function () {
                                            return loadGoogleMaps();
                                        }
                                    );
                                }]
                        }
                    })
                    
                
                 
                    // others
                    .state('lockme', {
                        url        : '/lockme',
                        templateUrl: 'tpl/page_lockme.html'
                    })
                    .state('access', {
                        url     : '/access',
                        template: '<div ui-view class="fade-in-right-big smooth"></div>'
                    })
                    .state('access.signin', {
                        url        : '/signin',
                        templateUrl: 'html/login.html',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad
                                        .load(['ui.select'])
                                        .then(function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/base_conf.js',
                                                'js/controllers/login.js'
                                            ]);
                                        });
                                }
                            ]
                        }
                    })
                    .state('access.signup', {
                        url        : '/signup',
                        templateUrl: 'tpl/page_signup.html',
                        resolve    : {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/signup.js']);
                                }]
                        }
                    })
                    .state('access.forgotpwd', {
                        url        : '/forgotpwd',
                        templateUrl: 'tpl/page_forgotpwd.html'
                    })
                    .state('access.404', {
                        url        : '/404',
                        templateUrl: 'tpl/page_404.html'
                    })

                    // fullCalendar
                    .state('app.calendar', {
                        url        : '/calendar',
                        templateUrl: 'tpl/app_calendar.html',
                        // use resolve to load other dependences
                        resolve    : {
                            deps: ['$ocLazyLoad', 'uiLoad',
                                function ($ocLazyLoad, uiLoad) {
                                    return uiLoad.load(
                                        ['vendor/jquery/fullcalendar/fullcalendar.css',
                                            'vendor/jquery/fullcalendar/theme.css',
                                            'vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                                            'vendor/libs/moment.min.js',
                                            'vendor/jquery/fullcalendar/fullcalendar.min.js',
                                            'js/app/calendar/calendar.js']
                                    ).then(
                                        function () {
                                            return $ocLazyLoad.load('ui.calendar');
                                        }
                                    );
                                }]
                        }
                    })

                    // mail
                    .state('app.mail', {
                        abstract   : true,
                        url        : '/mail',
                        templateUrl: 'tpl/mail.html',
                        // use resolve to load other dependences
                        resolve    : {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/mail/mail.js',
                                        'js/app/mail/mail-service.js',
                                        'vendor/libs/moment.min.js']);
                                }]
                        }
                    })
                    .state('app.mail.list', {
                        url        : '/inbox/{fold}',
                        templateUrl: 'tpl/mail.list.html'
                    })
                    .state('app.mail.detail', {
                        url        : '/{mailId:[0-9]{1,4}}',
                        templateUrl: 'tpl/mail.detail.html'
                    })
                    .state('app.mail.compose', {
                        url        : '/compose',
                        templateUrl: 'tpl/mail.new.html'
                    })

                    .state('layout', {
                        abstract   : true,
                        url        : '/layout',
                        templateUrl: 'tpl/layout.html'
                    })
                    .state('layout.fullwidth', {
                        url    : '/fullwidth',
                        views  : {
                            ''      : {
                                templateUrl: 'tpl/layout_fullwidth.html'
                            },
                            'footer': {
                                templateUrl: 'tpl/layout_footer_fullwidth.html'
                            }
                        },
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/vectormap.js']);
                                }]
                        }
                    })
                    .state('layout.mobile', {
                        url  : '/mobile',
                        views: {
                            ''      : {
                                templateUrl: 'tpl/layout_mobile.html'
                            },
                            'footer': {
                                templateUrl: 'tpl/layout_footer_mobile.html'
                            }
                        }
                    })
                    .state('layout.app', {
                        url    : '/app',
                        views  : {
                            ''      : {
                                templateUrl: 'tpl/layout_app.html'
                            },
                            'footer': {
                                templateUrl: 'tpl/layout_footer_fullwidth.html'
                            }
                        },
                        resolve: {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/controllers/tab.js']);
                                }]
                        }
                    })
                    .state('apps', {
                        abstract   : true,
                        url        : '/apps',
                        templateUrl: 'tpl/layout.html'
                    })
                    .state('apps.note', {
                        url        : '/note',
                        templateUrl: 'tpl/apps_note.html',
                        resolve    : {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/note/note.js',
                                        'vendor/libs/moment.min.js']);
                                }]
                        }
                    })
                    .state('apps.contact', {
                        url        : '/contact',
                        templateUrl: 'tpl/apps_contact.html',
                        resolve    : {
                            deps: ['uiLoad',
                                function (uiLoad) {
                                    return uiLoad.load(['js/app/contact/contact.js']);
                                }]
                        }
                    })
                    .state('app.weather', {
                        url        : '/weather',
                        templateUrl: 'tpl/apps_weather.html',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(
                                        {
                                            name : 'angular-skycons',
                                            files: ['js/app/weather/skycons.js',
                                                'vendor/libs/moment.min.js',
                                                'js/app/weather/angular-skycons.js',
                                                'js/app/weather/ctrl.js']
                                        }
                                    );
                                }]
                        }
                    })
                    .state('music', {
                        url        : '/music',
                        templateUrl: 'tpl/music.html',
                        controller : 'MusicCtrl',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'com.2fdevs.videogular',
                                        'com.2fdevs.videogular.plugins.controls',
                                        'com.2fdevs.videogular.plugins.overlayplay',
                                        'com.2fdevs.videogular.plugins.poster',
                                        'com.2fdevs.videogular.plugins.buffering',
                                        'js/app/music/ctrl.js',
                                        'js/app/music/theme.css'
                                    ]);
                                }]
                        }
                    })
                    .state('music.home', {
                        url        : '/home',
                        templateUrl: 'tpl/music.home.html'
                    })
                    .state('music.genres', {
                        url        : '/genres',
                        templateUrl: 'tpl/music.genres.html'
                    })
                    .state('music.detail', {
                        url        : '/detail',
                        templateUrl: 'tpl/music.detail.html'
                    })
                    .state('music.mtv', {
                        url        : '/mtv',
                        templateUrl: 'tpl/music.mtv.html'
                    })
                    .state('music.mtvdetail', {
                        url        : '/mtvdetail',
                        templateUrl: 'tpl/music.mtv.detail.html'
                    })
                    .state('music.playlist', {
                        url        : '/playlist/{fold}',
                        templateUrl: 'tpl/music.playlist.html'
                    })
                    // System Management
                    .state('app.sm', {
                        url     : '/sm',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/base_conf.js',
                                                'js/services/common/formUtils.js',
                                                'js/services/common/dataTableUtils.js',
                                                'js/services/common/dateTimeUtils.js',
                                                'js/services/common/toasterUtils.js',
                                                'js/services/common/objectUtils.js',
                                                'js/services/common/arrayUtils.js',
                                                'js/services/sm/shareDataService.js'
                                            ]);
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    // System Management --> Organization Management
                    .state('app.sm.orgManagement', {
                        url        : '/orgManagement',
                        templateUrl: 'html/sm/org_mgt.html',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                            		return $ocLazyLoad
                                    .load(['angularBootstrapNavTree', 'ui.select'])
                                    .then(function () {
	                                    return $ocLazyLoad.load([
	                                        'js/controllers/sm/org_mgt_ctrl.js',
	                                        'js/controllers/sm/org_add_modal_ctrl.js',
	                                        'js/controllers/sm/org_edit_modal_ctrl.js',
	                                        'js/controllers/sm/org_delete_modal_ctrl.js'
	                                    ]);
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.sm.depManagement', {
                        url        : '/depManagement',
                        templateUrl: 'html/sm/dep_mgt.html',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad
                                        .load(['angularBootstrapNavTree', 'ui.select'])
                                        .then(function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/sm/dep_mgt_ctrl.js'
                                            ]);
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.sm.posManagement', {
                        url        : '/posManagement',
                        templateUrl: 'html/sm/pos_mgt.html',
                        resolve    : {
                            pos: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad
                                        .load(['angularBootstrapNavTree', 'ui.select'])
                                        .then(function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/sm/pos_mgt_ctrl.js',
                                                'js/controllers/sm/pos_add_modal_ctrl.js',
                                                'js/controllers/sm/pos_edit_modal_ctrl.js',
                                                'js/controllers/sm/pos_delete_modal_ctrl.js'
                                            ]);
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.sm.userManagement', {
                        url        : '/userManagement',
                        templateUrl: 'html/sm/user_mgt.html',
                        resolve    : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad
                                        .load(['ui.select'])
                                        .then(function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/sm/user_mgt_ctrl.js',
                                                'js/controllers/sm/user_add_modal_ctrl.js',
                                                'js/controllers/sm/user_edit_modal_ctrl.js',
                                                'js/controllers/sm/user_change_pswd_modal_ctrl.js',
                                                'js/controllers/sm/user_delete_modal_ctrl.js'
                                            ]);
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.sm.roleManagement', {
                        url        : '/roleManagement',
                        templateUrl: 'html/sm/role_mgt.html',
                        resolve    : {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad
                                    .load(['ui.select', 
                                  	  '../libs/jquery/ztree/js/jquery.ztree.all.min.js',
                                      '../libs/jquery/ztree/zTreeStyle/zTreeStyle.css'
                                  ])
                                    .then(function () {
                                        return $ocLazyLoad.load([
                                            'js/controllers/sm/role_mgt_ctrl.js',
                                            'js/controllers/sm/role_add_modal_ctrl.js',
                                            'js/controllers/sm/role_edit_modal_ctrl.js',
                                            'js/controllers/sm/role_delete_modal_ctrl.js',
                                            'js/controllers/sm/roleMenuName_add_modal_ctrl.js'
                                        ]);
                                    });
                            }]
                        }
                    })
                    .state('app.sm.menuManagement', {
                        url        : '/menuManagement',
                        templateUrl: 'html/sm/menu_mgt.html',
                        resolve    : {
                            menu: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad
                                        .load(['angularBootstrapNavTree', 'ui.select'])
                                        .then(function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/sm/menu_mgt_ctrl.js'
                                            ]);
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.sm.btnManagement', {
                        url        : '/btnManagement',
                        templateUrl: 'html/sm/btn_mgt.html',
                        resolve    : {
                            pos: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad
                                        .load(['angularBootstrapNavTree', 'ui.select'])
                                        .then(function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/sm/btn_mgt_ctrl.js',
                                                'js/controllers/sm/btn_add_modal_ctrl.js',
                                                'js/controllers/sm/btn_edit_modal_ctrl.js',
                                                'js/controllers/sm/btn_delete_modal_ctrl.js'
                                            ]);
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.sm.serviceManagement', {
                        url        : '/serviceManagement',
                        templateUrl: 'html/sm/service_mgt.html',
                        resolve    : {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad
                                    .load(['ui.select'])
                                    .then(function () {
                                        return $ocLazyLoad.load([
                                            'js/controllers/sm/service_mgt_ctrl.js',
                                            'js/controllers/sm/service_add_modal_ctrl.js',
                                            'js/controllers/sm/service_info_edit_modal_ctrl.js',
                                            'js/controllers/sm/service_edit_fields_modal_ctrl.js'
                                        ]);
                                    });
                            }]
                        }
                    })
                    .state('app.sm.optionsManagement', {
                        url        : '/optionsManagement',
                        templateUrl: 'html/sm/options_mgt.html',
                        resolve    : {
                            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad
                                    .load(['ui.select'])
                                    .then(function () {
                                        return $ocLazyLoad.load([
                                            'js/controllers/sm/options_mgt_ctrl.js',
                                            'js/controllers/sm/options_add_modal_ctrl.js',
                                            'js/controllers/sm/options_edit_info_modal_ctrl.js'
                                        ]);
                                    });
                            }]
                        }
                    })
                   //贷款模块
                .state('app.ln', {
                    url: '/ln',
                    template: '<div ui-view class="fade-in-down"></div>',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select','toaster']).then(
                                    function () {
                                        return $ocLazyLoad.load([
                                            'js/controllers/base_conf.js',
                                            'js/controllers/ln/gx/gx_mgmt_ctrl.js',
                                            'js/controllers/ln/gx/gx_check_modal_ctrl.js',
                                            'js/controllers/ln/gx/gx_detail_modal_ctrl.js',
                                            'js/controllers/ln/gx/gx_delete_modal_ctrl.js',
                                            'js/controllers/ln/gx/gx_queryCheck.js',
                                            'js/controllers/ln/loan_apply.js',
                                            'js/services/common/formUtils.js',
                                            'js/services/common/dataTableUtils.js',
                                            'js/services/ln/lnShareDataService.js',
                                            'js/controllers/ln/loan_check.js',
                                            'js/controllers/ln/loan_check_modal_ctrl.js',
                                            'js/controllers/ln/loan_account.js',
                                            'js/controllers/ln/loan_account_modal_ctrl.js',
                                            'js/controllers/ln/loan_contract_entry.js',
                                            'js/controllers/ln/loan_contract_entry_modal_ctrl.js',
                                            'js/controllers/ln/loan_contract_mgmt.js',
                                            'js/controllers/ln/loan_contract_mgmt_modal_ctrl.js',
                                            'js/controllers/ln/loan_lending_mgmt.js',
                                            'js/controllers/ln/loan_lending_mgmt_modal_ctrl.js',
                                            'js/controllers/ln/loan_payment_mgmt.js',
                                            'js/controllers/ln/loan_payment_mgmt_modal_ctrl.js',
                                            'js/controllers/ln/loan_calculate_mgmt.js',
                                            'js/controllers/ln/loan_history_query.js',
                                            'js/controllers/ln/loan_history_detail_modal_ctrl.js'
                                        ]);
                                    }
                                );
                            }
                        ]
                    }
                })
                //展期申请
                .state('app.ln.gxManagement', {
                    url: '/gxManagement',
                    templateUrl: 'html/ln/gx/gx_mgmt.html'
                })
                //展期列表查询
                .state('app.ln.gxQueryManagement', {
                    url: '/gxQueryManagement',
                    templateUrl: 'html/ln/gx/gx_queryCheck.html'
                })
                //贷款申请
                 .state('app.ln.lnApply', {
                    url: '/loanApply',
                    templateUrl: 'html/ln/loan_apply.html'
                })
                //贷款审核
                 .state('app.ln.lnCheck', {
                    url: '/loanCheck',
                    templateUrl: 'html/ln/loan_check.html'
                })
                //贷款开户
                 .state('app.ln.lnAccount', {
                    url: '/loanAccount',
                    templateUrl: 'html/ln/loan_account.html'
                })
                //合同录入
                .state('app.ln.lnContractEntry', {
                    url: '/lnContractEntry',
                    templateUrl: 'html/ln/loan_contract_entry.html'
                })
                //合同管理
                .state('app.ln.lnContractMgmt', {
                    url: '/lnContractMgmt',
                    templateUrl: 'html/ln/loan_contract_mgmt.html'
                })
                //放款管理
                .state('app.ln.lendingMgmt', {
                    url: '/lendingMgmt',
                    templateUrl: 'html/ln/loan_lending_mgmt.html'
                })
                //还款管理
                 .state('app.ln.paymentMgmt', {
                    url: '/paymentMgmt',
                    templateUrl: 'html/ln/loan_payment_mgmt.html'
                })
                //历史查询
                 .state('app.ln.historyQuery', {
                    url: '/historyQuery',
                    templateUrl: 'html/ln/loan_history_query.html'
                })
                //呆账认定
                 .state('app.ln.badDebtMaintain', {
                    url: '/badDebtMaintain',
                    templateUrl: 'html/ln/loan_baddebt_maintain.html'
                })
                //贷款试算
                 .state('app.ln.calculateMgmt', {
                    url: '/calculateMgmt',
                    templateUrl: 'html/ln/loan_calculate_mgmt.html'
                })
                
 .state('app.dp', {
                    url: '/dp',
                    template: '<div ui-view class="fade-in-down"></div>',
                    resolve: {
                        deps: ['$ocLazyLoad',
                               function ($ocLazyLoad) {
                                   return $ocLazyLoad.load(['ui.select', 'toaster']).then(
                                       function () {
                                           return $ocLazyLoad.load([
                                               'js/controllers/dp/dp_mgmt_ctrl.js',
                                               'js/services/dp/dpDataService.js',
                                               'js/controllers/dp/dp_acct_open.js',
                                               'js/controllers/dp/dp_trans_list.js',
                                               'js/services/common/dataTableUtils.js',
                                               'js/services/common/formUtils.js',
                                               'js/controllers/dp/dp_trans_detail.js',
                                               'js/controllers/dp/dp_amt_add.js',
                                               'js/controllers/dp/dp_amt_withdraw.js',
                                               'js/controllers/dp/dp_balance_inq.js',
                                               'js/controllers/dp/dp_intra_transfer.js'
                                               
                                           ]);
                                       }
                                   );
                               }
                           ]
 }
                })
                .state('app.dp.depManagement', {
                    url: '/acctOpen',
                    templateUrl: 'tpl/dp/acct_open.html'
                })
                .state('app.dp.custinfo', {
                    url: '/acctOpen2/:idNumber/:custType/:idType/:custLevel',
                    templateUrl: 'tpl/dp/acct_open2.html'
                })
                .state('app.dp.cardopen', {
                    url: '/acctOpen3/:idNumber/:idType/:prodCycle/:acctNbr',
                    templateUrl: 'tpl/dp/card_open.html'
                })
                .state('app.dp.deposit',{
                	url: '/amtadd',
                    templateUrl: 'tpl/dp/amt_add.html'
                })
                .state('app.dp.withdraw',{
                	url: '/amtadd',
                    templateUrl: 'tpl/dp/amt_withdraw.html'
                })
                .state('app.dp.balance',{
                	url: '/balinq',
                    templateUrl: 'tpl/dp/balance_inq.html'
                })
                .state('app.dp.transfer',{
                	url: '/amttrans',
                    templateUrl: 'tpl/dp/intra_transfer.html'
                })
                .state('app.dp.trans',{
                	url: '/translist',
                    templateUrl: 'tpl/dp/trans_hist_details.html'
                })
                .state('app.dp.cancellation',{
                	url: '/actclose',
                    templateUrl: 'tpl/dp/'
                })
                .state('app.dp.cancellinq',{
                	url: '/actcloseinq',
                    templateUrl: 'tpl/dp/'
                })
                .state('app.dp.bigactinq',{
                	url: '/bisactinq',
                    templateUrl: 'tpl/dp/'
                })
                    .state('app.cp', {
                        url     : '/cp',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'toaster']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/base_conf.js',
                                                'js/controllers/cp/organizationManagement/cp_org_mgt.js',
                                                'js/controllers/cp/organizationManagement/org_add_modal_ctrl.js',
                                                'js/controllers/cp/organizationManagement/org_edit_modal_ctrl.js',
                                                'js/controllers/cp/organizationManagement/org_detail_modal_ctrl.js',
                                                'js/controllers/cp/productManagement/cp_product_mgt.js',
                                                'js/controllers/cp/productManagement/product_add_modal_ctrl.js',
                                                'js/controllers/cp/productManagement/product_edit_modal_ctrl.js',
                                                'js/controllers/cp/productManagement/product_detail_modal_ctrl.js',
                                                'js/services/cp/cpShareDataService.js',
                                                'js/controllers/cp/SCTManagement/cp_SCT_mgt.js',
                                                'js/services/common/formUtils.js',
                                                'js/services/common/dataTableUtils.js',
                                                'js/services/common/dateTimeUtils.js',
                                                'js/controllers/base_conf.js'
                                            ]);
                                        }
                                    );
                                }
                            ]
                        }
                    })

                    //参数管理--》机构参数管理
                    .state('app.cp.orgParameterManagement', {
                        url        : '/orgParameterManagement',
                        templateUrl: 'html/cp/organizationManagement/organization_mgt.html'
                    })

                    //参数管理--》产品参数管理
                    .state('app.cp.productParameterManagement', {
                        url        : '/productParameterManagement',
                        templateUrl: 'html/cp/productManagement/product_mgt.html'
                    })

                    //参数管理--》SCT参数管理
                    .state('app.cp.SCTParameterManagement', {
                        url        : '/SCTParameterManagement',
                        templateUrl: 'html/cp/SCTManagement/SCT_mgt.html'
                    })

                    //客户关系模块
                    .state('app.rm', {
                        url     : '/rm',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'toaster']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/base_conf.js',
                                                'js/controllers/rm/openPersonalInformation/per_customer_mgmt_ctrl.js',
                                                'js/controllers/rm/openPersonalInformation/add_per_customer_modal_ctrl.js',
                                                'js/controllers/rm/openPersonalInformation/edit_per_customer_modal_ctrl.js',
                                                'js/controllers/rm/businessCustomerManagement/bus_customer_mgmt_ctrl.js',
                                                'js/controllers/rm/businessCustomerManagement/add_bus_customer_modal_ctrl.js',
                                                'js/controllers/rm/businessCustomerManagement/edit_bus_customer_modal_ctrl.js',
                                                'js/controllers/rm/customerEventManagement/customer_event_mgmt_ctrl.js',
                                                'js/controllers/rm/customerEventManagement/customer_event_modal_ctrl.js',
                                                'js/controllers/rm/customerEventManagement/customer_event_modal_detail_ctrl.js',
                                                'js/controllers/rm/customizedInformation/query_customized_Inf_mgmt_ctrl.js',
                                                'js/controllers/rm/customizedInformation/add_customized_Inf_modal_ctrl.js',
                                                'js/controllers/rm/customizedInformation/customized_Information_modal_detail_ctrl.js',
                                                'js/controllers/rm/maintenanceHistory/maintenance_history_mgmt.js',
                                                'js/controllers/rm/maintenanceHistory/maintenance_history_modal_detail_ctrl.js',
                                                'js/controllers/rm/customerRelationManagement/query_cust_relation_mgmt_ctrl.js',
                                                'js/controllers/rm/customerRelationManagement/add_cust_relation_ctrl.js',
                                                'js/controllers/rm/customerRelationManagement/customer_relation_modal_detail_ctrl.js',
                                                'js/services/rm/rmShareDataService.js'

                                            ]);
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    //客户关系模块-->个人客户管理
                    .state('app.rm.PerCustomer', {
                        url        : '/PerCustomer',
                        templateUrl: 'html/rm/openPersonalInformation/per_customer_mgmt.html'
                    })

                    //客户关系模块-->对公客户管理
                    .state('app.rm.BusinessManagement', {
                        url        : '/BusinessManagement',
                        templateUrl: 'html/rm/businessCustomerManagement/bus_customer_mgmt.html'
                    })

                    //客户关系模块-->客户事件管理
                    .state('app.rm.CustomerEventManagement', {
                        url        : '/CustomerEventManagement',
                        templateUrl: 'html/rm/customerEventManagement/customer_event_mgmt.html'
                    })

                    //客户关系模块-->客户自定义信息
                    .state('app.rm.CustomizedInformationManagement', {
                        url        : '/CustomizedInformationManagement',
                        templateUrl: 'html/rm/customizedInformation/query_customized_Inf_mgmt.html'
                    })

                    //客户关系模块-->维护历史查询
                    .state('app.rm.MaintenanceHistory', {
                        url        : '/MaintenanceHistory',
                        templateUrl: 'html/rm/maintenanceHistory/maintenance_history_mgmt.html'
                    })

                    //客户关系模块-->客户关系管理
                    .state('app.rm.CustRelationManagement', {
                        url        : '/MustRelationManagement',
                        templateUrl: 'html/rm/customerRelationManagement/query_cust_relation_mgmt.html'
                    })

                    //账务管理
                    .state('app.fm', {
                        url     : '/fm',
                        template: '<div ui-view class="fade-in-down"></div>',
                        resolve : {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'toaster']).then(
                                        function () {
                                            return $ocLazyLoad.load([
                                                'js/controllers/base_conf.js',
                                                'js/controllers/fm/subjectMgt/subjects_management.js',
                                                'js/controllers/fm/subjectMgt/subject_add_management.js',
                                                'js/controllers/fm/subjectMgt/subject_edit_management.js',
                                                'js/controllers/fm/subjectMgt/subject_detail_management.js',
                                                'js/services/common/formUtils.js',
                                                'js/services/common/dataTableUtils.js',
                                                'js/services/common/dateTimeUtils.js',
                                                'js/services/fm/fmShareDataService.js',
                                                'js/controllers/fm/tradingList/trading_list_mgt.js',
                                                'js/controllers/fm/tradingList/trad_add_management.js',
                                                'js/controllers/fm/tradingList/trad_detail_management.js',
                                                'js/controllers/fm/tradingList/trad_edit_management.js',
                                                'js/controllers/fm/subjectDetailQuery/subjectDetailQuery.js',
                                                'js/controllers/fm/subjectDetailQuery/item_detail_management.js',
                                                'js/controllers/fm/accountingEntryMgt/accounting_entry_management.js',
                                                'js/controllers/fm/accountingEntryMgt/accounting_entry_add_management.js',
                                                'js/controllers/fm/accountingEntryMgt/accounting_entry_edit_management.js',
                                                'js/controllers/fm/accountingEntryMgt/accounting_entry_detail_management.js',
                                                'js/controllers/fm/accting_list_query_ctrl.js',
                                                'js/controllers/fm/accting_list_query_detail_ctrl.js',
                                                'js/controllers/fm/generalAcctingMgt/general_ledger_accting_ctrl.js',
                                                'js/controllers/fm/generalAcctingMgt/general_ledger_accting_add_ctrl.js',
                                                'js/controllers/fm/generalAcctingMgt/general_ledger_accting_edit_ctrl.js',
                                                'js/controllers/fm/generalAcctingMgt/general_ledger_accting_detail_ctrl.js'

                                            ]);
                                        }
                                    );
                                }
                            ]
                        }
                    })

                    //账务管理-科目管理
                    .state('app.fm.subjectsMgt', {
                        url        : '/subjectsMgt',
                        templateUrl: 'html/fm/subjectMgt/fm_subjects_mgt.html'
                    })
                    //账务管理-会计分录管理
                    .state('app.fm.accountingEntryMgt', {
                        url        : '/accountingEntryMgt',
                        templateUrl: 'html/fm/accountingEntryMgt/accounting_entry_mgt.html'
                    })
                    //账务管理-记账分录明细查询
                    .state('app.fm.billingEntriesDetailedInquiry', {
                        url        : '/billingEntriesDetailedInquiry',
                        templateUrl: 'html/fm/billing_entries_detailed_inquiry.html'
                    })
                    //账务管理-科目明细流水查询
                    .state('app.fm.subjectDetailedFlowQuery', {
                        url        : '/subjectDetailedFlowQuery',
                        templateUrl: 'html/fm/itemDetail/subject_detailed_flow_query.html'
                    })
                    //账务管理-总账账务管理
                    .state('app.fm.generalLedgerAccountingMgt', {
                        url        : '/generalLedgerAccountingMgt',
                        templateUrl: 'html/fm/generalAcctingListMgt/general_ledger_accounting_mgt.html'
                    })
                    //账务管理-交易流水列表
                    .state('app.fm.tradingList', {
                        url        : '/tradingList',
                        templateUrl: 'html/fm/tradMgt/trading_list.html'
                    });

            }
        ]
    );