/**
 * Checks if a filter item is active in the current filter string.
 *
 * @param {string} filterItem - The filter item to check.
 * @param {string} activeFilterString - The active filter string.
 * @returns {boolean} True if the filter item is active, false otherwise.
 *
 */

const isFilterActive = (filterItem, activeFilterString) => {
  if (!activeFilterString) return false;
  // Active filter, when not set, also do the translation to undefined and empty string, since not set is generated under those circumstances..
  // TODO: This circumstances can be centralized in the same place we will centralize nested object properties.

  if (filterItem === undefined || filterItem === '')
    return activeFilterString.split(',').includes('not set');
  if (activeFilterString.split(',').includes(filterItem)) return true;
};

export default isFilterActive;
