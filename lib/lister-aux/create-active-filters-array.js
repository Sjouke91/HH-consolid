import getToggledFilterItemUrl from './get-toggled-filter-url';

const createActiveFiltersArray = ({ searchParams }) => {
  const activeFilterArray = [];
  const exclusions = [
    'page',
    'query',
    'searchTarget',
    'postcode',
    'range',
    'sorting',
    'lon',
    'lat',
  ];

  Object.keys(searchParams).forEach((key) => {
    // We don't do anything with the page number
    if (exclusions.includes(key)) return;

    const values = searchParams[key].split(',');
    values.forEach((value) => {
      let formattedValue = value;
      // FOR boolean filtering
      if (key.startsWith('is_')) {
        formattedValue = `${formattedValue}`;
      }
      // FOR range filtering
      if (key.startsWith('min_')) {
        formattedValue = `Min ${formattedValue}`;
      }
      if (key.startsWith('max_')) {
        formattedValue = `Max ${formattedValue}`;
      }

      activeFilterArray.push({
        filterGroup: key,
        filterValue: formattedValue,
        disableLink: getToggledFilterItemUrl(searchParams, key, value),
      });
    });
  });
  return activeFilterArray;
};

export default createActiveFiltersArray;
