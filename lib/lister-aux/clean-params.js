// the purpose of this function is to make sure that we only take into account the filtering values that are actually options for this lister.

// Without it , if you add a param like UTM_Source, it would show in the active filters, being annoying and confusing for the user.

const cleanParams = (searchParams, filterConfig) => {
  if (!searchParams) return {};
  const cleanSearchParams = { ...searchParams };

  const availableKeys = ['page'];

  filterConfig?.booleans?.forEach((f) => {
    // f.options.forEach((b) => availableKeys.push(`is_${b.name}`));
    availableKeys.push(`is_${f.title}`);
  });

  filterConfig?.sliders?.forEach((f) => {
    // Sliders allow min and max
    availableKeys.push(`min_${f.urlKey}`);
    availableKeys.push(`max_${f.urlKey}`);
  });

  filterConfig?.filters.forEach((f) => availableKeys.push(f.filter));

  Object.keys(cleanSearchParams).forEach((param) => {
    if (!availableKeys.includes(param)) {
      delete cleanSearchParams[param];
    }
  });
  return cleanSearchParams;
};

export default cleanParams;
