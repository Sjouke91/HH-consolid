import filterJobListerByFilter from './filter-job-lister-by-filter';
import getToggledFilterItemUrl from './get-toggled-filter-url';
import isFilterActive from './is-filter-active';
import createActiveFiltersArray from './create-active-filters-array';
import getToggledBooleanItemUrl from './get-toggled-boolean-url';
import isBooleanActive from './is-boolean-active';
import getSliderUrl from './get-slider-url';
import applyFilter from './apply-filter';
import cleanParams from './clean-params';
import createTrackingEventString from './create-tracking-event-string';

/**
 * Returns an array of objects with the filter configuration.
 *
 * @param {Object} filterConfig - An object containing the filter configuration.
 * @param {Array} vacancies - An array of vacancies.
 * @param {Object} url object from Nextjs
 * @returns {(Array|false)} An array of objects with the filter configuration or false if there should not show filters.
 *
 */

/**
 * Sample return:
 * [{
 *  filterGroup: 'category',
 *  filterValues: [{
 *    filterLink: /vacacatures?category=ICT&industry=ICT&function=ICT&functionGroup=ICT&sector=ICT&subCategory=ICT,
 *    filterName: 'ICT',
 *    filterCount: 23,
 *    filterActive: true
 *  }]
 * }]
 *
 * @param {filterConfig} string
 * @param {vacancies} string
 * @returns False if there should not show filters OR An array of objects with the filter configuration.
 */

const getFilterRenderingObj = ({
  filterConfig,
  vacancies,
  finalVacancies,
  url,
}) => {
  // If there are no filters or should not be shown, return false.
  if (
    !filterConfig.categoryFilters ||
    !filterConfig.categoryFilters.showFilters
  )
    return false;

  const filtersToShow = filterConfig.categoryFilters.filters
    .filter((filter) => {
      // Only visible filters need to be passed to be shown in the UI.
      return filter.visible;
    })
    .map((filter) => {
      const possibleValues = [];
      vacancies?.forEach((vacancy) => {
        possibleValues.push(vacancy.specs[filter.filter]);
        // possibleValues.push(customVacancyMapping(filter.filter, vacancy));
      });

      const filterWithChildren = {
        ...filter,
        filterChildren: [...new Set(possibleValues)],
      };
      return filterWithChildren;
    });

  const activeFiltersObject = createActiveFiltersArray({
    searchParams: url.searchParams,
  });

  const trackingEventString = createTrackingEventString({
    searchParams: url.searchParams,
  });

  //storyblok setup for boolean filtering - set a default boolean and set preFiltered to true
  //if preFilteredBoolean is true - the lister will be prefiltered by the default boolean
  const preFilteredBoolean = filterConfig?.categoryFilters?.booleans?.[0]?.preFiltered;

  const filtersObject = {
    sliders:
      filterConfig.categoryFilters?.sliders &&
      filterConfig.categoryFilters.sliders.length
        ? filterConfig.categoryFilters?.sliders.map((slider) => {
            const currentValueMin =
              url.searchParams[`min_${slider.urlKey}`] ?? slider.min;
            const currentValueMax =
              url.searchParams[`max_${slider.urlKey}`] ?? slider.max;
            return {
              getUrl: getSliderUrl(url.searchParams, slider.urlKey),
              min: slider.min,
              max: slider.max,
              urlKey: slider.urlKey,
              currentValueMin,
              currentValueMax,
            };
          })
        : false,

    booleans:
      filterConfig.categoryFilters?.booleans &&
      filterConfig.categoryFilters.booleans.length > 0
        ? filterConfig.categoryFilters.booleans.map((boolean) => {
            return {
              booleanGroup: boolean.title,
              booleanOption: boolean.options.map((option, i) => {

              //If boolean prefiltering is true, remove non-default booleans
                if(preFilteredBoolean && !option?.default){
                  return;
                }
                const isDefault = i === 0;
                //set the active boolean to the prefiltered default, or allow existing logic to run
                const isActive = preFilteredBoolean && option?.default ? true : isBooleanActive(
                  url.searchParams,
                  boolean.title,
                  option.name,
                  isDefault,
                );


                return {
                  booleanName: option.name,
                  booleanLink:
                    isActive && isDefault
                      ? false
                      : getToggledBooleanItemUrl(
                          url.searchParams,
                          boolean.title,
                          option.name,
                          isActive,
                          isDefault,
                        ),
                  booleanActive: isActive,
                  booleanIsDefault: isDefault,
                };
              }),
            };
          })
        : false,
    filters: filtersToShow.map((filter) => {
      const isFilterGroupActive = url.searchParams[filter.filter]
        ? true
        : false;
      return {
        filterGroup: filter.filter,
        isFilterGroupActive,
        filterValues: filter.filterChildren.map((filterChild) => {
          const filterName =
            filterChild === '' || filterChild === undefined
              ? 'not set'
              : filterChild;
          // The count in elements of the same list should show additional items, in crossed list, should show only combination of both.
          const cleanSearchParams = cleanParams(
            url.searchParams,
            filterConfig.categoryFilters,
          );
          const searchParamsWithoutCurrentFilterKey = { ...cleanSearchParams };
          delete searchParamsWithoutCurrentFilterKey[filter.filter];

          const vacanciesWithoutCurrentBlock = applyFilter({
            vacancies,
            filtersToApply: searchParamsWithoutCurrentFilterKey,
            filterConfig,
          });

          const vacanciesToFiterBy = isFilterGroupActive
            ? vacanciesWithoutCurrentBlock
            : finalVacancies;

          const filterCount = filterJobListerByFilter({
            filterKey: filter.filter,
            filterValue: `${filterName}`,

            vacancies: vacanciesToFiterBy,
          })?.length;

          const filterLink = getToggledFilterItemUrl(
            url.searchParams,
            filter.filter,
            `${filterName}`,
          );

          return {
            filterCount,
            filterName,
            filterLink,
            filterActive: isFilterActive(
              // Force filter child to be a string
              `${filterChild}`,
              url.searchParams[filter.filter],
            ),
            allJobsCount: vacancies.length,
          };
        }),
      };
    }),
    context: {
      allJobsCount: finalVacancies.length,
      removeFiltersLink: '?',
      showSearch: filterConfig.categoryFilters.showSearch,
      showZipCodeSearch: filterConfig.categoryFilters.showZipCodeSearch,
      showFilters: filterConfig.categoryFilters.showFilters,
    },
    activeFiltersObject,
    trackingEventString,
  };

  return filtersObject;
};

export default getFilterRenderingObj;
