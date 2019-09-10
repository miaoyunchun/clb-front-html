'use strict';

app.factory('shareDataService', function ($filter) {

    var common = {
        selectedRowItems   : {},
        regexCharactersOnly: '^([A-Za-z])+',
        regexUsername      : '([A-Za-z0-9]+\\.[A-Za-z0-9]+)|([A-Za-z0-9]+)',
        regexTelNbr        : '((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)',
        regexCode          : '^[A-Za-z0-9]+$'
    };

    var org = {
        placeholders: {
            orgNo      : $filter('translate')('pages.sm.org.ORG_MGMT_PLACEHOLDERS.ORG_MGMT_PLACEHOLDER_ORG_NO'),
            orgName    : $filter('translate')('pages.sm.org.ORG_MGMT_PLACEHOLDERS.ORG_MGMT_PLACEHOLDER_ORG_NAME'),
            orgPer     : $filter('translate')('pages.sm.org.ORG_MGMT_PLACEHOLDERS.ORG_MGMT_PLACEHOLDER_STAKEHOLDER'),
            description: $filter('translate')('pages.sm.org.ORG_MGMT_PLACEHOLDERS.ORG_MGMT_PLACEHOLDER_DESCRIPTION'),
            availDate  : $filter('translate')('pages.sm.org.ORG_MGMT_PLACEHOLDERS.ORG_MGMT_PLACEHOLDER_AVAIL_DATE'),
            expireDate : $filter('translate')('pages.sm.org.ORG_MGMT_PLACEHOLDERS.ORG_MGMT_PLACEHOLDER_EXPIRE_DATE'),
            orgNoRule  : $filter('translate')('pages.sm.org.ORG_MGMT_PLACEHOLDERS.ORG_MGMT_PLACEHOLDER_ORG_NO_RULE'),
            orgNameRule: $filter('translate')('pages.sm.org.ORG_MGMT_PLACEHOLDERS.ORG_MGMT_PLACEHOLDER_ORG_NAME_RULE'),
            orgDescRule: $filter('translate')('pages.sm.org.ORG_MGMT_PLACEHOLDERS.ORG_MGMT_PLACEHOLDER_ORG_DESC_RULE')
        },
        items       : {
            stakeholders: [],
            active      : [],
            company     : []
        }
    };

    var dep = {
        placeholders: {
            depNo      : $filter('translate')('pages.sm.dep.DEP_MGMT_PLACEHOLDERS.DEP_MGMT_PLACEHOLDER_DEP_NO'),
            depName    : $filter('translate')('pages.sm.dep.DEP_MGMT_PLACEHOLDERS.DEP_MGMT_PLACEHOLDER_DEP_NAME'),
            depPer     : $filter('translate')('pages.sm.dep.DEP_MGMT_PLACEHOLDERS.DEP_MGMT_PLACEHOLDER_STAKEHOLDER'),
            description: $filter('translate')('pages.sm.dep.DEP_MGMT_PLACEHOLDERS.DEP_MGMT_PLACEHOLDER_DESCRIPTION'),
            availDate  : $filter('translate')('pages.sm.dep.DEP_MGMT_PLACEHOLDERS.DEP_MGMT_PLACEHOLDER_AVAIL_DATE'),
            expireDate : $filter('translate')('pages.sm.dep.DEP_MGMT_PLACEHOLDERS.DEP_MGMT_PLACEHOLDER_EXPIRE_DATE'),
            depNoRule  : $filter('translate')('pages.sm.dep.DEP_MGMT_PLACEHOLDERS.DEP_MGMT_PLACEHOLDER_DEP_NO_RULE'),
            depNameRule: $filter('translate')('pages.sm.dep.DEP_MGMT_PLACEHOLDERS.DEP_MGMT_PLACEHOLDER_DEP_NAME_RULE'),
            depDescRule: $filter('translate')('pages.sm.dep.DEP_MGMT_PLACEHOLDERS.DEP_MGMT_PLACEHOLDER_DEP_DESC_RULE')
        }
    };

    var pos = {
        placeholders: {
            posNo  : $filter('translate')('pages.sm.pos.POS_MGMT_PLACEHOLDERS.POS_MGMT_PLACEHOLDER_POS_CODE'),
            posName: $filter('translate')('pages.sm.pos.POS_MGMT_PLACEHOLDERS.POS_MGMT_PLACEHOLDER_POS_NAME'),
            posDesc: $filter('translate')('pages.sm.pos.POS_MGMT_PLACEHOLDERS.POS_MGMT_PLACEHOLDER_POS_DESC_RULE')
        },
        items       : {
            depName: [],
            orgName: [],
            active : []
        }
    };

    var user = {
        placeholders: {
            username: $filter('translate')('pages.sm.user.USER_MGMT_PLACEHOLDERS.USER_MGMT_PLACEHOLDER_USERNAME'),
            password: $filter('translate')('pages.sm.user.USER_MGMT_PLACEHOLDERS.USER_MGMT_PLACEHOLDER_PASSWORD'),
            telNbr  : $filter('translate')('pages.sm.user.USER_MGMT_PLACEHOLDERS.USER_MGMT_PLACEHOLDER_TEL_NBR')
        },
        items       : {
            organizations: [],
            departments  : [],
            positions    : [],
            status       : []
        }
    };

    var role = {
        placeholders: {
            roleName: $filter('translate')('pages.sm.role.ROLE_MGMT_PLACEHOLDERS.ROLE_MGMT_PLACEHOLDER_ROLE_NAME')
        }
    };

    var service = {
        serviceInfo: {
            svcSysName        : undefined,
            svcModuleName     : undefined,
            svcSysAlias       : undefined,
            svcFunctionName   : undefined,
            svcDescriptionZhCn: undefined,
            svcDescriptionEn  : undefined,
            orgId             : undefined,
            svcOperatorId     : undefined
        }
    };


    return {
        common : {
            setSelectedRowItems   : setSelectedRowItems,
            getSelectedRowItems   : getSelectedRowItems,
            getCharactersOnlyRegex: getCharactersOnlyRegex,
            getRegexTelNbr        : getRegexTelNbr,
            getRegexUsername      : getRegexUsername,
            getRegexCode          : getRegexCode
        },
        org    : {
            getPlaceHolders: getOrgPlaceholders,
            setStakeholder : setOrgStakeholder,
            getStakeholder : getOrgStakeholder,
            setIsEnabled   : setOrgIsEnabled,
            getIsEnabled   : getOrgIsEnabled,
            setLogo        : setLogo,
            getLogo        : getLogo
        },
        dep    : {
            getDepPlaceholders: getDepPlaceholders
        },
        pos    : {
            getPosPlaceholders: getPosPlaceholders
        },
        user   : {
            getUserPlaceholders: getUserPlaceholders
        },
        role   : {
            getRolePlaceholders: getRolePlaceholders
        },
        service: {
            getServiceInfo: getServiceInfo,
            setServiceInfo: setServiceInfo
        }
    };

    /* Common items */
    function setSelectedRowItems(_selectedRowItems) {
        common.selectedRowItems = _selectedRowItems;
    }

    function getSelectedRowItems() {
        return common.selectedRowItems;
    }

    /**
     * Returns a regex for matching telephone number
     *
     * Matches:
     * <ul>
     *     <li> 11-digit mobile phone number like 13100001111
     *     <li> 7 or 8-digit telephone number like 3353221 or 31268010
     *     <li> 7 or 8-digit telephone number followed with 1 to 4-digit extention like 31268010-2203
     *     <li> 3 or 4-digit area code followed with 7 or 8-digit telephone number like 021-31268010
     *     <li> 3 or 4-digit area code followed with 7 or 8-digit telephone number and 1 to 4-digit extention like 021-31268010-2203
     * </ul>
     *
     * @returns {string}
     */
    function getRegexTelNbr() {
        return common.regexTelNbr;
    }

    function getRegexUsername() {
        return common.regexUsername;
    }

    function getRegexCode() {
        return common.regexCode;
    }

    function getCharactersOnlyRegex() {
        return common.regexCharactersOnly;
    }

    /* End of common items */

    /* Org. mgmt */
    function setOrgStakeholder(stakeholder) {
        org.items.stakeholders = stakeholder;
    }

    function getOrgStakeholder() {
        return org.items.stakeholders;
    }

    function setOrgIsEnabled(isEnabled) {
        org.items.active = isEnabled;
    }

    function getOrgIsEnabled() {
        return org.items.active;
    }

    function setLogo(logo) {
        org.items.company = logo;
    }

    function getLogo() {
        return org.items.company;
    }

    function getOrgPlaceholders() {
        return org.placeholders;
    }

    /* End of org. mgmt */

    /* Dep. mgmt */
    function getDepPlaceholders() {
        return dep.placeholders;
    }


    /*Pos. mgt*/
    function getPosPlaceholders() {
        return pos.placeholders;
    }

    /* End of pos. mgt*/


    /* End of dep. mgmt */

    /* User mgmt */
    function getUserPlaceholders() {
        return user.placeholders;
    }

    /* End of user mgmt */

    /* Role management */
    function getRolePlaceholders() {
        return role.placeholders;
    }

    /* End of role management */

    /* Service management */
    function getServiceInfo() {
        return service.serviceInfo;
    }

    function setServiceInfo(_serviceInfo) {
        service.serviceInfo = _serviceInfo;
    }

    /* End of service management */

});