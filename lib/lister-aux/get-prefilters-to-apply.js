export function getPreFiltersToApply(categoryFiltersArray) {
  const filtersToApply = {};

  //loop through filter objects and build key="filterValueArr" pairs
  categoryFiltersArray?.forEach(function (f) {
    const filterName = f?.filter;
    //add preFiltered filter to object
    if (f?.filterValue && f?.filterValue?.length) {
      return (filtersToApply[filterName] = parseFilterValueArray(
        f.filterValue,
      ));
    } else {
      return f;
    }
  });
  return filtersToApply;
}

//loop through filterValue array and return object like { functionGroup: 'I - PMO' }  e.g.
function parseFilterValueArray(filterValueArray) {
  if (!filterValueArray || !filterValueArray?.length) {
    return '';
  }

  //loop through filter values and store in array
  //join array into a value (comma separated)

  const value = [];

  filterValueArray?.forEach(function (filterValueItem) {
    value.push(filterValueItem);
  });
  const valueStr = value && value?.length ? value.join(',') : '';
  return valueStr;
}
