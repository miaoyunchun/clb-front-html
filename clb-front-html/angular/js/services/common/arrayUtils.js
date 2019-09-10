'use strict';

/**
 * Utilities for manipulating arrays
 * Contains:
 * <ul>
 *     <li>getIndexOfObject() - Get the index of the object in the array</li>
 * </ul>
 */
function arrayUtils () {

    return {
        getIndexOfObject: getIndexOfObject
    };

    /**
     * Get the index of the object in the array
     *
     * @param array
     * @param object
     */
    function getIndexOfObject (array, object) {
        return array
            .map(function (item) {
                return item;
            })
            .indexOf(object);
    }
}

app.factory('arrayUtils', arrayUtils);