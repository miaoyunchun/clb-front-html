'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var SvcMgtControl = function SvcMgtControl($scope, $http, $filter, $interval, $window, shareDataService, dataTableUtils, toasterUtils, dateTimeUtils) {
    _classCallCheck(this, SvcMgtControl);

    $scope.organizations = undefined;
    $scope.systems = undefined;
    $scope.modules = undefined;
    $scope.aliases = undefined;
    $scope.functions = undefined;
    $scope.users = undefined;

    $scope.selectedOrganization = {};
    $scope.selectedSystem = {};
    $scope.selectedModule = {};
    $scope.selectedAlias = {};
    $scope.selectedFunction = {};
    $scope.selectedUser = {};

    $scope.dates = {
        laterThan  : undefined,
        earlierThan: undefined
    };

    $scope.fields = {
        svcSysName     : undefined,
        svcModuleName  : undefined,
        svcSysAlias    : undefined,
        svcFunctionName: undefined,
        svcUpdateUserId: undefined,
        availTime      : undefined,
        expireTime     : undefined,
        orgId          : undefined
    };

    var COLUMN_NAMES = {
        SEQ              : 0,
        SERVICE_ID       : 1,
        SERVICE_NAME     : 2,
        SYS_NAME         : 3,
        MODULE_NAME      : 4,
        ALIAS_NAME       : 5,
        FUNCTION_NAME    : 6,
        DESCRIPTION_ZH_CN: 7,
        DESCRIPTION_EN   : 8,
        ORG_ID           : 9,
        ORG_NAME         : 10,
        UPDATE_USER_ID   : 11,
        UPDATE_USER      : 12,
        UPDATE_DATE      : 13
    };

    // Initialization parameters for DataTable
    $scope.dataTableParms = {
        searching : false, // Disable built-in searching
        serverSide: true, // Enables the server-side processing
        processing: true, // Enables the "Processing..." indicator
        autoWidth : false, // Disable column width auto determining
        pagingType: 'full_numbers', // Paging buttons contains "First", "Last", "Previous", "Next", and numbers
        language  : {
            // I18n options, see https://datatables.net/reference/option/ for details
            paginate    : {
                previous: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_PREV_PAGE'),
                next    : $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_NEXT_PAGE'),
                first   : $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_FIRST_PAGE'),
                last    : $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_LAST_PAGE')
            },
            emptyTable  : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_EMPTY_TABLE'),
            info        : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO'),
            infoFiltered: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO_FILTERED'),
            infoEmpty   : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_EMPTY'),
            lengthMenu  : $filter('translate')('pages.common.COMMON_FIELDS.COMMON_FIELD_LENGTH_MENU'),
            processing  : $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PROCESSING')
        },
        ajax      : {
            url    : CLB_FRONT_BASE_URL + 'svc/querySvcInfoWithFilter',
            data   : $scope.fields,
            dataSrc: 'data',
            type   : 'POST'
        },
        columns   : [
            // Specify which property to pick for the corresponding column
            {data: 'seq', visible: true, orderable: false}, {data: 'svcId', visible: false}, {data: 'svcName', visible: true}, {data: 'svcSysName', visible: false}, {data: 'svcModuleName', visible: false}, {data: 'svcSysAlias', visible: false}, {data: 'svcFunctionName', visible: false}, {data: 'svcDescriptionZhCn', visible: true}, {data: 'svcDescriptionEn', visible: true}, {data: 'orgId', visible: false}, {data: 'orgName', visible: true}, {data: 'svcUpdateUserId', visible: false}, {data: 'svcUpdateUserName', visible: true}, {data: 'svcUpdateTime', visible: true}],
        order     : [[COLUMN_NAMES.SERVICE_NAME, 'asc']]
    };

    /**
     * Generates the child row for the selected row
     * @param data Data of the selected row
     * @returns {string} The HTML of the child row
     */
    function formatChildRow(data) {
        return '<div class="col-lg-6 form-group">' + '<h5>' + $filter('translate')('pages.sm.service.SERVICE_MGMT_COLUMN_TITLES.SERVICE_MGMT_COLUMN_TITLE_DESCRIPTION_ZH_CN') + '</h5>' + '<div id="descZhCn" class="well b bg-light lter wrapper-sm">' + data.svcDescriptionZhCn + '</div>' + '</div>' + '<div class="col-lg-6 form-group">' + '<h5>' + $filter('translate')('pages.sm.service.SERVICE_MGMT_COLUMN_TITLES.SERVICE_MGMT_COLUMN_TITLE_DESCRIPTION_EN') + '</h5>' + '<div id="descEn" class="well b bg-light lter wrapper-sm">' + data.svcDescriptionEn + '</div>' + '</div>';
    }

    /**
     * Fetch organizations with position ID and department ID
     */
    function fetchOrganizations() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOrganizationName'
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.organizations = responseData.organizationInfo;

                if (responseData.organizationInfo.length === 1) {
                    $scope.selectedOrg.id = responseData.organizationInfo[0].orgId;
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    function fetchUsers() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryAllUser'
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.users = responseData.userInfo;

                if (responseData.userInfo.length === 1) {
                    $scope.selectedUser.id = responseData.userInfo[0].userId;
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    function fetchSystemNames() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/querySvcSystemName'
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.systems = responseData.svcSysName;

                if (responseData.svcSysName.length === 1) {
                    $scope.selectedSystem.svcSysName = responseData.svcSysName[0].svcSysName;
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    function fetchModuleNames() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/querySvcModuleName'
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.modules = responseData.svcModuleName;

                if (responseData.svcModuleName.length === 1) {
                    $scope.selectedModule.svcModuleName = responseData.svcModuleName[0].svcModuleName;
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    function fetchAliases() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/querySvcSysAlias'
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.aliases = responseData.svcSysAlias;

                if (responseData.svcSysAlias.length === 1) {
                    $scope.selectedAlias.svcSysAlias = responseData.svcSysAlias[0].svcSysAlias;
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    function fetchFunctionNames() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/querySvcFunctionName'
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.functions = responseData.svcFunctionName;

                if (responseData.svcFunctionName.length === 1) {
                    $scope.selectedFunction.svcFunctionName = responseData.svcFunctionName[0].svcFunctionName;
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    /**
     * Perform initialization AJAXes
     */
    function performInitAjaxes() {
        fetchOrganizations();
        fetchUsers();
        fetchSystemNames();
        fetchModuleNames();
        fetchAliases();
        fetchFunctionNames();
    }

    $scope.earlierThanOnChange = function () {
        $scope.fields.availTime = dateTimeUtils.getYyyyMmDd($scope.dates.earlierThan);
    };

    $scope.laterThanOnChange = function () {
        $scope.fields.expireTime = dateTimeUtils.getYyyyMmDd($scope.dates.laterThan);
    };

    $scope.orgIdSelectOnChange = function () {
        $scope.fields.orgId = $scope.selectedOrganization.id;
    };

    $scope.userIdSelectOnChange = function () {
        $scope.fields.svcUpdateUserId = $scope.selectedUser.id;
    };

    $scope.systemSelectOnChange = function () {
        $scope.fields.svcSysName = $scope.selectedSystem.svcSysName;
    };

    $scope.moduleSelectOnChange = function () {
        $scope.fields.svcModuleName = $scope.selectedModule.svcModuleName;
    };

    $scope.aliasSelectOnChange = function () {
        $scope.fields.svcSysAlias = $scope.selectedAlias.svcSysAlias;
    };

    $scope.functionSelectOnChange = function () {
        $scope.fields.svcFunctionName = $scope.selectedFunction.svcFunctionName;
    };

    $scope.clearOrganizationSelect = function () {
        $scope.selectedOrganization.id = undefined;
        $scope.fields.orgId = undefined;
    };

    $scope.clearUserIdSelect = function () {
        $scope.selectedUser.id = undefined;
        $scope.fields.svcUpdateUserId = undefined;
    };

    $scope.clearSystemSelect = function () {
        $scope.selectedSystem.svcSysName = undefined;
        $scope.fields.svcSysName = undefined;
    };

    $scope.clearModuleSelect = function () {
        $scope.selectedModule.svcModuleName = undefined;
        $scope.fields.svcModuleName = undefined;
    };

    $scope.clearAliasSelect = function () {
        $scope.selectedAlias.svcSysAlias = undefined;
        $scope.fields.svcSysAlias = undefined;
    };

    $scope.clearFunctionSelect = function () {
        $scope.selectedFunction.svcFunctionName = undefined;
        $scope.fields.svcFunctionName = undefined;
    };

    $scope.clearSelect = function () {
        $scope.fields.availTime = undefined;
        $scope.fields.expireTime = undefined;

        $scope.clearOrganizationSelect();
        $scope.clearUserIdSelect();
        $scope.clearSystemSelect();
        $scope.clearModuleSelect();
        $scope.clearAliasSelect();
        $scope.clearFunctionSelect();
        $scope.search();
    };

    /**
     * When the search button clicked
     */
    $scope.search = function () {
        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblServices');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    };

    $scope.deleteService = function () {
        var table = $('#tblServices').DataTable();

        if (table.row('.active').length === 1) {
            if ($window.confirm($filter('translate')('pages.sm.service.SERVICE_MGMT_NOTIFICATIONS.SERVICE_MGMT_NOTIFICATION_DELETE_SERVICE_CONFIRMATION'))) {
                var data = table.row('.active').data();

                $http({
                    method: 'POST',
                    url   : CLB_FRONT_BASE_URL + 'svc/deleteSvcInfo',
                    params: {
                        'svcId'                          : data.svcId,
                        'serviceRequiredVo.svcOperatorId': sessionStorage.getItem('userId')
                    }
                }).then(function (response) {
                    if (response.data.flag === 'success') {
                        toasterUtils.showSuccessToaster($filter('translate')('pages.sm.service.SERVICE_MGMT_ALERTS.SERVICE_MGMT_ALERT_SERVICE_DELETE_SUCCESSFUL'));
                        dataTableUtils.reloadDataTable($('#tblServices'));
                    } else {
                        toasterUtils.showErrorToaster(response.data.message);
                    }
                }, function () {
                    toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
                });
            }
        } else {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));
        }
    };

    /**
     * When the clear button clicked
     */
    $scope.clear = function () {
        // Clear fields
        $scope.fields.roleName = undefined;

        $scope.clearSelect();
        $scope.clearStatusSelect();

        // Then re-perform the searching
        $scope.search();
    };

    /**
     * When the document is ready
     */
    angular.element(function () {
        var dataTablesSelector = angular.element('#tblServices');
        dataTableUtils.enableSingleSelect(dataTablesSelector, true, formatChildRow, undefined);
        performInitAjaxes();
    });
};

var AccordionCtrl = function AccordionCtrl($scope, $filter) {
    _classCallCheck(this, AccordionCtrl);

    // Only one Accordion can be opened at the same time
    $scope.oneAtATime = true;

    // Title of the Accordion
    $scope.accordionTitle = $filter('translate')('pages.common.COMMON_FORM_TITLES.COMMON_FORM_TITLE_SEARCH');

    // Initialize parameters for the Accordion
    $scope.status = {
        isFirstOpen    : false,
        isFirstDisabled: false
    };
};

var DatePickerControl = function DatePickerControl($scope) {
    _classCallCheck(this, DatePickerControl);

    $scope.today = function () {
        $scope.dt = new Date().toISOString().slice(0, 10); // Pick the yyyy-MM-dd part
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear : 'yyyy',
        startingDay: 1,
        showWeeks  : false,
        class      : 'datepicker'
    };

    $scope.format = 'yyyy-MM-dd';
};

app.controller('SvcMgtControl', SvcMgtControl);
app.controller('AccordionCtrl', AccordionCtrl);
app.controller('DatePickerControl', DatePickerControl);

//# sourceMappingURL=service_mgt_ctrl.js.map