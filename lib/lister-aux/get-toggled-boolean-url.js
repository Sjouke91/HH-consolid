/**
 * Returns a URL with the specified toggler button toggled.
 *
 * @param {Object} searchParamsOriginalToCopy - An object representing the current search parameters.
 * @param {string} filterCategoryToToggle - The name of the filter category to toggle.
 * @param {string} filterValueToToggle - The value of the filter to toggle.
 * @param {boolean} isActive
 * @param {boolean} isDefault
 * @returns {string} A string representing a URL with the specified filter toggled.
 *
 * @example

 */
const getToggledBooleanItemUrl = (
  searchParamsOriginalToCopy,
  filterCategoryToToggle,
  filterValueToToggle,
  isActive,
  isDefault,
) => {
  const newFilterCategoryToToggle = `is_${filterCategoryToToggle}`;
  const searchParams = { ...searchParamsOriginalToCopy };
  // We don't want to keep pagination when you change filters
  delete searchParams.page;
  // delete searchParams.filterCategoryToToggle;

  // Check if current params include category filter. If they do, add it to the array or remove it to toggle it.

  if (isDefault && isActive) {
    // You can't toggle it off if it's the default value, this should never be called.
    throw new Error(
      "You can't toggle it off if it's the default value, this should never be called.",
    );
  }
  if (isDefault && !isActive) {
    delete searchParams[newFilterCategoryToToggle];
  }

  if (!isDefault && searchParams[newFilterCategoryToToggle]) {
    //hasToBeRemoved
    if (searchParams[newFilterCategoryToToggle] === filterValueToToggle) {
      // If it is, remove it.
      delete searchParams[newFilterCategoryToToggle];
      // So it goes to default
    } else if (
      searchParams[newFilterCategoryToToggle] !== filterValueToToggle
    ) {
      searchParams[newFilterCategoryToToggle] = filterValueToToggle;
    }
  }

  if (!isDefault && !searchParams[newFilterCategoryToToggle]) {
    //hasToBeAdded
    searchParams[newFilterCategoryToToggle] = filterValueToToggle;
  }

  return `?${Object.keys(searchParams)
    .map((key) => {
      return `${key}=${searchParams[key]}`;
    })
    .join('&')}`;
};

export default getToggledBooleanItemUrl;
