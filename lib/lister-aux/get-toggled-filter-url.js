/**
 * Returns a URL with the specified filter toggled.
 *
 * @param {Object} searchParamsOriginalToCopy - An object representing the current search parameters.
 * @param {string} filterCategoryToToggle - The name of the filter category to toggle.
 * @param {string} filterValueToToggle - The value of the filter to toggle.
 * @returns {string} A string representing a URL with the specified filter toggled.
 *
 * @example
 * const searchParams = { category: 'shoes', color: 'blue,red' };
 * const filterCategoryToToggle = 'color';
 * const filterValueToToggle = 'red';
 *
 * const toggledFilterUrl = getToggledFilterItemUrl(searchParams, filterCategoryToToggle, filterValueToToggle);
 *
 * console.log(toggledFilterUrl); // "?category=shoes&color=blue"
 */
const getToggledFilterItemUrl = (
  searchParamsOriginalToCopy,
  filterCategoryToToggle,
  filterValueToToggle,
) => {
  const searchParams = { ...searchParamsOriginalToCopy };
  // We don't want to keep pagination when you change filters
  delete searchParams.page;

  // Check if current params include category filter. If they do, add it to the array or remove it to toggle it.
  if (searchParams[filterCategoryToToggle]) {
    const currentFilterValues = searchParams[filterCategoryToToggle].split(',');
    if (currentFilterValues.includes(filterValueToToggle)) {
      const newFilterValues = currentFilterValues.filter(
        (filterValue) => filterValue !== filterValueToToggle,
      );
      if (newFilterValues.length > 0) {
        searchParams[filterCategoryToToggle] = newFilterValues.join(',');
      } else {
        delete searchParams[filterCategoryToToggle];
      }
    } else {
      searchParams[filterCategoryToToggle] = [
        ...currentFilterValues,
        filterValueToToggle,
      ].join(',');
    }
  } else {
    // If not, add it.
    searchParams[filterCategoryToToggle] = filterValueToToggle;
  }

  return `?${Object.keys(searchParams)
    .map((key) => {
      return `${key}=${searchParams[key]}`;
    })
    .join('&')}`;
};

export default getToggledFilterItemUrl;
