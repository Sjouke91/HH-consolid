/**
 * Applies filters to a list of vacancies.

 * @param {Array} vacancies - The list of vacancies to filter.
 * @param {Object} filtersToApply - The filters to apply to the vacancies.
 * @returns {Array} The filtered list of vacancies.
 *
 * Notes: Removes page and query from the filtersToApply object, since those are independant from the filters.
 */

import filterJobListerByFilter from './filter-job-lister-by-filter';
// This function will call itself on every filter key and pass the resulting vacancy list to the next iteration, resulting in a filtered list of vacancies.

const recursiveFunction = (vacancies, filterArray) => {
  if (!vacancies) return [];

  // Shift returns the first one, and removes it from the array. So the resulting array has the ones left
  const filter = filterArray.shift();

  // When there are no filters left to filter by, we return the resulting vacancy list.
  if (!filter || !filter.values) {
    return vacancies;
  }

  const filteredVacancies = filterJobListerByFilter({
    filterKey: filter.key,
    filterValue: filter.values,
    vacancies,
  });

  return recursiveFunction(filteredVacancies, filterArray);
};

const applyFilter = ({ vacancies, filtersToApply, filterConfig }) => {
  // BOOLEANS are very annoying,
  // when there is no boolean in the filters to apply,
  // then the default one applies, so here we do create
  // a filter to apply with the default value.
  // I really don't like this.

  const newFiltersToApply = { ...filtersToApply };

  delete newFiltersToApply.page;

  // Here we map over all our booleans, and when there is no active boolean active, we indeed activate the default one.

  filterConfig?.categoryFilters?.booleans?.forEach((booleanFilter) => {
    if (!newFiltersToApply[`is_${booleanFilter.title}`]) {
      newFiltersToApply[`is_${booleanFilter.title}`] =
        booleanFilter.options.find((option) => option.default).name;
    }
  });

  // Slider filters, to not have a huge impact in the URL lenght, include a urlKey, here we make sure to put to do correct filtering, the property to filter by instead of the urlKey.

  filterConfig?.categoryFilters?.sliders?.forEach((sliderFilter) => {
    if (newFiltersToApply[`min_${sliderFilter.urlKey}`]) {
      newFiltersToApply[`min_${sliderFilter.property}`] =
        newFiltersToApply[`min_${sliderFilter.urlKey}`];
      delete newFiltersToApply[`min_${sliderFilter.urlKey}`];
    }
    if (newFiltersToApply[`max_${sliderFilter.urlKey}`]) {
      newFiltersToApply[`max_${sliderFilter.property}`] =
        newFiltersToApply[`max_${sliderFilter.urlKey}`];

      delete newFiltersToApply[`max_${sliderFilter.urlKey}`];
    }
  });

  // When tere are filters, we activate the filters.
  if (newFiltersToApply) {
    const filterArray = Object.keys(newFiltersToApply).map((filter) => ({
      key: filter,
      values: `${newFiltersToApply[filter]}`,
    }));

    return recursiveFunction(vacancies, filterArray);
  }

  // If there are no filters to apply, return the vacancies.
  return vacancies;
};

export default applyFilter;
