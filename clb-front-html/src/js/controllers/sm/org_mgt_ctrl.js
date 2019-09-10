'use strict';

app.controller('OrgMgmtCtrl', function ($scope, $http, $filter, $timeout, $interval, toaster, shareDataService, dataTableUtils, dateTimeUtils, formUtils) {
    // Define prototypes for inhibiting fake warinings
    var orgStatusResponse = {
        flag: undefined,
        active: [
            {
                active: undefined,
                value: undefined
            }
        ]
    };

    var stakeholderResponse = {
        flag: undefined,
        userInfo: [
            {
                userId: undefined,
                username: undefined
            }
        ]
    };

    var companyResponse = {
        flag: undefined,
        companyInfo: [
            {
                companyId: undefined,
                companyName: undefined
            }
        ]
    };

    $scope.names = [{
        name: '',
        value: ''
    }];

    $scope.active = [{
        active: '',
        value: 0
    }];

    $scope.logo = [
        {
            companyInfoId: 0,
            companyName: ''
        }
    ];

    $scope.fields = {
        orgName: undefined,
        orgPrincipalId: undefined,
        orgDescription: undefined,
        availTime: undefined,
        expireTime: undefined,
        orgCode: undefined,
        orgActive: undefined,
        orgCompanyId: undefined
    };
    //下拉框选中
    $scope.selectedStakeholder={};
    $scope.stakeholderSelectOnChange=function(){
    	$scope.fields.orgPrincipalId=$scope.selectedStakeholder.item.userId;
    }
    $scope.selectedActive={}
    $scope.activeSelectOnChange=function(){
    	$scope.fields.orgActive=$scope.selectedActive.item.value;
    }
    $scope.selectedLogo={};
    $scope.logoSelectOnChange=function(){
    	$scope.fields.orgCompanyId=$scope.selectedLogo.item.companyInfoId;
    }

    $scope.placeholders = shareDataService.org.getPlaceHolders();

    // Initialization parameters for DataTable
    $scope.dataTableParms = {
        searching: false, // Disable built-in searching
        serverSide: true, // Enables the server-side processing
        processing: true, // Enables the "Processing..." indicator
        autoWidth: false, // Disable column width auto determining
        pagingType: 'full_numbers',　// Paging buttons contains "First", "Last", "Previous", "Next", and numbers
        language: {
            // I18n options, see https://datatables.net/reference/option/ for details
            paginate: {
                previous: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_PREV_PAGE'),
                next: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_NEXT_PAGE'),
                first: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_FIRST_PAGE'),
                last: $filter('translate')('pages.common.COMMON_BUTTONS.COMMON_BUTTON_LAST_PAGE')
            },
            emptyTable: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_EMPTY_TABLE'),
            info: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO'),
            infoFiltered: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_INFO_FILTERED'),
            infoEmpty: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PAGE_EMPTY'),
            lengthMenu: $filter('translate')('pages.common.COMMON_FIELDS.COMMON_FIELD_LENGTH_MENU'),
            processing: $filter('translate')('pages.common.COMMON_NOTIFICATION_TEXTS.COMMON_NOTIFICATION_PROCESSING')
        },
        ajax: {
            url: CLB_FRONT_BASE_URL + 'org/queryOrgWithFilter',
            data: $scope.fields,
            dataSrc: 'data'
        },
        columns: [
            // Specify which property to pick for the corresponding column
            {mData: 'seq'},
            {mData: 'orgId'},
            {mData: 'orgCode'},
            {mData: 'orgName'},
            {mData: 'orgPrincipalId'},
            {mData: 'username'},
            {mData: 'orgCompanyId'},
            {mData: 'companyName'},
            {mData: 'orgDescription'},
            {mData: 'orgCreateTime'},
            {mData: 'orgActive'},
            {mData: 'orgActiveStatus'}
        ],
        order: [[9, "desc"]]
    };

    // The column number to be hided
    var columnsToBeHided = {
        ORGID: 1,
        USERID: 4,
        COMPANYID: 6,
        STATUSID: 10
    };

    /* FIXME:
     * Temporarily workaround
     * The chosen dropdown will automatically set its width to 0,
     * we need to manually set the width to 100%.
     * Still we need an interval task to wait for the chosen finished initialization.
     */
    var fixChosenWidth = function () {
        var fixWidthIntervalTask = $interval(function () {
            if (angular.element('#stakeholder_chosen').attr('style') !== undefined
                && angular.element('#active_chosen').attr('style') !== undefined
                && angular.element('#logo_chosen').attr('style') !== undefined) {

                angular.element('#stakeholder_chosen').css('width', '100%');
                angular.element('#active_chosen').css('width', '100%');
                angular.element('#logo_chosen').css('width', '100%');

                $interval.cancel(fixWidthIntervalTask);
            }
        }, 100);
    };

    /* Search filter */
    /**
     * Search button behaviour
     */
    $scope.search = function () {
        // Format date
        if ($scope.fields.availTime !== '' && $scope.fields.availTime !== undefined) {
            $scope.fields.availTime = dateTimeUtils.getYyyyMmDd(new Date($scope.fields.availTime));
        }

        if ($scope.fields.expireTime !== '' && $scope.fields.expireTime !== undefined) {
            $scope.fields.expireTime = dateTimeUtils.getYyyyMmDd(new Date($scope.fields.expireTime));
        }

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblOrganizations');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    };

    /**
     * Clear button behaviour
     */
    $scope.clear = function () {

        // Clear Chosen dropdowns
     //   formUtils.resetChosen(angular.element('#formOrgFilter'));
    	$scope.selectedStakeholder.item=undefined;
    	 $scope.selectedActive.item=undefined;
    	 $scope.selectedLogo.item=undefined;
        // Clear input fields
        formUtils.clearForm($scope.fields);

        // Re-initialize the DataTables
        var dataTablesSelector = angular.element('#tblOrganizations');
        dataTableUtils.reinitDataTables(dataTablesSelector, $scope.dataTableParms);
        dataTableUtils.hideColumns(dataTablesSelector.DataTable(), columnsToBeHided);
        dataTableUtils.enableSingleSelect(dataTablesSelector);

    };

    /* End of search filter */

    // On document ready
    angular.element(function () {

        // Fetch stakeholders
        $http({
            method: 'GET',
            url: CLB_FRONT_BASE_URL + 'select/queryAllUser'
        }).then(function successCallback(response) {
            stakeholderResponse = response.data;

            if (stakeholderResponse.flag === 'success') {
            	$scope.stakeholders=stakeholderResponse.userInfo;
                $scope.names = stakeholderResponse.userInfo;
                
                shareDataService.org.setStakeholder($scope.names);
            }
        });

        // Fetch organization status (enabled, disabled)
        $http({
            method: 'POST',
            url: CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(function successCallback(response) {
            orgStatusResponse = response.data;

            if (orgStatusResponse.flag === 'success') {
                $scope.active = orgStatusResponse.active;
                shareDataService.org.setIsEnabled($scope.active);
            }
        });

        // Fetch logo
        $http({
            method: 'POST',
            url: CLB_FRONT_BASE_URL + 'select/queryCompany'
        }).then(function successCallback(response) {
            companyResponse = response.data;

            if (companyResponse.flag === 'success') {
                $scope.logo = companyResponse.companyInfo;
                shareDataService.org.setLogo($scope.logo);
            }
        });

    });
    
    $scope.clearSelect = function () {
        $scope.selectedActive.item = undefined;
        $scope.selectedActive.item = undefined;
        $scope.selectedLogo.item = undefined;
    };

    // When all of the contents are finished loading,
    // a $viewContentLoaded event will be emitted to the parent layer.
    // But we want to catch this event on this scope rather than the parent scope,
    // so we use $watch here to capture this event.
    $scope.$watch('$viewContentLoaded', function () {

        // Save the selector for better performance
        var tblOrganizations = angular.element('#tblOrganizations');

        // Enable row single selection
        dataTableUtils.enableSingleSelect(tblOrganizations);

        var dataTableIntervalTask = $interval(function () {

            // Check if the DataTable() method is defined
            // and if the #tblOrganization is successfully initialized as a "DataTable"
            if (tblOrganizations.DataTable !== undefined && $.fn.dataTable.isDataTable('#tblOrganizations')) {

                // Get the DataTable instance of the #tblOrganization
                var table = tblOrganizations.DataTable();

                // Hide a few rows
                dataTableUtils.hideColumns(table, columnsToBeHided);

                // Remove the interval task when finished
                $interval.cancel(dataTableIntervalTask);
            }
        }, 100);

        fixChosenWidth();

      /*  var fixChosenItemIntervalTask = $interval(function () {
            if (angular.element('#stakeholder').chosen !== undefined
                && angular.element('#active').chosen !== undefined
                && angular.element('#logo').chosen !== undefined) {

              //  angular.element('#stakeholder').chosen({allow_single_deselect: true});
                angular.element('#active').chosen({allow_single_deselect: true});
                angular.element('#logo').chosen({allow_single_deselect: true});

                $interval.cancel(fixChosenItemIntervalTask);
            }
        }, 100);*/
    });
});

app.controller('AccordionCtrl', function ($scope, $filter) {
    // Only one Accordion can be opened at the same time
    $scope.oneAtATime = true;

    // Title of the Accordion
    $scope.accordionTitle = $filter('translate')('pages.sm.org.ORG_MGMT_FORM_TITLES.ORG_MGMT_FORM_TITLE_SEARCH');

    // Initialize parameters for the Accordion
    $scope.status = {
        isFirstOpen: false,
        isFirstDisabled: false
    };
});

app.controller('AvailDateCtrl', function ($scope) {
    $scope.today = function () {
        $scope.dt = new Date().toISOString().slice(0, 10); // Pick the yyyy-MM-dd part
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
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
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    $scope.format = 'yyyy-MM-dd';
});

app.controller('ExpireDateCtrl', function ($scope) {
    $scope.today = function () {
        $scope.dt = new Date().toISOString().slice(0, 10); // Pick the yyyy-MM-dd part
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
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
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    $scope.format = 'yyyy-MM-dd';
});
