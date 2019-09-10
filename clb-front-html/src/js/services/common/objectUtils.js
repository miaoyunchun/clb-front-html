'use strict';

app.factory('objectUtils', function () {

    return {
        getKeyByValue     : getKeyByValue,
        getPropertyByValue: getPropertyByValue,
        hasEmptyProperty  : hasEmptyProperty
    };

    /**
     * Get key by value
     * @param obj Where should I find
     * @param value Which one you want
     * @param valuePropertyName Which property reflects the value if there is any
     * @returns {string} The key
     */
    function getKeyByValue(obj, value, valuePropertyName) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (valuePropertyName && obj[prop][valuePropertyName] === value) {
                    return prop;
                } else if (obj[prop] === value) {
                    return prop;
                }
            }
        }
    }

    /**
     * Get the property contains the value
     * @param obj Where should I find
     * @param value Which one you want
     * @param {string | undefined} valuePropertyName Which property reflects the value if there is any
     * @returns {*} The property
     */
    function getPropertyByValue(obj, value, valuePropertyName) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (obj[prop][valuePropertyName] === value) {
                    return obj[prop];
                }
            }
        }
        return null;
    }

    /**
     * Check if the object has empty value
     * @param obj The object to be checked
     * @returns {boolean}　true when the object contains null, undefined, empty string, otherwise false
     */
    function hasEmptyProperty(obj) {
        for (var item in obj) {
            if (obj.hasOwnProperty(item)) {
                if (!obj[item]) {
                    return true;
                }
            }
        }

        return false;
    }
});