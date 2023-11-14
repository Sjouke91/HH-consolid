'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import rewriteSlug from 'utils/rewriteSlug';
// import LoadingSpinner from '../loading-spinner/LoadingSpinner.component';
// import LoadingSpinner from '../application/utils/LoadingSpinner';

export default function MongoSearchSchema({
  handleClickNext,
  handleClickPrev,
  filters,
  data,
  canPaginate,
  children,
  translate,
}) {
  const {
    searchResults,
    pageResults,
    totalPages,
    totalPagesUnpaginated,
    currentPageIndex,
    // loading,
    // hasSearched,
    formatResultCount,
    searchTarget,
  } = data;

  const noPageResults = !pageResults || !pageResults?.length;
  const noSearchResults = !searchResults || !searchResults?.length;
  //currentPageIndex -  counts from 0, e.g. 0 = 1
  //total pages counts from 1

  //TODO - result messages below must come from dictionary

  return (
    <section className="c-mongo-search__outer-wrapper outer-wrapper">
      <div className="c-mongo-search__inner-wrapper">
        {searchTarget && searchTarget === 'content' && noPageResults ? (
          <div className="c-mongo-search__no-results">
            <div className="c-mongo-search__no-result-message">
              <h2>{translate('mongoSearch', 'noResultsFound')}</h2>
            </div>
          </div>
        ) : null}
        {searchTarget && searchTarget === 'vacancy' && noSearchResults ? (
          <div className="c-mongo-search__no-results">
            <div className="c-mongo-search__no-result-message">
              <h2>{translate('mongoSearch', 'noResultsFound')}</h2>
            </div>
          </div>
        ) : null}
        {searchResults?.length || pageResults?.length ? (
          <div className="c-mongo-search__stats">
            <p>
              <strong>{translate('mongoSearch', 'searchStatResults')}:</strong>
              {!noSearchResults ? (
                <strong>
                  {' '}
                  {formatResultCount(searchResults?.length)}{' '}
                  {translate('mongoSearch', 'searchStatVacancies')}
                </strong>
              ) : null}
              {!noPageResults ? (
                <strong>
                  {' '}
                  {formatResultCount(totalPagesUnpaginated)}{' '}
                  {translate('mongoSearch', 'searchStatPages')}
                </strong>
              ) : null}
            </p>
          </div>
        ) : null}
        {children}
        {pageResults && pageResults?.length > 0 ? (
          <>
            <div className="c-mongo-search__page-result-heading">
              <h2>{translate('mongoSearch', 'pageResultTitle')}</h2>
            </div>

            <div className="c-mongo-search__pages-container">
              {pageResults.map(function (page, index, arr) {
                return (
                  <article
                    className="c-mongo-search__page-result-container"
                    key={index}
                  >
                    <Link href={`${rewriteSlug(page?.fullSlug)}`}>
                      <div className="c-mongo-search__page-result-card">
                        <p className="c-mongo-search__page-title">
                          {page?.pageName.toUpperCase()}
                        </p>
                        {page?.metaDescription ? (
                          <p className="c-mongo-search__meta-description">
                            "{page?.metaDescription}"
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </article>
                );
              })}
              {canPaginate ? (
                <div className="c-mongo-search__pagination-container">
                  <div className="button-container-search">
                    <div className="page-prev">
                      {currentPageIndex !== 0 ? (
                        <button
                          className={`c-mongo-search__button show-as-button primary ${
                            currentPageIndex === 0 ? '--nav-disabled' : ''
                          }`}
                          onClick={handleClickPrev}
                        >
                          {translate(
                            'mongoSearch',
                            'searchPaginationPagePrevious',
                          )}
                        </button>
                      ) : null}
                    </div>
                    <div className="pagination-status">
                      <p>
                        {translate('mongoSearch', 'searchPaginationPage')}{' '}
                        {currentPageIndex + 1}{' '}
                        {translate(
                          'mongoSearch',
                          'searchPaginationPageSeparator',
                        )}{' '}
                        {totalPages}
                      </p>
                    </div>
                    {/* check that current page (index) is not last item index */}
                    <div className="page-next">
                      {currentPageIndex !== totalPages - 1 ? (
                        <button
                          className={`c-mongo-search__button show-as-button primary${
                            currentPageIndex < totalPages
                              ? ''
                              : '--nav-disabled'
                          }`}
                          onClick={handleClickNext}
                        >
                          {translate('mongoSearch', 'searchPaginationPageNext')}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
