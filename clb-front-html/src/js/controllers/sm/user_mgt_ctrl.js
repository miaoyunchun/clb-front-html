'use strict';

app.controller('UserMgtControl', function ($scope, $http, $filter, $timeout, $interval, toaster, shareDataService, dataTableUtils, dateTimeUtils, formUtils, toasterUtils) {
    $scope.placeholders = shareDataService.user.getUserPlaceholders();

    // Models
    $scope.selectedStatus = {};
    $scope.selectedOrg = {};
    $scope.selectedDep = {};
    $scope.selectedPos = {};

    // Receive data from AJAX
    $scope.posInfo = undefined;
    $scope.departmentInfo = undefined;
    $scope.organizationInfo = undefined;
    $scope.active = undefined;

    $scope.fields = {
        username  : undefined,
        userActive: undefined,
        orgId     : undefined,
        depId     : undefined,
        posId     : undefined
    };

    // The column number and its names
    var columnsNames = {
        SEQ               : 0,
        USER_ID           : 1,
        USER_NAME         : 2,
        USER_ACTIVE       : 3,
        USER_ACTIVE_STATUS: 4,
        POS_ID            : 5,
        POS_NAME          : 6,
        ORG_ID            : 7,
        ORG_NAME          : 8,
        DEP_ID            : 9,
        DEP_NAME          : 10
    };

    /**
     * Fetch positions with given parameters
     * @param orgId ID of associated organization
     * @param depId ID of associated department
     */
    var fetchPositions = function (orgId, depId) {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryPositionName',
            params: {
                orgId: orgId ? orgId : undefined,
                depId: depId ? depId : undefined
            }
        }).then(function successCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.posInfo = responseData.posInfo;

                if ($scope.posInfo.length === 1) {
                    $scope.selectedPos.selected = $scope.posInfo[0];
                }
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };

    /**
     * Fetch departments with given parameters
     * @param orgId ID of associated organization
     * @param posId ID of associated position
     */
    var fetchDepartments = function (orgId, posId) {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryDepartmentName',
            params: {
                orgId: orgId ? orgId : undefined,
                posId: posId ? posId : undefined
            }
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.departmentInfo = responseData.departmentInfo;

                if ($scope.departmentInfo.length === 1) {
                    $scope.selectedDep.selected = $scope.departmentInfo[0];
                }
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };

    /**
     * Fetch organizations with given paramenters
     * @param posId ID of associated position
     * @param depId ID of associated department
     */
    var fetchOrganizations = function (posId, depId) {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryOrganizationName',
            params: {
                posId: posId ? posId : undefined,
                depId: depId ? depId : undefined
            }
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.organizationInfo = responseData.organizationInfo;

                if ($scope.organizationInfo.length === 1) {
                    $scope.selectedOrg.selected = $scope.organizationInfo[0];
                }
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };

    var performInitialAjaxes = function () {

        // Fetch positions
        fetchPositions(undefined, undefined);

        // Fetch departments
        fetchDepartments(undefined, undefined);

        // Fetch organizations
        fetchOrganizations(undefined, undefined);

        // Fetch status
        $http({
            method: 'GET',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(function successfulCallback(response) {
            var responseData = response.data;

            if (responseData.flag === 'success') {
                $scope.active = responseData.active;
            }
        }, function failedCallback() {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_NETWORK_FAILED'));
        });
    };

    // Initialization parameters for DataTable
    $scope.dataTableParms = {
        searching : false, // Disable built-in searching
        serverSide: true, // Enables the server-side processing
        processing: true, // Enables the "Processing..." indicator
        autoWidth : false, // Disable column width auto determining
        pagingType: 'full_numbers',　// Paging buttons contains "First", "Last", "Previous", "Next", and numbers
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
            url    : CLB_FRONT_BASE_URL + 'user/queryUserInfoWithFilter',
            data   : $scope.fields,
            dataSrc: 'data'
        },
        columns   : [
            // Specify which property to pick for the corresponding column
            {data: 'seq', visible: true},
            {data: 'userId', visible: false},
            {data: 'username', visible: true},
            {data: 'phoneNumber', visible: true},
            {data: 'posId', visible: false},
            {data: 'posName', visible: true},
            {data: 'orgId', visible: false},
            {data: 'orgName', visible: true},
            {data: 'depId', visible: false},
            {data: 'depName', visible: true},
            {data: 'userActive', visible: false},
            {data: 'userActiveStatus', visible: true}
        ],
        order     : [[columnsNames.USER_NAME, 'asc']]
    };

    $scope.activeStatusSelectChanged = function () {
        $scope.fields.userActive = $scope.selectedStatus.selected.value;
    };

    $scope.orgIdSelectOnChange = function () {
        var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected.orgId : undefined;
        var posId = $scope.selectedPos.selected ? $scope.selectedPos.selected.posId : undefined;
        var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected.depId : undefined;

        fetchDepartments(orgId, posId);
        fetchPositions(orgId, depId);

        $scope.fields.orgId = $scope.selectedOrg.selected.orgId;
    };

    $scope.depIdSelectOnChange = function () {
        var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected.orgId : undefined;
        var posId = $scope.selectedPos.selected ? $scope.selectedPos.selected.posId : undefined;
        var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected.depId : undefined;

        fetchOrganizations(posId, depId);
        fetchPositions(orgId, depId);

        $scope.fields.depId = $scope.selectedDep.selected.depId;
    };

    $scope.posIdSelectOnChange = function () {
        var orgId = $scope.selectedOrg.selected ? $scope.selectedOrg.selected.orgId : undefined;
        var posId = $scope.selectedPos.selected ? $scope.selectedPos.selected.posId : undefined;
        var depId = $scope.selectedDep.selected ? $scope.selectedDep.selected.depId : undefined;

        fetchOrganizations(posId, depId);
        fetchDepartments(orgId, posId);

        $scope.fields.posId = $scope.selectedPos.selected.posId;
    };

    $scope.clearStatusSelect = function () {
        $scope.selectedStatus.selected = undefined;
    };

    $scope.clearSelect = function () {
        $scope.selectedOrg.selected = undefined;
        $scope.selectedDep.selected = undefined;
        $scope.selectedPos.selected = undefined;

        performInitialAjaxes();
    };

    $scope.search = function () {
        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblUsers');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);
    };

    /**
     * Clear button behaviour
     */
    $scope.clear = function () {

        // Clear dropdowns
        $scope.clearSelect();
        $scope.clearStatusSelect();

        // Clear input fields
        formUtils.clearForm($scope.fields);

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblUsers');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    };

    angular.element(function () {
        var tblUsers = angular.element('#tblUsers');

        dataTableUtils.enableSingleSelect(tblUsers);

        performInitialAjaxes();
    });
});

app.controller('AccordionCtrl', function ($scope, $filter) {
    // Only one Accordion can be opened at the same time
    $scope.oneAtATime = true;

    // Title of the Accordion
    $scope.accordionTitle = $filter('translate')('pages.sm.user.USER_MGMT_FORM_TITLES.USER_MGMT_FORM_TITLE_SEARCH');

    // Initialize parameters for the Accordion
    $scope.status = {
        isFirstOpen    : false,
        isFirstDisabled: false
    };
});