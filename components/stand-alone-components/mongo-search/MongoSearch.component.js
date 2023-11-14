'use client';
import { useState } from 'react';
import MongoSearchSchema from './MongoSearch.schema';
import VacancyListerComponent from '@/components/vacancy-components/vacancy-lister-block/VacancyLister';

export default function MongoSearchComponent({
  jobListerData,
  translate,
  currentLocale,
}) {
  const { vacancies, pages: unfilteredPages, searchTarget } = jobListerData;

  //filter page results by current locale (dutch/english)
  const pages =
    unfilteredPages &&
    unfilteredPages?.filter((mongoPage) =>
      mongoPage?.fullSlug?.includes(`/${currentLocale}/`),
    );

  const [hasSearched, set_hasSearched] = useState(false);
  const [loading, set_loading] = useState(false);

  function paginate(arr, size) {
    return arr.reduce((acc, val, i) => {
      let idx = Math.floor(i / size);
      let page = acc[idx] || (acc[idx] = []);
      page.push(val);

      return acc;
    }, []);
  }
  //-------page search results pagination---
  const [currentPageIndex, set_CurrentPageIndex] = useState(0);
  const resultsPerPage = 8;

  const paginatedPages =
    pages && pages?.length > 0 ? paginate(pages, resultsPerPage) : [];
  const canPaginate = paginatedPages?.length > 1;
  const totalPages = paginatedPages?.length;
  const pageResultsPaginated = paginatedPages[currentPageIndex];
  const totalPagesUnpaginated = pages && pages?.length;

  //handle next page and previous page click, schema will hide buttons if index too high or low
  function handleClickNext(e) {
    e.preventDefault();
    e.stopPropagation();
    set_CurrentPageIndex(currentPageIndex + 1);
  }

  function handleClickPrev(e) {
    e.preventDefault();
    e.stopPropagation();
    set_CurrentPageIndex(currentPageIndex - 1);
  }

  function formatResultCount(resultLength) {
    if (!resultLength) {
      return 0;
    }
    return `${resultLength}`;
  }
  // --- SCHEMA DATA ---

  const schemaData = {
    searchResults: vacancies,
    pageResults: pageResultsPaginated,
    currentPageIndex,
    totalPages,
    totalPagesUnpaginated,
    hasSearched,
    loading,
    formatResultCount,
    searchTarget,
  };

  return (
    <>
      <MongoSearchSchema
        handleClickNext={handleClickNext}
        handleClickPrev={handleClickPrev}
        data={schemaData}
        canPaginate={canPaginate}
        translate={translate}
      >
        {vacancies && vacancies.length > 0 ? (
          <VacancyListerComponent
            translate={translate}
            jobListerData={jobListerData}
          />
        ) : null}
      </MongoSearchSchema>
    </>
  );
}
