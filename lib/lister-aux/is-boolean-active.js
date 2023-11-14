const isBooleanActive = (
  searchParamsOriginalToCopy,
  filterCategoryToToggle,
  filterValueToToggle,
  isDefault,
) => {
  const newFilterCategoryToToggle = `is_${filterCategoryToToggle}`;
  const searchParams = { ...searchParamsOriginalToCopy };

  if (!searchParams[newFilterCategoryToToggle] && isDefault) {
    return true;
  }

  if (
    searchParams[newFilterCategoryToToggle] &&
    searchParams[newFilterCategoryToToggle] === `${filterValueToToggle}`
  ) {
    return true;
  }

  return false;
};

export default isBooleanActive;
