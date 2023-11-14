import cleanJobObject from './clean-job-object';
import applyFilter from './lister-aux/apply-filter';
import cleanParams from './lister-aux/clean-params';
import createPagination from './lister-aux/create-pagination';
import getFilterRenderingObj from './lister-aux/get-filter-rendering-obj';
import getJobsFromMongo from './lister-aux/get-jobs-mongo';
import { checkIfPreFiltered } from './lister-aux/check-if-pre-filtered';
import { getPreFiltersToApply } from './lister-aux/get-prefilters-to-apply';
import { sortVacancies } from './lister-aux/sort-vacancies';

/***
 * Receive the blocks in the page and the url parameters and return eveyrhing you need to render a job lister.
 * Important: This function will only respond to the first lister in the page, if there are more than one lister in the page, the rest will be ignored.
 * @param {Object} pageStory - The page story object. Here we have to process the prelistered values for everything else + the filter configuration options.
 * @param {Object} url - Current url parameters +  search parameters (query).
 */

// FOR DEV PURPOSES, I AM HARDCODING THIS.

const demoFilterConfig = {
  booleans: [
    {
      title: 'vacancyType',
      options: [
        {
          name: 'selfEmployed',
          default: true,
        },
        {
          name: 'supplier',
        },
        {
          name: 'expat',
        },
      ],
    },
  ],
  sliders: [
    {
      property: 'hoursPerWeek',
      // min_hours and max_hours will be the output of the slider in the urls
      urlKey: 'hours',
      min: 0,
      max: 40,
      currentMin: 0,
      curentMax: 40,
      step: 1,
    },
  ],
  filters: [
    {
      filter: 'functionGroup',
      visible: true,
      filterValue: null,
      showOnJobCard: false,
    },

    {
      // Needs to be mapped as region.
      filter: 'city',
      visible: false,
      filterValue: null,
      showOnJobCard: true,
    },
    {
      filter: 'industry',
      visible: true,
      filterValue: null,
      showOnJobCard: false,
    },
    {
      filter: 'hoursPerWeek',
      visible: false,
      filterValue: null,
      showOnJobCard: true,
    },
    {
      filter: 'startDate',
      specLabel: 'startDate',
      visible: false,
      filterValue: null,
      showOnJobCard: true,
    },
    {
      filter: 'closingDate',
      specLabel: 'startDate',
      visible: false,
      filterValue: null,
      showOnJobCard: true,
    },
    {
      filter: 'duration',
      specLabel: 'duration',
      visible: false,
      filterValue: null,
      showOnJobCard: true,
    },
  ],
  showFilters: true,
  showSorting: false,
  showTopJobs: false,
  sortingOrder: 'topJob',
  // TODO: These 2 options do not do anything yet.
  showZipCodeSearch: true,
  showSearch: true,
};

export default async (pageStory, url) => {
  // Get the parameters of the listers in the page.
  const firstListerInPage = pageStory?.content?.body?.filter(
    (blok) => blok.component === 'vacancyListerBlock',
  )[0];

  // Collect the jobs if there are listers in the page, return false if no listers.
  if (!firstListerInPage) {
    return {
      vacancies: false,
      filters: false,
      pagination: false,
    };
  }

  if (!firstListerInPage.categoryFilters) {
    firstListerInPage.categoryFilters = JSON.stringify(demoFilterConfig);
  }

  const categoryFilters = JSON.parse(firstListerInPage.categoryFilters);

  const visibleSpecConfig = categoryFilters.filters;

  const isPreFiltered = checkIfPreFiltered(visibleSpecConfig);

  const sorting = url?.searchParams?.sorting;

  const preFiltersToApply = getPreFiltersToApply(visibleSpecConfig);

  const visibleSpecArray = visibleSpecConfig
    .filter((filterItem) => filterItem.showOnJobCard)
    .map((filterItem) => filterItem.filter);

  const vacancies = await getJobsFromMongo({
    locale: url.params.lang,
  });

  if (!firstListerInPage) {
    return {
      vacancies: false,
      filters: false,
      pagination: false,
    };
  }

  const filterConfig = {
    ...firstListerInPage,
    categoryFilters: JSON.parse(firstListerInPage.categoryFilters),
  };

  const cleanSearchParams = cleanParams(
    url.searchParams,
    filterConfig.categoryFilters,
  );

  const prefilteredVacancies = applyFilter({
    vacancies,
    filterConfig,
    filtersToApply: preFiltersToApply,
  });
  if (!prefilteredVacancies) {
    return {
      vacancies: false,
      filters: false,
      pagination: false,
    };
  }

  const correctlyFilteredVacancies = isPreFiltered
    ? prefilteredVacancies
    : vacancies;

  // After this step, we have the filtered vacancies
  const finalVacancies = applyFilter({
    vacancies: correctlyFilteredVacancies,
    filtersToApply: cleanSearchParams,
    filterConfig,
  });

  //create filter block data
  const filtersData = getFilterRenderingObj({
    filterConfig,
    vacancies: correctlyFilteredVacancies,
    finalVacancies,
    url,
  });

  const { paginationObject, paginatedVacancies } = createPagination({
    vacancies: sortVacancies(finalVacancies, sorting),
    url: { params: url.params, searchParams: cleanSearchParams },
    sorting,
  });

  const cleanPaginatedVacancies = paginatedVacancies.map((vacancy) =>
    cleanJobObject({
      jobData: vacancy,
      visibleSpecArray,
      locale: url.params.lang,
    }),
  );

  return {
    vacancies: cleanPaginatedVacancies,
    filters: filtersData,
    pagination: paginationObject,
  };
};
