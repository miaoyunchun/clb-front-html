'use strict';
/**
 * Utilities for popping Toasters
 *
 * Contains:
 *
 * showErrorToaster(message) - Pop a error toaster with message
 *
 * showSuccessToaster(message) - Pop a success toaster with message
 */
app.factory('toasterUtils', function ($timeout, $filter, toaster) {
    return {
        showErrorToaster  : showErrorToaster,
        showSuccessToaster: showSuccessToaster
    };

    /**
     * Pop a error type Toaster
     *
     * @param {string |  undefined} message The message of the toaster. The default message will be displayed if no message specified.
     */
    function showErrorToaster (message) {
        $timeout(function () {
            toaster.pop(
                'error',
                $filter('translate')('pages.common.COMMON_TOAST_TITLES.COMMON_TOAST_TITLE_ERROR'),
                message ? message : $filter('translate')('pages.common.COMMON_TOAST_TEXTS.COMMON_TOAST_TEXT_ERROR_OCCURRED')
            );
        }, 0);
    }

    /**
     * Pop a success type Toaster
     * @param message The message of the Toaster.
     */
    function showSuccessToaster (message) {
        $timeout(function () {
            toaster.pop(
                'success',
                $filter('translate')('pages.common.COMMON_TOAST_TITLES.COMMON_TOAST_TITLE_SUCCESSFUL'),
                message
            );
        }, 0);
    }
});