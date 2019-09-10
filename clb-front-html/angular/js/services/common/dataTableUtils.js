'use strict';

/**
 * Utilities for manipulating DataTables
 *
 * Contains:
 *
 * hideColumns() - Hiding specified columns for the DataTables
 *
 * reinitDataTables() - Re-initialize the DataTables with given parameters
 *
 * enableSingleSelect() - Enable single selection for rows in the DataTables
 *
 * enableChildRow() - Enables displaying child row. Only use this when you don't need the single selection function.
 *
 * reloadDataTable() - Reload the DataTable
 *
 * enableIndexColumn() - Enables the index column
 *
 * getLastIndex() - Get the last row's index, also the total row count of the DataTable
 */
app.factory('dataTableUtils', function ($interval) {

    return {
        hideColumns        : hideColumns,
        reinitDataTables   : reinitDataTables,
        enableSingleSelect : enableSingleSelect,
        enableChildRow     : enableChildRow,
        reloadDataTable    : reloadDataTable,
        enableIndexColumn  : enableIndexColumn,
        getLastIndex       : getLastIndex
    };

    /**
     * Hide DataTables' columns
     *
     * Usage:
     * <code>
     * // The DataTables' instance
     * var dataTablesInstance = angular.element('#table').DataTable();
     * // The column which you want to hide. Start from 0.
     * var columns = {
     * &nbsp;&nbsp;COLUMN_A: 0,
     * &nbsp;&nbsp;COLUMN_B: 1
     * };
     *
     * dataTableUtils.hideColumns(dataTablesInstance, columns);
     * </code>
     * @param dataTablesInstance The instance of DataTables
     * @param columns The enum object contains the ID of columns
     */
    function hideColumns (dataTablesInstance, columns) {
        for (var i in columns) {
            if (columns.hasOwnProperty(i)) {
                dataTablesInstance.column(columns[i]).visible(false);
            }
        }
    }

    /**
     * Re-initialize the DataTables with given parameters.
     * Usually the new parameter is different from the old one.
     *
     * Usage:
     * <code>
     * // The jQuery selector
     * var dataTablesSelector = angular.element('#table');
     * // The initialization parameter
     * var initParms = { ... };
     *
     * dataTableUtils.reinitDataTables(dataTablesSelector, initParms);
     * </code>
     * @param dataTablesSelector The jQuery selector for the DataTables
     * @param dataTablesInitParams The initialization parameter for the DataTables
     */
    function reinitDataTables (dataTablesSelector, dataTablesInitParams) {
        dataTablesSelector.DataTable().destroy();
        dataTablesSelector.DataTable(dataTablesInitParams);
    }

    /**
     * Enable row single selection
     *
     * Usage:
     * <code>
     * // Get the jQuery selector
     * var selector = angular.element('#table');
     * // Call this method
     * dataTableUtils.enableSingleSelect(selector);
     * </code>
     * @param dataTableSelector The jQuery selector of the DataTables
     * @param {boolean | undefined} displaysChildRow If it has child rows and you want to display it
     * @param {function | undefined} childRowFormatter The formatter of the child row
     * @param {function | undefined} selectedRowHandler How to handle the selected row
     */
    function enableSingleSelect (dataTableSelector, displaysChildRow, childRowFormatter, selectedRowHandler) {

        // Just kill the listener first
        dataTableSelector.find('tbody').off('click');

        // Then set an interval task
        var intervalTask = $interval(function () {

            // wait for the DataTable() is available
            if (dataTableSelector.DataTable !== undefined && $.fn.DataTable.isDataTable(dataTableSelector.selector)) {

                var table = dataTableSelector.DataTable();
                var row = undefined;

                // Set a click listener on table row in this table
                dataTableSelector.find('tbody').on('click', 'tr[role="row"]', function () {
                    // If the clicked row is selected (with class .active)
                    // then make it not selected (without class .active)
                    if ($(this).hasClass('active') && !$(this).hasClass('fa')) {
                        $(this).removeClass('active');

                        if (displaysChildRow) {
                            row = table.row($(this)); // $(this) refers to the selected row
                            if (row.child.isShown()) {
                                row.child.hide();
                            }
                        }

                        if (selectedRowHandler) {
                            selectedRowHandler();
                        }
                    } else if (!$(this).hasClass('active') && !$(this).hasClass('fa')) {
                        // Else make it selected.
                        // Remove the .active class first, just for make sure it has only one .active class
                        table.$('tr.active').removeClass('active');
                        $(this).addClass('active');

                        row = table.row($(this)); // $(this) refers to the selected row

                        if (displaysChildRow && childRowFormatter) {
                            // language=JQuery-CSS
                            $('tr.odd, tr.even').each(function (item) {
                                table.row(item).child.hide();
                            });

                            row.child(childRowFormatter(row.data())).show();
                        }

                        if (selectedRowHandler) {
                            selectedRowHandler(row.data());
                        }
                    }
                });

                // Finally stop this task when finished
                $interval.cancel(intervalTask);
            }
        });
    }

    /**
     * Enables displaying child row. Only use this when you don't need the single selection function.
     * @param dataTableSelector The jQuery selector of the DataTable
     * @param {function} formatter Child row formatter
     */
    function enableChildRow (dataTableSelector, formatter) {
        // Just kill the listener first
        dataTableSelector.find('tbody').off('click');

        // Then set an interval task
        var intervalTask = $interval(function () {

            // wait for the DataTable() is available
            if (dataTableSelector.DataTable !== undefined && $.fn.DataTable.isDataTable(dataTableSelector.selector)) {

                var table = dataTableSelector.DataTable();
                var row = table.row($(this));

                if (row.child.isShown()) {
                    row.child.hide();
                } else {
                    // language=JQuery-CSS
                    $('tr.odd, tr.even').each(function (item) {
                        table.row(item).child.hide();
                    });

                    row.child(formatter(row.data())).show();
                }

                // Finally stop this task when finished
                $interval.cancel(intervalTask);
            }
        });
    }

    /**
     * Enables the index column
     * @param dataTableSelector The jQuery selector of the DataTable
     * @param dataTablesInitParams The initialization param of the DataTable
     */
    function enableIndexColumn (dataTableSelector, dataTablesInitParams) {
        var intervalTask = $interval(function () {
            if (isDataTableLoaded(dataTableSelector) && isDataTable(dataTableSelector)) {

                var dataTable = dataTableSelector.DataTable();

                dataTablesInitParams.destroy = true;

                dataTablesInitParams.columnDefs = [];

                dataTablesInitParams.columnDefs.push({
                    searchable : false,
                    orderable  : false,
                    targets    : 0
                });

                dataTable.on('order.dt search.dt draw', function () {
                    dataTable
                        .column(0, {
                            'search' : 'applied',
                            'order'  : 'applied'
                        })
                        .nodes()
                        .each(function (cell, i) {
                            cell.innerHTML = i + 1;
                        });
                }).draw();

                $interval.cancel(intervalTask);
            }
        });
    }

    /**
     * Reload the content of the data table with current configuration
     * @param dataTableSelector The jQuery selector of the DataTables
     */
    function reloadDataTable (dataTableSelector) {
        dataTableSelector.DataTable().ajax.reload(null, false);
    }

    /**
     * Is DataTable() function loaded?
     * @param dataTableSelector The jQuery selector of the DataTable
     * @returns {boolean} true when loaded, false when not
     */
    function isDataTableLoaded (dataTableSelector) {
        return dataTableSelector.DataTable !== undefined;
    }

    /**
     * Is this a DataTable?
     * @param dataTableSelector The jQuery selector of the DataTable
     * @returns {boolean} true when this is a DataTable, false when not
     */
    function isDataTable (dataTableSelector) {
        return $.fn.DataTable.isDataTable(dataTableSelector.selector);
    }

    function getLastIndex (dataTableSelector) {
        return dataTableSelector.DataTable().rows().count();
    }
});