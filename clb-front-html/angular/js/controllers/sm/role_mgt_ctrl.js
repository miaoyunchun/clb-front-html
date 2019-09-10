'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var RoleMgtControl = function RoleMgtControl($scope, $http, $filter, shareDataService, dataTableUtils, toasterUtils) {
    _classCallCheck(this, RoleMgtControl);

    $scope.placeholders = shareDataService.role.getRolePlaceholders();

    $scope.statuses = undefined;
    $scope.organizations = undefined;
    $scope.departments = undefined;
    $scope.positions = undefined;

    $scope.fields = {
        roleName  : undefined,
        roleActive: undefined,
        orgId     : undefined,
        depId     : undefined,
        posId     : undefined
    };

    $scope.selectedStatus = {};
    $scope.selectedOrg = {};
    $scope.selectedDep = {};
    $scope.selectedPos = {};

    var COLUMN_NAMES = {
        SEQ        : 0,
        ROLE_ID    : 1,
        ROLE_NAME  : 2,
        CREATE_DATE: 3,
        POS_ID     : 4,
        POS_NAME   : 5,
        DEP_ID     : 6,
        DEP_NAME   : 7,
        ORG_ID     : 8,
        ORG_NAME   : 9,
        STATUS_ID  : 10,
        STATUS     : 11
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
            url    : CLB_FRONT_BASE_URL + 'role/queryRoleWithFilter',
            data   : $scope.fields,
            dataSrc: 'data'
        },
        columns   : [
            // Specify which property to pick for the corresponding column
            {data: 'seq', visible: true}, {data: 'roleId', visible: false}, {data: 'roleName', visible: true}, {data: 'roleCreateTime', visible: true}, {data: 'posId', visible: false}, {data: 'posName', visible: true}, {data: 'depId', visible: false}, {data: 'depName', visible: true}, {data: 'orgId', visible: false}, {data: 'orgName', visible: true}, {data: 'roleActive', visible: false}, {data: 'roleActiveStatus', visible: true}],
        order     : [[COLUMN_NAMES.ROLE_NAME, 'asc']]
    };

    /**
     * Fetch organizations with position ID and department ID
     * @param [posId=undefined] Position ID
     * @param [depId=undefined] Department ID
     */
    function fetchOrganizations() {
        var posId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        var depId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOrganizationName',
            params: {
                'posId': posId,
                'depId': depId
            }
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

    /**
     * Fetch departments with given organization ID and position ID
     * @param [orgId=undefined] Organization ID
     * @param [posId=undefined] Position ID
     */
    function fetchDepartments() {
        var orgId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        var posId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryDepartmentName',
            params: {
                'orgId': orgId,
                'posId': posId
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.departments = responseData.departmentInfo;

                if (responseData.departmentInfo.length === 1) {
                    $scope.selectedDep.id = responseData.departmentInfo[0].depId;
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    /**
     * Fetch positions with given organization ID and department ID
     * @param [orgId=undefined] Organization ID
     * @param [depId=undefined] Department ID
     */
    function fetchPositions() {
        var orgId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
        var depId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryPositionName',
            params: {
                'orgId': orgId,
                'depId': depId
            }
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.positions = responseData.posInfo;

                if (responseData.posInfo.length === 1) {
                    $scope.selectedPos.Id = responseData.posInfo[0].posId;
                }
            }
        }, function () {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    }

    /**
     * Fetch statuses and its ID
     */
    function fetchStatuses() {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(function (response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.statuses = responseData.active;

                if (responseData.active.length === 1) {
                    $scope.selectedStatus.value = responseData.active[0].value;
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
        fetchDepartments();
        fetchPositions();
        fetchStatuses();
    }

    /**
     * When the status select box changed
     */
    $scope.activeStatusSelectChanged = function () {
        $scope.fields.roleActive = $scope.selectedStatus.value;
    };

    /**
     * When the organization select box changed
     */
    $scope.orgIdSelectOnChange = function () {
        $scope.fields.orgId = $scope.selectedOrg.id;

        fetchDepartments($scope.fields.orgId, $scope.fields.posId);
        fetchPositions($scope.fields.orgId, $scope.fields.depId);
    };

    /**
     * When the department select box changed
     */
    $scope.depIdSelectOnChange = function () {
        $scope.fields.depId = $scope.selectedDep.id;

        fetchOrganizations($scope.fields.posId, $scope.fields.depId);
        fetchPositions($scope.fields.orgId, $scope.fields.depId);
    };

    /**
     * When the position select box changed
     */
    $scope.posIdSelectOnChange = function () {
        $scope.fields.posId = $scope.selectedPos.id;

        fetchOrganizations($scope.fields.posId, $scope.fields.depId);
        fetchDepartments($scope.fields.orgId, $scope.fields.posId);
    };

    /**
     * When the clear button of the status select box clicked
     */
    $scope.clearStatusSelect = function () {
        $scope.selectedStatus.value = undefined;
        $scope.fields.roleActive = undefined;
    };

    /**
     * When the clear button of the organization select box, the department select box and the position select box clicked
     */
    $scope.clearSelect = function () {
        $scope.selectedOrg.id = undefined;
        $scope.selectedDep.id = undefined;
        $scope.selectedPos.id = undefined;

        $scope.fields.orgId = undefined;
        $scope.fields.depId = undefined;
        $scope.fields.posId = undefined;

        performInitAjaxes();
    };

    /**
     * When the search button clicked
     */
    $scope.search = function () {
        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblRoles');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
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
        var dataTablesSelector = angular.element('#tblRoles');
        dataTableUtils.enableSingleSelect(dataTablesSelector);
        performInitAjaxes();
    });
};

var AccordionCtrl = function AccordionCtrl($scope, $filter) {
    _classCallCheck(this, AccordionCtrl);

    // Only one Accordion can be opened at the same time
    $scope.oneAtATime = true;

    // Title of the Accordion
    $scope.accordionTitle = $filter('translate')('pages.sm.role.ROLE_MGMT_FORM_TITLES.ROLE_MGMT_FORM_TITLE_SEARCH');

    // Initialize parameters for the Accordion
    $scope.status = {
        isFirstOpen    : false,
        isFirstDisabled: false
    };
};

app.controller('RoleMgtControl', RoleMgtControl);
app.controller('AccordionCtrl', AccordionCtrl);

//# sourceMappingURL=role_mgt_ctrl.js.map