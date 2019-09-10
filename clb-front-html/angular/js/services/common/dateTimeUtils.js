'use strict';
/**
 * Utilities for manipulating date and time
 *
 * Contains:
 *
 * getYyyyMmDd() - Get a yyyy-MM-dd format string from a Date object
 */
app.factory('dateTimeUtils', function () {
    return {
        getYyyyMmDd: getYyyyMmDd
    };

    /**
     * Get a yyyy-MM-dd format string from a Date object
     * @param date The Date object
     * @returns {string} The yyyy-MM-dd string
     */
    function getYyyyMmDd(date) {
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [
            date.getFullYear(),
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd
        ].join('-');
    }
});