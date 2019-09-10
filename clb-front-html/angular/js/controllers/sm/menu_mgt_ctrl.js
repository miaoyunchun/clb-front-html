'use strict';

app.controller('MenuMgmtCtrl',function($scope, $element, $http, $filter, $timeout, $interval, toaster, shareDataService, dataTableUtils, dateTimeUtils, objectUtils){
	
	 // For saving AJAX response
	var menuStatusResponse = undefined;
	 // Pseudo node when no department found
    var pseudoNode = {
        label   : $filter('translate')('pages.sm.menu.MENU_MGMT_NOTIFICATION_TEXTS.MENU_MGMT_NOTIFICATION_NO_MENU_FOUND'),
        data    : {},
        children: [],
        classes : [],
        level   : -1
    };
	
 // Only make the form editable when editing
    $scope.isFormDisabled = true;
    $scope.isFormReadonly = false;
    $scope.isMenuIdReadonly = false;
    
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
    
    
	  // If it is performing async initialization
    $scope.doingAsync = false;

    // The percentage of the progressbar
    $scope.progressBarValue = 0;

    // The tree for storing departments from AJAX
    $scope.treeData = [];

    // Tree controller
    $scope.treeCtrl = {};
    
    // Active status
    $scope.activeStatus = {};
    // The selected status and its ID
    $scope.selectedActiveStatus = {};
    $scope.selectedActiveStatus.activeId = undefined;
    
 // Dynamically binding methods to the submit button
    $scope.submitBtnMethod = null;
    $scope.cancelBtnMethod = null;
    
    $scope.langType=sessionStorage.getItem('langType');
    $scope.menuIdDefault='menu_root';
    
    // The information of the selected menu
    // Some will be displayed on the right panel, some won't
    $scope.menuInfo = {
    		// Properties in this part will be sent to the service
    		'forSending' :{
    			'isEdited'                     : undefined,
    			'Id'                           : undefined,
    			'menuRequiredVo.menuId'        : undefined,
    			'menuRequiredVo.menuNameZhCn'  : undefined,
    			'menuRequiredVo.menuNameEn'    : undefined,
    			'menuRequiredVo.menuDescZhCn'  : undefined,
    			'menuRequiredVo.menuDescEn'    : undefined,
    			'menuRequiredVo.menuActive'    : $scope.selectedActiveStatus.activeId,
                'menuRequiredVo.menuOperatorId': sessionStorage.getItem('userId')
    		},
    		//Properties in this part is only for displaying
    		'menuParentId'		: undefined,
    		'menuParentNameZhCn': undefined,
    		'menuParentNameEn'	: undefined,
    		'menuParentName'	: undefined,
    		'menuLeaf'			: undefined,
    		'menuLeafTxt'		: undefined,
    		'menuLevel'			: undefined
    };
 // Save the information before editing
    $scope.menuInfoBeforeEdit = {
    		// Properties in this part will be sent to the service
    		'forSending' :{
    			'isEdited'                     : undefined,
    			'Id'                           : undefined,
    			'menuRequiredVo.menuId'        : undefined,
    			'menuRequiredVo.menuNameZhCn'  : undefined,
    			'menuRequiredVo.menuNameEn'    : undefined,
    			'menuRequiredVo.menuDescZhCn'  : undefined,
    			'menuRequiredVo.menuDescEn'    : undefined,
    			'menuRequiredVo.menuActive'    : $scope.selectedActiveStatus.activeId,
                'menuRequiredVo.menuOperatorId': sessionStorage.getItem('userId')
    		},
    		//Properties in this part is only for displaying
    		'menuParentId'		: undefined,
    		'menuParentNameZhCn': undefined,
    		'menuParentNameEn'	: undefined,
    		'menuParentName'	: undefined,
    		'menuLeaf'			: undefined,
    		'menuLeafTxt'		: undefined,
    		'menuLevel'			: undefined
    };
    $scope.enableAdd = function () {
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
    	 
    	$scope.newBranch = newBranch;
    	
    	enterAddMode();
    	
    	$scope.submitBtnMethod = doAdd;
        $scope.cancelBtnMethod = cancelAdd;
    }
    
    $scope.enableEdit = function () {
    	if ($scope.treeCtrl.get_selected_branch().level === -1) {
            showErrorToaster($filter('translate')('pages.sm.menu.MENU_MGMT_TOAST_TEXTS.MENU_MGMT_TOAST_TEXT_ADD_MENU_FIRST'));

            return;
        }
    	
    	angular.copy($scope.menuInfo,$scope.menuInfoBeforeEdit);
    	enterEditMode();
    	
    	 // Dynamically bind button ng-click target method
        $scope.submitBtnMethod = doUpdate;
        $scope.cancelBtnMethod = cancelEdit;
    	
    }
    
    $scope.enableRemove = function () {
        
        if ($scope.treeCtrl.get_selected_branch().level === -1) {
        	showErrorToaster($filter('translate')('pages.sm.menu.MENU_MGMT_TOAST_TEXTS.MENU_MGMT_TOAST_TEXT_ADD_MENU_FIRST'));

            return;
        }


        if ($scope.treeCtrl.get_selected_branch().children.length !== 0) {
            showErrorToaster($filter('translate')('pages.sm.menu.MENU_MGMT_TOAST_TEXTS.MENU_MGMT_TOAST_TEXT_NODE_HAS_CHILDREN_DELETE_NOT_ALLOWED'));

            return;
        }

        enterDeleteMode();

        $scope.submitBtnMethod = doDelete;
        $scope.cancelBtnMethod = cancelDelete;
    };
    
    /**
     * Pop a success type Toaster
     * @param message The message of the Toaster.
     */
    var showSuccessToaster = function (message) {
        $timeout(function () {
            toaster.pop(
                'success',
                $filter('translate')('pages.common.COMMON_TOAST_TITLES.COMMON_TOAST_TITLE_SUCCESSFUL'),
                message
            );
        }, 0);
    };
    /**
     * Pop a error type Toaster
     *
     * @param {string |  undefined} message The message of the toaster. The default message will be displayed if no message specified.
     */
    var showErrorToaster = function (message){
    	$timeout(function () {
            toaster.pop(
                'error',
                $filter('translate')('pages.common.COMMON_TOAST_TITLES.COMMON_TOAST_TITLE_ERROR'),
                message ? message : $filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_ERROR_OCCURRED')
            );
        }, 0);
    }
    
    var doAdd = function(){
    	$http({
    		method	: 'POST',
    		url		:  CLB_FRONT_BASE_URL+'menu/addNewMenuInfo',
    		params	: {
    			'menuRequiredVo.menuId'			: $scope.menuInfo['forSending']['menuRequiredVo.menuId'],
    			'menuRequiredVo.menuNameZhCn'	: $scope.menuInfo['forSending']['menuRequiredVo.menuNameZhCn'],
    			'menuRequiredVo.menuNameEn'		: $scope.menuInfo['forSending']['menuRequiredVo.menuNameEn'],
    			'menuRequiredVo.menuDescZhCn'	: $scope.menuInfo['forSending']['menuRequiredVo.menuDescZhCn'],
    			'menuRequiredVo.menuDescEn'		: $scope.menuInfo['forSending']['menuRequiredVo.menuDescEn'],
    			'menuRequiredVo.menuActive'		: $scope.menuInfo['forSending']['menuRequiredVo.menuActive'],
    			'menuRequiredVo.menuLevel'		: $scope.menuInfo['menuLevel'],
    			'menuRequiredVo.menuParentId'	: $scope.menuInfo['menuParentId'],
    			'menuRequiredVo.menuOperatorId'	: $scope.menuInfo['forSending']['menuRequiredVo.menuOperatorId']
    				
    		}
    	}).then(function successfullCallback(response){
    		var addNewMenuResp = response.data;
    		if(addNewMenuResp.flag === 'success'){
    			showSuccessToaster($filter('translate')('pages.sm.menu.MENU_MGMT_TOAST_TEXTS.MENU_MGMT_TOAST_TEXT_INSERT_SUCCESSFUL'));
    			var branch = $scope.treeCtrl.get_selected_branch();
                var parentBranch = $scope.treeCtrl.get_parent_branch(branch);
                
                if($scope.langType === 'en'){
                	branch.label = addNewMenuResp.menuInfoList[0].menuNameEn;
                }else{
                	branch.label = addNewMenuResp.menuInfoList[0].menuNameZhCn;
                }
                
                branch.data = addNewMenuResp.menuInfoList[0];
                branch.data.menuParentName = parentBranch ? parentBranch.data.menuNameZhCn+' | '+parentBranch.data.menuNameEn : '';
                
                $scope.menuInfo['forSending']['menuId'] = addNewMenuResp.menuInfoList[0].menuId;
                

                // Mark its parent branch not a leaf node if it has a parent branch
                if (parentBranch) {
                    parentBranch.data.menuLeaf = 0;
                }

                // Remove buttons' behaviour
                $scope.submitBtnMethod = null;
                $scope.cancelBtnMethod = null;

                // Lock the form, hide buttons
                exitAddMode();
    		}else{
    			showErrorToaster(addNewMenuResp['message']);
    		}
    	});
    	
    };
    
    /**
     * Perform the update
     */
    var doUpdate = function(frmMenuInfo){
    	$scope.menuInfo['isEdited'] = $scope.frmMenuInfo.$dirty;
    	$http({
    		method: 'POST',
    		url	  : CLB_FRONT_BASE_URL + 'menu/editMenuInfo',
    		params: {
    			'isEdited'						: $scope.menuInfo['isEdited'],
    			'Id'							: $scope.menuInfo['forSending']['Id'],
    			'menuRequiredVo.menuId'			: $scope.menuInfo['forSending']['menuRequiredVo.menuId'],
    			'menuRequiredVo.menuNameZhCn'		: $scope.menuInfo['forSending']['menuRequiredVo.menuNameZhCn'],
    			'menuRequiredVo.menuNameEn'		: $scope.menuInfo['forSending']['menuRequiredVo.menuNameEn'],
    			'menuRequiredVo.menuDescZhCn': $scope.menuInfo['forSending']['menuRequiredVo.menuDescZhCn'],
    			'menuRequiredVo.menuDescEn': $scope.menuInfo['forSending']['menuRequiredVo.menuDescEn'],
    			'menuRequiredVo.menuActive'		: $scope.menuInfo['forSending']['menuRequiredVo.menuActive'],
    			'menuRequiredVo.menuLevel'		: $scope.menuInfo['menuLevel'],
    			'menuRequiredVo.menuParentId'	: $scope.menuInfo['menuParentId'],
    			'menuRequiredVo.menuOperatorId'	: $scope.menuInfo['forSending']['menuRequiredVo.menuOperatorId']
    				
    		}
    	}).then(function successfulCallback(response){
    		if (response['data']['flag'] === 'success') {
    			// Pop a toaster
    			showSuccessToaster($filter('translate')('pages.sm.menu.MENU_MGMT_TOAST_TEXTS.MENU_MGMT_TOAST_TEXT_UPDATE_SUCCESSFUL'));
    			// Update the label for this branch
                var branch = $scope.treeCtrl.get_selected_branch();
                if($scope.langType === 'zh_cn'){
                	branch.label = $scope.menuInfo['forSending']['menuRequiredVo.menuNameZhCn'];
                }
                if($scope.langType === 'en'){
                	branch.label = $scope.menuInfo['forSending']['menuRequiredVo.menuNameEn'];
                }
                branch.data.menuActive = $scope.menuInfo['forSending']['menuRequiredVo.menuActive'];
                branch.data.menuNameZhCn = $scope.menuInfo['forSending']['menuRequiredVo.menuNameZhCn'];
                branch.data.menuNameEn = $scope.menuInfo['forSending']['menuRequiredVo.menuNameEn'];
                branch.data.menuDescZhCn = $scope.menuInfo['forSending']['menuRequiredVo.menuDescZhCn'];
                branch.data.menuDescEn = $scope.menuInfo['forSending']['menuRequiredVo.menuDescEn'];
                
             // Remove buttons' behaviour
                $scope.submitBtnMethod = null;
                $scope.cancelBtnMethod = null;

                // Lock the form, hide buttons
                exitEditMode();
    		}else{
    			$timeout(function () {
                    toaster.pop(
                        'error',
                        $filter('translate')('pages.common.COMMON_TOAST_TITLES.COMMON_TOAST_TITLE_ERROR'),
                        response['data']['message'] ? response['data']['message'] : $filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_ERROR_OCCURRED')
                    );
                }, 0);
    		}
    	});
    };
    
    var doDelete = function(){
    	 $http({
             method: 'POST',
             url   : CLB_FRONT_BASE_URL + 'menu/deleteMenuInfo',
             params: {
                 'menuRequiredVo.menuId'        : $scope.menuInfo['forSending']['menuRequiredVo.menuId'],
                 'menuRequiredVo.menuOperatorId': $scope.menuInfo['forSending']['menuRequiredVo.menuOperatorId']
             }
         }).then(function successfulCallback(response) {
             var respData = response.data;

             if (respData.flag === 'success') {
                 showSuccessToaster($filter('translate')('pages.sm.menu.MENU_MGMT_TOAST_TEXTS.MENU_MGMT_TOAST_TEXT_DELETE_SUCCESSFUL'));

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
             }else{
            	 showErrorToaster(respData.message)
             }
         });
    };
    
    
    $scope.chkMenuIdExistence = function(inputMenuId){
    	 // If is in editing mode
        // and the inputMenuId is not dirty
        if (inputMenuId.$pristine) {
        	inputMenuId.$setValidity('codeAvailable', true);
            return;
        }
        
        if (!$scope.isEditing || ($scope.isEditing && $scope.menuInfo['forSending']['menuRequiredVo.menuId'].toUpperCase() !== $scope.menuInfoBeforeEdit['forSending']['menuRequiredVo.menuId'].toUpperCase())) {
        	$http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'menu/isMenuIdExisted',
                params: {
                    'menuRequiredVo.menuId': $scope.menuInfo['forSending']['menuRequiredVo.menuId'],
                    'isEdited'             : inputMenuId.$dirty
                }
            }).then(function successfulCallback(response) {
            	inputMenuId.$setValidity('codeAvailable', response.data.flag === 'success');

                if (response.data.flag !== 'success') {
                    showErrorToaster($filter('translate')('pages.sm.menu.MENU_MGMT_TOAST_TEXTS.MENU_MGMT_TOAST_TEXT_INVALID_MENU_ID'));
                }
            });
        }
    };
    
    $scope.activeStatusSelectChanged = function () {
        $scope.menuInfo['forSending']['menuRequiredVo.menuActive'] = $scope.selectedActiveStatus.activeId;
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
        angular.copy($scope.menuInfoBeforeEdit, $scope.menuInfo);

        exitEditMode();
    };

    var cancelDelete = function () {
        exitDeleteMode();
    };
    
    
    $scope.selectedItemHandler = function (branch) {
    	// Remove form validation state when selecting a new item
        $scope.frmMenuInfo.$setPristine();
        
     // If the user selected another branch other than the current adding one
        // Then cancel the adding and exit the adding state
        if ($scope.isAdding && !$scope.isEditing && $scope.newBranch !== undefined && branch.uid !== $scope.newBranch.uid) {
            $scope.treeCtrl.remove_branch($scope.newBranch);

            exitAddMode();
        }
        
        // Append child nodes to current node if children exist
        if (branch.data.menuLeaf === 0 && branch.data.loaded === false) {
            $scope.doingAsync = true;
            $scope.progressBarValue = 20;

            // Perform the HTTP request first
            $http({
                method: 'POST',
                url   : CLB_FRONT_BASE_URL + 'menu/queryMenuInfo',
                params: {menuParentId: branch.data.menuId}
            }).then(function successfulCallback(response) {

                $scope.progressBarValue = 60;

                $.each(response.data.menuInfoList, function (index, item) {

                    // Construct each node
                	if($scope.langType === 'zh_cn'){
                		var child = {
                                label   : item.menuNameZhCn,
                                data    : item,
                                children: (item.depLeaf === 1 ? undefined : [])
                            };
                	}
                	if($scope.langType === 'en'){
                		var child = {
                                label   : item.menuNameEn,
                                data    : item,
                                children: (item.depLeaf === 1 ? undefined : [])
                            };
                	}
                    
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
        
     // If this branch has no menu ID
        // then we consider it a newly added branch
        if (!branch.data.menuId) {
            // Then we need some information about its parent branch
            var parentBranch = $scope.treeCtrl.get_parent_branch(branch);

            if (parentBranch !== undefined) {
                branch.data.menuParentId = parentBranch.data.menuId;
                branch.data.menuParentName = parentBranch.data.menuNameZhCn+' | '+parentBranch.data.menuNameEn;

                branch.data.menuLevel = parentBranch.data.menuLevel + 1;
            } else {
                branch.data.menuParentId = 'menu_root';
                branch.data.menuParentName = '';

                branch.data.menuLevel = 1;
            }
            
         // "Active" is the default value for the active status
            branch.data.menuActive = 1;
        }
        
     // Display the information about current node on the right panel
        $scope.menuInfo['forSending']['Id'] = branch.data.Id;
        $scope.menuInfo['forSending']['menuRequiredVo.menuId'] = branch.data.menuId;
        $scope.menuInfo['forSending']['menuRequiredVo.menuNameZhCn'] = branch.data.menuNameZhCn;
        $scope.menuInfo['forSending']['menuRequiredVo.menuNameEn'] = branch.data.menuNameEn;
        $scope.menuInfo['forSending']['menuRequiredVo.menuActive'] = branch.data.menuActive;
        $scope.selectedActiveStatus.activeId = String(branch.data.menuActive);
        $scope.menuInfo['forSending']['menuRequiredVo.menuDescZhCn'] = branch.data.menuDescZhCn;
        $scope.menuInfo['forSending']['menuRequiredVo.menuDescEn'] = branch.data.menuDescEn;
        $scope.menuInfo['forSending']['menuRequiredVo.menuId'] = branch.data.menuId;
        $scope.menuInfo['menuParentId']=branch.data.menuParentId;
        if(branch.data.menuParentName!==undefined){
        	$scope.menuInfo['menuParentName']=branch.data.menuParentName;
        }else{
        	$scope.menuInfo['menuParentName']=branch.data.menuParentId !== 'menu_root' ? branch.data.menuParentNameZhCn+'  |  '+branch.data.menuParentNameEn : $filter('translate')('pages.sm.menu.MENU_MGMT_FIELDS.MENU_MGMT_FIELD_MENU_NO_PARENT');
            
        }
         $scope.menuInfo['menuLeaf']=branch.data.menuLeaf;
        $scope.menuInfo['menuLeafTxt']=branch.data.menuLeaf === 0 ? $filter('translate')('pages.sm.menu.MENU_MGMT_FIELDS.MENU_MGMT_FIELD_MENU_HAS_LEAF') : $filter('translate')('pages.sm.menu.MENU_MGMT_FIELDS.MENU_MGMT_FIELD_MENU_HAS_NO_LEAF');
        $scope.menuInfo['menuLevel']=branch.data.menuLevel;
        
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
        $scope.isMenuIdReadonly = true;
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
        $scope.frmMenuInfo.$setPristine();

        $scope.newBranch = undefined;
    };

    /**
     * Disable editing
     */
    var exitEditMode = function () {
        $scope.isFormDisabled = true;
        $scope.isMenuIdReadonly = false;
        $scope.isButtonsDisabled = false;
        $scope.isSelectDisabled = false;
        $scope.isSubmitButtonHided = true;
        $scope.isCancelButtonHided = true;
        $scope.isEditing = false;

        // Remove form validation state when exiting
        $scope.frmMenuInfo.$setPristine();
    };

    /**
     * Only show buttons. Form remain read-only
     */
    var enterDeleteMode = function () {
        $scope.isFormDisabled = false;
        $scope.isFormReadonly = true;
        $scope.isMenuIdReadonly = true;
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
        $scope.isMenuIdReadonly = false;
        $scope.isButtonsDisabled = false;
        $scope.isSelectDisabled = false;
        $scope.isSubmitButtonHided = true;
        $scope.isCancelButtonHided = true;

        angular.element('#btnSubmit').removeClass('btn-danger').addClass('btn-success');
    };

    
    

    /**
     * Recursively set loaded flag for each node
     *
     * If the menuLeaf is 0, which means it is not a leaf node,
     * while the length of children is larger than 0,
     * then we can determine that this node is successfully loaded,
     * hence loaded will be set to true.
     *
     * But when the menuLeaf is 0 and the length of children is also 0,
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
            if (obj[i].data.menuLeaf === 0) {
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
     * Fetch menu status
     */
    var fetchActiveStatus = function () {
        $http({
            method: 'POST',
            url   : CLB_FRONT_BASE_URL + 'select/queryActive'
        }).then(function successCallback(response) {
        	menuStatusResponse = response.data;

            if (menuStatusResponse.flag === 'success') {
                $scope.activeStatus = menuStatusResponse.active;
                shareDataService.org.setIsEnabled($scope.activeStatus);
            }
        });
    };
    
    /**
     * Fetch a tree of menu
     *
     */
    var fetchMenuTree = function(item){
    	// Empty the tree before fetching data
        $scope.treeData = [];
        $http({
        	method: 'POST',
        	url	  :CLB_FRONT_BASE_URL+'menu/queryMenuInfo',
        	params:{
        		menuParentId : $scope.menuIdDefault
        	}
        }).then(function successfulCallback(response){
        	$scope.progressBarValue = 35;
        	
        	if(response.data.flag === 'success'){
        		$.each(response.data.menuInfoList,function (index,item){
        			
                 // Construct each node
                	if($scope.langType === 'zh_cn'){
                		var node = {
                                label   : item.menuNameZhCn,
                                data    : item,
                                children: (item.depLeaf === 1 ? undefined : [])
                            };
                	}
                	if($scope.langType === 'en'){
                		var node = {
                                label   : item.menuNameEn,
                                data    : item,
                                children: (item.depLeaf === 1 ? undefined : [])
                            };
                	}
                    
                    // And push it to the tree
                    $scope.treeData.push(node);
        		});
        		
        		$scope.progressBarValue = 60;
        		
        		 // Set additional attributes when finished
                $scope.treeData = setLoadStatus($scope.treeData);
                $scope.treeCtrl.select_first_branch();
        	}else{
        		$scope.treeCtrl.add_root_branch(pseudoNode);
                $scope.treeCtrl.select_branch(pseudoNode);
        	}
        	$scope.progressBarValue = 100;

          //  Finally hide the "Loading..." notification
            $scope.doingAsync = false;
        });
    }
   
    angular.element(function(){
    	$scope.doingAsync = true;
    	$scope.progressBarValue = 10;
    	// No parameter will be given when fetching for the first time
        fetchMenuTree(undefined);
        fetchActiveStatus();
   //     $.fn.zTree.init($("#treeMultiple"), setting, zNodes);
    });
});