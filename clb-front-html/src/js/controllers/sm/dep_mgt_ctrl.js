'use strict';

app.controller('DepMgmtCtrl', function ($scope, $element, $http, $filter, $timeout, $interval, toaster, shareDataService, dataTableUtils, dateTimeUtils, toasterUtils) {

    // For saving AJAX response
    var stakeholderResponse = undefined;
    var orgStatusResponse = undefined;
    var organizationsResponse = undefined;

    // Pseudo node when no department found
    var pseudoNode = {
        label   : $filter('translate')('pages.sm.dep.DEP_MGMT_NOTIFICATION_TEXTS.DEP_MGMT_NOTIFICATION_NO_DEP_FOUND'),
        data    : {},
        children: [],
        classes : [],
        level   : -1
    };

    // Only make the form editable when editing
    $scope.isFormDisabled = true;
    $scope.isFormReadonly = false;

    // States
    $scope.isAdding = false;
    $scope.isEditing = false;

    $scope.newBranch = undefined;

    //Controls if all buttons should be disabled
    $scope.isButtonsDisabled = false;
    $scope.isSelectDisabled = false;
    // Control if the corresponding button will be displayed
    $scope.isSubmitButtonHided = true;
    $scope.isCancelButtonHided = true;

    // True if the user selected a department
    $scope.hasDepSelected = false;

    // If it is performing async initialization
    $scope.doingAsync = false;

    // The percentage of the progressbar
    $scope.progressBarValue = 0;

    // The tree for storing departments from AJAX
    $scope.treeData = [];

    // Tree controller
    $scope.treeCtrl = {};

    // Stakeholders
    $scope.names = {};
    // The selected stakeholder
    $scope.selectedName = {};
    $scope.selectedName.principalId = undefined;

    // Active status
    $scope.activeStatus = {};
    // The selected status and its ID
    $scope.selectedActiveStatus = {};
    $scope.selectedActiveStatus.activeId = undefined;

    // Organizations
    $scope.organizations = {};
    // The selected org and its ID
    $scope.selectedOrg = {};
    $scope.selectedOrg.orgId = Number(sessionStorage.getItem('orgId'));

    // Dynamically binding methods to the submit button
    $scope.submitBtnMethod = null;
    $scope.cancelBtnMethod = null;

    // Fetch the default organization code from session storage
    // The default organization will be set when logging in
    $scope.defaultOrgId = sessionStorage.getItem('orgId');

// The information of the selected department
    // Some will be displayed on the right panel, some won't
    $scope.depInfo = {
        // Properties in this part will be sent to the service
        'forSending'   : {
            'depId'                       : undefined,
            'isEdited'                    : undefined,
            'depRequiredVo.depCode'       : undefined,
            'depRequiredVo.depPrincipalId': undefined,
            'depRequiredVo.depName'       : undefined,
            'depRequiredVo.depDescription': undefined,
            'depRequiredVo.depActive'     : $scope.selectedActiveStatus.activeId,
            'depRequiredVo.orgId'         : $scope.selectedOrg.orgId,
            'depRequiredVo.depOperatorId' : sessionStorage.getItem('userId')
        },
        // Properties in this part is only for displaying
        'depParentId'  : undefined,
        'depParentName': undefined,
        'orgName'      : undefined,
        'depLeaf'      : undefined,
        'depLeafTxt'   : undefined,
        'depLevel'     : undefined,
        'depCreateTime': undefined
    };

    // Save the information before editing
    $scope.depInfoBeforeEdit = {
        'forSending'   : {
            'depId'                       : undefined,
            'isEdited'                    : undefined,
            'depRequiredVo.depCode'       : undefined,
            'depRequiredVo.depPrincipalId': undefined,
            'depRequiredVo.depName'       : undefined,
            'depRequiredVo.depDescription': undefined,
            'depRequiredVo.depEmail'      : undefined,
            'depRequiredVo.depTel'        : undefined,
            'depRequiredVo.depActive'     : undefined,
            'depRequiredVo.orgId'         : undefined,
            'depRequiredVo.depOperatorId' : sessionStorage.getItem('userId')
        },
        'depParentId'  : undefined,
        'depParentName': undefined,
        'orgName'      : undefined,
        'depLeaf'      : undefined,
        'depLeafTxt'   : undefined,
        'depLevel'     : undefined,
        'depCreateTime': undefined
    };

    $scope.enableAdd = function () {

        if (!$scope.hasDepSelected) {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));

            return;
        }

        var currentBranch = $scope.treeCtrl.get_selected_branch();

        var newBranch = {
            label   : '',
            data    : {},
            children: undefined
        };

        if (currentBranch.level === -1) {
            $scope.treeCtrl.remove_branch($scope.treeCtrl.get_selected_branch());

            $scope.treeCtrl.add_root_branch(newBranch);
        } else {
            $scope.treeCtrl.add_branch(currentBranch, newBranch);
        }

        $scope.treeCtrl.select_branch(newBranch);

        $scope.newBranch = newBranch;

        enterAddMode();

        $scope.submitBtnMethod = doAdd;
        $scope.cancelBtnMethod = cancelAdd;
    };

    $scope.enableAddRootNode = function () {
        var currentBranch = $scope.treeCtrl.get_selected_branch();
        var newBranch = {
            label   : '',
            data    : {},
            children: undefined
        };

        if (currentBranch && currentBranch.level === -1) {
            $scope.treeCtrl.remove_branch($scope.treeCtrl.get_selected_branch());
        }

        $scope.treeCtrl.add_root_branch(newBranch);
        $scope.treeCtrl.select_branch(newBranch);
        $scope.newBranch = newBranch;

        enterAddMode();

        $scope.submitBtnMethod = doAdd;
        $scope.cancelBtnMethod = cancelAdd;
    };

    /**
     * Show buttons, unlock the form
     */
    $scope.enableEdit = function () {

        if (!$scope.hasDepSelected) {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));

            return;
        }

        if ($scope.treeCtrl.get_selected_branch().level === -1) {
            toasterUtils.showErrorToaster($filter('translate')('pages.sm.dep.DEP_MGMT_TOAST_TEXTS.DEP_MGMT_TOAST_TEXT_ADD_DEP_FIRST'));

            return;
        }

        angular.copy($scope.depInfo, $scope.depInfoBeforeEdit);

        enterEditMode();

        // Dynamically bind button ng-click target method
        $scope.submitBtnMethod = doUpdate;
        $scope.cancelBtnMethod = cancelEdit;
    };

    $scope.enableRemove = function () {
        if (!$scope.hasDepSelected) {
            toasterUtils.showErrorToaster($filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_SELECT_ROW'));

            return;
        }

        if ($scope.treeCtrl.get_selected_branch().level === -1) {
            toasterUtils.showErrorToaster($filter('translate')('pages.sm.dep.DEP_MGMT_TOAST_TEXTS.DEP_MGMT_TOAST_TEXT_ADD_DEP_FIRST'));

            return;
        }

        if ($scope.treeCtrl.get_selected_branch().children.length !== 0) {
            toasterUtils.showErrorToaster($filter('translate')('pages.sm.dep.DEP_MGMT_TOAST_TEXTS.DEP_MGMT_TOAST_TEXT_NODE_HAS_CHILDREN_DELETE_NOT_ALLOWED'));

            return;
        }

        enterDeleteMode();

        $scope.submitBtnMethod = doDelete;
        $scope.cancelBtnMethod = cancelDelete;
    };

    /**
     * Remove the newly added branch
     */
    var cancelAdd = function () {
        exitAddMode();

        var currentBranch = $scope.treeCtrl.get_selected_branch();

        $scope.treeCtrl.select_prev_branch(currentBranch);

        $scope.treeCtrl.remove_branch(currentBranch);

        if ($scope.treeData.length === 0) {
            $scope.treeCtrl.add_root_branch(pseudoNode);
            $scope.treeCtrl.select_branch(pseudoNode);
        } else if ($scope.treeData.length === 1) {
            $scope.treeCtrl.select_first_branch();
        }
    };

    /**
     * Discard all modifies, lock the form, hide buttons
     */
    var cancelEdit = function () {
        angular.copy($scope.depInfoBeforeEdit, $scope.depInfo);

        exitEditMode();
    };

    var cancelDelete = function () {
        exitDeleteMode();
    };

    var doAdd = function () {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'dep/addNewDep',
            params: {
                'depRequiredVo.depParentId'   : $scope.depInfo['depParentId'],
                'depRequiredVo.depCode'       : $scope.depInfo['forSending']['depRequiredVo.depCode'],
                'depRequiredVo.depPrincipalId': $scope.depInfo['forSending']['depRequiredVo.depPrincipalId'],
                'depRequiredVo.depName'       : $scope.depInfo['forSending']['depRequiredVo.depName'],
                'depRequiredVo.depDescription': $scope.depInfo['forSending']['depRequiredVo.depDescription'],
                'depRequiredVo.depEmail'      : $scope.depInfo['forSending']['depRequiredVo.depEmail'],
                'depRequiredVo.depTel'        : $scope.depInfo['forSending']['depRequiredVo.depTel'],
                'depRequiredVo.depActive'     : $scope.depInfo['forSending']['depRequiredVo.depActive'],
                'depRequiredVo.orgId'         : $scope.depInfo['forSending']['depRequiredVo.orgId'],
                'depRequiredVo.depOperatorId' : $scope.depInfo['forSending']['depRequiredVo.depOperatorId'],
                'depRequiredVo.depLevel'      : $scope.depInfo['depLevel']
            }
        }).then(function successfulCallback(response) {
            var addNewDepResp = response.data;

            if (addNewDepResp.flag === 'success') {
                toasterUtils.showSuccessToaster($filter('translate')('pages.sm.dep.DEP_MGMT_TOAST_TEXTS.DEP_MGMT_TOAST_TEXT_INSERT_SUCCESSFUL'));

                var branch = $scope.treeCtrl.get_selected_branch();
                var parentBranch = $scope.treeCtrl.get_parent_branch(branch);

                branch.label = addNewDepResp.data.depName;
                branch.data = addNewDepResp.data;
                branch.data.depParentName = parentBranch ? parentBranch.data.depName : '';
                branch.data.depCreateTime = dateTimeUtils.getYyyyMmDd(new Date(addNewDepResp.data.depCreateTime));

                $scope.depInfo['forSending']['depId'] = addNewDepResp.data.depId;

                // Mark its parent branch not a leaf node if it has a parent branch
                if (parentBranch) {
                    parentBranch.data.depLeaf = 0;
                }

                // Remove buttons' behaviour
                $scope.submitBtnMethod = null;
                $scope.cancelBtnMethod = null;

                // Lock the form, hide buttons
                exitAddMode();
            } else {
                toasterUtils.showErrorToaster(addNewDepResp['message']);
            }
        });
    };

    /**
     * Perform the update
     */
    var doUpdate = function () {

        $scope.depInfo['forSending']['isEdited'] = $scope.frmDepInfo.$dirty;

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'dep/editDepartment',
            params: {
                'depId'                       : $scope.depInfo['forSending']['depId'],
                'isEdited'                    : $scope.depInfo['forSending']['isEdited'],
                'depRequiredVo.depCode'       : $scope.depInfo['forSending']['depRequiredVo.depCode'],
                'depRequiredVo.depPrincipalId': $scope.depInfo['forSending']['depRequiredVo.depPrincipalId'],
                'depRequiredVo.depName'       : $scope.depInfo['forSending']['depRequiredVo.depName'],
                'depRequiredVo.depDescription': $scope.depInfo['forSending']['depRequiredVo.depDescription'],
                'depRequiredVo.depEmail'      : $scope.depInfo['forSending']['depRequiredVo.depEmail'],
                'depRequiredVo.depTel'        : $scope.depInfo['forSending']['depRequiredVo.depTel'],
                'depRequiredVo.depActive'     : $scope.depInfo['forSending']['depRequiredVo.depActive'],
                'depRequiredVo.orgId'         : $scope.depInfo['forSending']['depRequiredVo.orgId'],
                'depRequiredVo.depOperatorId' : $scope.depInfo['forSending']['depRequiredVo.depOperatorId'],
                'depRequiredVo.depLevel'      : $scope.depInfo['depLevel'],
                'depRequiredVo.depParentId'   : $scope.depInfo['depParentId']
            }
        }).then(function successfulCallback(response) {

            if (response['data']['flag'] === 'success') {

                // Pop a toaster
                toasterUtils.showSuccessToaster($filter('translate')('pages.sm.dep.DEP_MGMT_TOAST_TEXTS.DEP_MGMT_TOAST_TEXT_UPDATE_SUCCESSFUL'));

                // Update the label for this branch
                var branch = $scope.treeCtrl.get_selected_branch();
                branch.label = $scope.depInfo['forSending']['depRequiredVo.depName'];
                branch.data.depActive = $scope.depInfo['forSending']['depRequiredVo.depActive'];
                branch.data.depDescription = $scope.depInfo['forSending']['depRequiredVo.depDescription'];
                branch.data.depEmail = $scope.depInfo['forSending']['depRequiredVo.depEmail'];
                branch.data.depName = $scope.depInfo['forSending']['depRequiredVo.depName'];
                branch.data.depPrincipalId = $scope.depInfo['forSending']['depRequiredVo.depPrincipalId'];
                branch.data.depTel = $scope.depInfo['forSending']['depRequiredVo.depTel'];

                // Remove buttons' behaviour
                $scope.submitBtnMethod = null;
                $scope.cancelBtnMethod = null;

                // Lock the form, hide buttons
                exitEditMode();

            } else {
                toasterUtils.showErrorToaster(response['data']['message']);
            }
        });
    };

    var doDelete = function () {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'dep/deleteDepartment',
            params: {
                'depId'                      : $scope.depInfo['forSending']['depId'],
                'depRequiredVo.depOperatorId': $scope.depInfo['forSending']['depRequiredVo.depOperatorId']
            }
        }).then(function successfulCallback(response) {
            var respData = response.data;

            if (respData.flag === 'success') {
                toasterUtils.showSuccessToaster($filter('translate')('pages.sm.dep.DEP_MGMT_TOAST_TEXTS.DEP_MGMT_TOAST_TEXT_DELETE_SUCCESSFUL'));

                var currentBranch = $scope.treeCtrl.get_selected_branch();

                var parentBranch = $scope.treeCtrl.get_parent_branch(currentBranch);

                $scope.treeCtrl.remove_branch(currentBranch);

                if (!parentBranch) {
                    $scope.treeCtrl.select_first_branch();
                } else if (parentBranch.children.length === 0) {
                    parentBranch.data.depLeaf = 1;
                    parentBranch.noLeaf = false;
                    $scope.treeCtrl.select_parent_branch(currentBranch);
                }

                exitDeleteMode();
            } else {
                toasterUtils.showErrorToaster(respData.message);
            }
        });
    };

    $scope.chkDepCodeExistence = function (inputDepCode) {
        // If is in editing mode
        // and the department code is not dirty
        if (inputDepCode.$pristine) {
            inputDepCode.$setValidity('codeAvailable', true);
            return;
        }

        if (!$scope.isEditing || ($scope.isEditing && $scope.depInfo['forSending']['depRequiredVo.depCode'].toUpperCase() !== $scope.depInfoBeforeEdit['forSending']['depRequiredVo.depCode'].toUpperCase())) {
            $http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'dep/isDepCodeExisted',
                params: {
                    'depRequiredVo.depCode': $scope.depInfo['forSending']['depRequiredVo.depCode'],
                    'isEdited'             : inputDepCode.$dirty
                }
            }).then(function successfulCallback(response) {
                inputDepCode.$setValidity('codeAvailable', response.data.flag === 'success');

                if (response.data.flag !== 'success') {
                    toasterUtils.showErrorToaster($filter('translate')('pages.sm.dep.DEP_MGMT_TOAST_TEXTS.DEP_MGMT_TOAST_TEXT_INVALID_DEP_CODE'));
                }
            });
        }
    };

    $scope.activeStatusSelectChanged = function () {
        $scope.depInfo['forSending']['depRequiredVo.depActive'] = $scope.selectedActiveStatus.activeId;
    };

    $scope.stakeholderSelectChanged = function () {
        $scope.depInfo['forSending']['depRequiredVo.depPrincipalId'] = $scope.selectedName.principalId;
    };

    /**
     * Defines the behaviour when a node has been selected.
     *
     * In this case, we will first check if this node has children.
     * If it has children, then we perform a http request,
     * then append the nodes in the response to the parent's children[].
     * Finally we display the selected node's information on the right panel.
     *
     * If it has no children, then simply display it.
     *
     * @param branch The selected branch
     *
     * @param branch.data The data of this branch
     * @param branch.data.depId Department ID of this node
     * @param branch.data.depCode Department code of this node
     * @param branch.data.depName Department name of this node
     * @param branch.data.depDescription Department name of this node
     * @param branch.data.depEmail E-Mail address of this department
     * @param branch.data.depTel This department's telephone
     * @param branch.data.depParentId Parent node ID of this node
     * @param branch.data.depParentName Parent node name of this node
     * @param branch.data.depPrincipalId Stakeholder ID of this node
     * @param branch.data.depPrincipalName Stakeholder name of this node
     * @param branch.data.orgId ID of the organization this department belongs to
     * @param branch.data.orgName Name of the organization this department belongs to
     * @param branch.data.depActive Status ID of this node
     * @param branch.data.depActiveStatus Status text of this node
     * @param branch.data.depLeaf Is this node a leaf node
     * @param branch.data.depLevel Level of this node
     * @param branch.data.depCreateTime Create date of this node
     * @param branch.data.loaded Is this node finished loading its children
     *
     * @param branch.children Children nodes belong to this node
     * @param branch.classes The CSS classes for this node
     * @param branch.uid The UID of the branch
     */
    $scope.selectedItemHandler = function (branch) {
        // Remove form validation state when selecting a new item
        $scope.frmDepInfo.$setPristine();

        $scope.hasDepSelected = true;

        // If the user selected another branch other than the current adding one
        // Then cancel the adding and exit the adding state
        if ($scope.isAdding && !$scope.isEditing && $scope.newBranch !== undefined && branch.uid !== $scope.newBranch.uid) {
            $scope.treeCtrl.remove_branch($scope.newBranch);

            exitAddMode();
        }

        // Append child nodes to current node if children exist
        if (branch.data.depLeaf === 0 && branch.data.loaded === false) {
            $scope.doingAsync = true;
            $scope.progressBarValue = 20;

            // Perform the HTTP request first
            $http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'dep/querydepWithFilter',
                params: {depParentId: branch.data.depId}
            }).then(function successfulCallback(response) {

                $scope.progressBarValue = 60;

                $.each(response.data.data, function (index, item) {

                    // Construct each node
                    var child = {
                        label   : item.depName,
                        data    : item,
                        children: (item.depLeaf === 1 ? undefined : [])
                    };

                    // And push it to the tree if this node has children
                    if (branch.children !== undefined) {
                        branch.children.push(child);
                    }
                });

                // Finally set load status for this branch
                branch = setLoadStatus(branch.children);

                $scope.progressBarValue = 100;
                $scope.doingAsync = false;
            });

            // Set additional attributes
            branch.data.loaded = true;
        }

        // If this branch has no department ID
        // then we consider it a newly added branch
        if (!branch.data.depId) {
            // Then we need some information about its parent branch
            var parentBranch = $scope.treeCtrl.get_parent_branch(branch);

            if (parentBranch !== undefined) {
                branch.data.depParentId = parentBranch.data.depId;
                branch.data.depParentName = parentBranch.data.depName;

                branch.data.depLevel = parentBranch.data.depLevel + 1;
            } else {
                branch.data.depParentId = 0;
                branch.data.depParentName = '';

                branch.data.depLevel = 1;
            }


            // "Active" is the default value for the active status
            branch.data.depActive = 1;

            // Set which organization this department belongs to
            branch.data.orgId = $scope.selectedOrg.orgId ? $scope.selectedOrg.orgId : $scope.defaultOrgId;

            // This is just for displaying
            branch.data.depCreateTime = dateTimeUtils.getYyyyMmDd(new Date());
        }

        // Display the information about current node on the right panel
        $scope.depInfo['forSending']['depId'] = branch.data.depId;
        $scope.depInfo['forSending']['depRequiredVo.depCode'] = branch.data.depCode;
        $scope.depInfo['forSending']['depRequiredVo.depName'] = branch.data.depName;
        $scope.depInfo['forSending']['depRequiredVo.depDescription'] = branch.data.depDescription;
        $scope.depInfo['forSending']['depRequiredVo.depEmail'] = branch.data.depEmail;
        $scope.depInfo['forSending']['depRequiredVo.depTel'] = branch.data.depTel;
        $scope.depInfo['forSending']['depRequiredVo.depPrincipalId'] = branch.data.depPrincipalId;
        $scope.selectedName.principalId = Number(branch.data.depPrincipalId);
        $scope.depInfo['forSending']['depRequiredVo.orgId'] = branch.data.orgId;
        $scope.depInfo['forSending']['depRequiredVo.depActive'] = branch.data.depActive;
        $scope.selectedActiveStatus.activeId = String(branch.data.depActive);
        $scope.depInfo['depParentId'] = branch.data.depParentId;
        $scope.depInfo['depParentName'] = branch.data.depParentId !== 0 ? branch.data.depParentName : $filter('translate')('pages.sm.dep.DEP_MGMT_FIELDS.DEP_MGMT_FIELD_DEP_NO_PARENT');
        $scope.depInfo['orgName'] = branch.data.orgName;
        $scope.depInfo['depLeaf'] = branch.data.depLeaf;
        $scope.depInfo['depLeafTxt'] = branch.data.depLeaf === 0 ? $filter('translate')('pages.sm.dep.DEP_MGMT_FIELDS.DEP_MGMT_FIELD_DEP_HAS_LEAF') : $filter('translate')('pages.sm.dep.DEP_MGMT_FIELDS.DEP_MGMT_FIELD_DEP_HAS_NO_LEAF');
        $scope.depInfo['depLevel'] = branch.data.depLevel;
        $scope.depInfo['depCreateTime'] = branch.data.depCreateTime;
    };

    /**
     * Enter adding new item mode
     */
    var enterAddMode = function () {
        $scope.isFormDisabled = false;
        $scope.isButtonsDisabled = true;
        $scope.isSelectDisabled = true;
        $scope.isSubmitButtonHided = false;
        $scope.isCancelButtonHided = false;
        $scope.isAdding = true;
    };

    /**
     * Enable editing
     */
    var enterEditMode = function () {
        $scope.isFormDisabled = false;
        $scope.isButtonsDisabled = true;
        $scope.isSelectDisabled = true;
        $scope.isSubmitButtonHided = false;
        $scope.isCancelButtonHided = false;
        $scope.isEditing = true;
    };

    /**
     * Exit adding new item mode
     */
    var exitAddMode = function () {
        $scope.isFormDisabled = true;
        $scope.isButtonsDisabled = false;
        $scope.isSelectDisabled = false;
        $scope.isSubmitButtonHided = true;
        $scope.isCancelButtonHided = true;
        $scope.isAdding = false;

        // Remove form validation state when exiting
        $scope.frmDepInfo.$setPristine();

        $scope.newBranch = undefined;
    };

    /**
     * Disable editing
     */
    var exitEditMode = function () {
        $scope.isFormDisabled = true;
        $scope.isButtonsDisabled = false;
        $scope.isSelectDisabled = false;
        $scope.isSubmitButtonHided = true;
        $scope.isCancelButtonHided = true;
        $scope.isEditing = false;

        // Remove form validation state when exiting
        $scope.frmDepInfo.$setPristine();
    };

    /**
     * Only show buttons. Form remain read-only
     */
    var enterDeleteMode = function () {
        $scope.isFormDisabled = false;
        $scope.isFormReadonly = true;
        $scope.isButtonsDisabled = true;
        $scope.isSelectDisabled = true;
        $scope.isSubmitButtonHided = false;
        $scope.isCancelButtonHided = false;

        angular.element('#btnSubmit').removeClass('btn-success').addClass('btn-danger');
    };

    /**
     * Hide buttons. Form remain read-only
     */
    var exitDeleteMode = function () {
        $scope.isFormDisabled = true;
        $scope.isFormReadonly = false;
        $scope.isButtonsDisabled = false;
        $scope.isSelectDisabled = false;
        $scope.isSubmitButtonHided = true;
        $scope.isCancelButtonHided = true;

        angular.element('#btnSubmit').removeClass('btn-danger').addClass('btn-success');
    };

    /**
     * Recursively set loaded flag for each node
     *
     * If the depLeaf is 0, which means it is not a leaf node,
     * while the length of children is larger than 0,
     * then we can determine that this node is successfully loaded,
     * hence loaded will be set to true.
     *
     * But when the depLeaf is 0 and the length of children is also 0,
     * which means this node has child nodes, but not loaded yet.
     * So the loaded flag should be false.
     *
     * @param obj The tree object
     * @param obj.data The data of this node
     * @param obj.data.depLeaf Is this node a leaf node
     * @param obj.data.loaded Is this node finished loading its children nodes
     * @param obj.children The children nodes of this node
     * @param obj.noLeaf Mark this node not a leaf node
     * @returns {*} The marked tree object
     */
    var setLoadStatus = function (obj) {
        var keys = Object.keys(obj);

        for (var i in keys) {
            // If this node is not a leaf node
            if (obj[i].data.depLeaf === 0) {
                // Mark it
                obj[i].noLeaf = true;
                if (obj[i].children.length > 0) {
                    obj[i].data.loaded = true;
                    setLoadStatus(obj[i].children);
                } else {
                    obj[i].data.loaded = false;
                }
            }
        }

        return obj;
    };

    /**
     * Fetch stakeholders
     */
    var fetchStakeHolder = function () {
        // Fetch stakeholders
        $http({
            method: 'GET',
            url   : CLB_FRONT_BASE_URL + 'select/queryAllUser'
        }).then(function successCallback(response) {
            stakeholderResponse = response.data;

            if (stakeholderResponse.flag === 'success') {
                $scope.names = stakeholderResponse.userInfo;
                shareDataService.org.setStakeholder($scope.names);
            } else {
                toasterUtils.showErrorToaster(stakeholderResponse.message);
            }
        });
    };

    /**
     * Fetch department status
     */
    var fetchActiveStatus = function () {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(function successCallback(response) {
            orgStatusResponse = response.data;

            if (orgStatusResponse.flag === 'success') {
                $scope.activeStatus = orgStatusResponse.active;
                shareDataService.org.setIsEnabled($scope.activeStatus);
            } else {
                toasterUtils.showErrorToaster(orgStatusResponse.message);
            }
        });
    };

    /**
     * Fetch a list of organizations
     */
    var fetchOrganizations = function () {
        $http({
            method: 'GET',
            url   : CLB_FRONT_BASE_URL + 'select/queryOrganizationName'
        }).then(function successCallback(response) {
            organizationsResponse = response.data;

            if (organizationsResponse.flag === 'success') {
                $scope.organizations = organizationsResponse['organizationInfo'];
            } else {
                toasterUtils.showErrorToaster(organizationsResponse.message);
            }
        });
    };

    /**
     * Fetch a tree of departments
     *
     * @param item The object of the selected item
     * @param item.orgId The ID of the selected organization
     * @param item.orgName The name of the selected organization
     * @param model The value of the selected item
     */
    var fetchDepTree = function (item, model) {

        // Empty the tree before fetching data
        $scope.treeData = [];

        if (item && model) {
            $scope.selectedOrg = item;
            $scope.selectedOrg.orgId = model;
        }

        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'dep/querydepWithFilter',
            params: {
                orgId: ($scope.selectedOrg.orgId !== undefined ? $scope.selectedOrg.orgId : $scope.defaultOrgId)
            }
        }).then(function successfulCallback(response) {

            $scope.progressBarValue = 35;

            if (response.data.flag === 'success') {
                $.each(response.data.data, function (index, item) {

                    // Construct each node
                    var node = {
                        label   : item.depName,
                        data    : item,
                        children: (item.depLeaf === 1 ? undefined : [])
                    };

                    // And push it to the tree
                    $scope.treeData.push(node);
                });

                $scope.progressBarValue = 60;

                // Set additional attributes when finished
                $scope.treeData = setLoadStatus($scope.treeData);

                $scope.treeCtrl.select_first_branch();
            } else {
                $scope.treeCtrl.add_root_branch(pseudoNode);
                $scope.treeCtrl.select_branch(pseudoNode);
            }

            $scope.progressBarValue = 100;

            // Finally hide the "Loading..." notification
            $scope.doingAsync = false;
        });
    };

    $scope.fetchDepTree = fetchDepTree;

    angular.element(function () {
        $scope.doingAsync = true;

        $scope.progressBarValue = 10;

        fetchOrganizations();

        // No parameter will be given when fetching for the first time
        fetchDepTree(undefined, undefined);

        fetchStakeHolder();

        fetchActiveStatus();
    });

});
