'use strict';

/**
 * Utilities for manipulating forms
 *
 * Contains:
 *
 * getFormData() - Serialize form data into [ { name : value } ] form
 *
 * clearForm() - Clear the entire form
 *
 * resetChosen() - Reset Chosen dropdowns
 *
 * resetValidationStatus() - Reset the validation status to normal
 */
app.factory('formUtils', function () {

    return {
        getFormData          : getFormData,
        clearForm            : clearForm,
        resetChosen          : resetChosen,
        resetValidationStatus: resetValidationStatus
    };

    /**
     * Serialize the form into the key:value form
     * @param $form The jQuery selector for the form
     * @returns {{ name : value }} The serialized form
     */
    function getFormData ($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    /**
     * Clear form elements by setting each field's model to undefined
     *
     * Usage:
     * <code>
     * // For example:
     * // In HTML we have an input like this
     * <input id="name" name="name" ng-model="fields.name">
     * // In the controller we have this
     * $scope.fields = {
     * &nbsp;&nbsp;name: undefined
     * }
     * // If we want to clear that input
     * formUtils.clearForm($scope.fields);
     * </code>
     * @param elements The object contains the model
     */
    function clearForm (elements) {
        for (var i in elements) {
            if (elements.hasOwnProperty(i)) {
                elements[i] = undefined;
            }
        }
    }

    /**
     * Reset Chosen dropdowns
     *
     * Usage:
     * <code>
     * formUtils.resetChosen(angular.element('#form'));
     * </code>
     * @param $form The jQuery selector of the form contains Chosen dropdowns
     */
    function resetChosen ($form) {
        angular.element($form.find('select')).each(function (i, item) {
            var itemSelector = angular.element(item);
            // If the selected item is an Chosen dropdown
            if (itemSelector.chosen !== undefined) {
                itemSelector.val('').trigger('chosen:updated');
            }
        });
    }

    function resetValidationStatus ($form) {
        $form.$setPristine();
        $form.$setValidity();
    }
});
