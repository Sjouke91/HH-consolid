export function checkIfPreFiltered(categoryFiltersArray) {
  if (!categoryFiltersArray || !categoryFiltersArray?.length) {
    return;
  }

  const preFilteredStatus = categoryFiltersArray?.some(function (filter) {
    const filterValue = filter?.filterValue;
    return filterValue && filterValue?.length;
  });

  return preFilteredStatus;
}
