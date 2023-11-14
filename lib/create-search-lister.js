import cleanJobObject from './clean-job-object';
import applyFilter from './lister-aux/apply-filter';
import cleanParams from './lister-aux/clean-params';
import createPagination from './lister-aux/create-pagination';
import getFilterRenderingObj from './lister-aux/get-filter-rendering-obj';
import getJobsFromMongo from './lister-aux/get-jobs-mongo';
import getSearchJobsFromMongo from './lister-aux/get-search-data';

/***
 * Receive the blocks in the page and the url parameters and return eveyrhing you need to render a job lister.
 * Important: This function will only respond to the first lister in the page, if there are more than one lister in the page, the rest will be ignored.
 * @param {Object} pageStory - The page story object. Here we have to process the prelistered values for everything else + the filter configuration options.
 * @param {Object} ulr - Current url parameters +  search parameters (query).
 */

//TEMP for dev purposes
const demoFilterConfig = {
  // We remove booleans because with search they only filter further, and we don't want that.
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
  //route params
  const query = url?.searchParams?.query;
  const postcode = url?.searchParams?.postcode;
  const long = url?.searchParams?.lon;
  const lat = url?.searchParams?.lat;
  const range = url?.searchParams?.range;
  //search block pushes searchTarget queryParam
  const searchTarget = url?.searchParams?.searchTarget;
  const locale = url?.params?.lang;
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
  //TEMP for dev purposes - filter addition
  if (!firstListerInPage.categoryFilters) {
    firstListerInPage.categoryFilters = JSON.stringify(demoFilterConfig);
  }
  const categoryFilters = JSON.parse(firstListerInPage.categoryFilters);

  const visibleSpecConfig = categoryFilters.filters;

  const visibleSpecArray = visibleSpecConfig
    .filter((filterItem) => filterItem.showOnJobCard)
    .map((filterItem) => filterItem.filter);

  const searchData = await getSearchJobsFromMongo({
    query,
    long,
    lat,
    range,
    searchTarget,
    locale,
  });
  const pages = searchData?.pageResults;
  if (pages) {
    return {
      vacancies: false,
      filters: false,
      pagination: false,
      pages: pages,
      searchTarget: searchData?.searchTarget,
    };
  }
  const vacancies = searchData?.vacancies ?? [];
  const vacanciesStandard = await getJobsFromMongo({
    // visibleSpecArray,
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

  // After this step, we have the filtered vacancies
  const finalVacancies = applyFilter({
    vacancies,
    filtersToApply: cleanSearchParams,
    filterConfig,
  });

  const filtersData = getFilterRenderingObj({
    filterConfig: filterConfig,
    vacancies: vacancies,
    finalVacancies: finalVacancies,
    url,
  });

  const { paginationObject, paginatedVacancies } = createPagination({
    vacancies: finalVacancies,
    url: { params: url.params, searchParams: cleanSearchParams },
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
    pages: pages,
    searchTarget: searchData?.searchTarget || 'vacancy',
  };
};
