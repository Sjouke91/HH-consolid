/**
 * Creates a pagination object for a list of vacancies.
 * @param {Array} vacancies - The list of vacancies to paginate.
 * @param {URL} url - The URL object representing the current URL.
 * @returns {Object} The pagination object.
 * @throws {Redirection} If the current page is greater than the amount of pages.
 */

import { redirect } from 'next/navigation';
import { sortVacancies } from './sort-vacancies';

export default ({ vacancies, url, sorting }) => {
  let paginationObject = {};
  const numberOfPages = vacancies ? vacancies?.length / 10 : 1;
  const amountOfPages = numberOfPages ? Math.ceil(numberOfPages) : 1;

  const currentPage = url.searchParams['page']
    ? parseInt(url.searchParams['page'])
    : 1;

  if (currentPage > amountOfPages) {
    // If we try to access a page above the max, we redirect to the last page.
    const newParams = { ...url.searchParams, page: amountOfPages };

    redirect(
      `?${Object.keys(newParams)
        .map((key) => {
          return `${key}=${newParams[key]}`;
        })
        .join('&')}`,
    );
  }

  paginationObject.context = {
    amountOfPages,
    currentPage,
  };

  paginationObject.sorting = sorting;

  if (currentPage < amountOfPages) {
    // Build the next page
    const newParams = { ...url.searchParams, page: currentPage + 1 };

    paginationObject.nextPage = {
      page: currentPage + 1,
      url: `?${Object.keys(newParams)
        .map((key) => {
          return `${key}=${newParams[key]}`;
        })
        .join('&')}`,
    };
  }
  if (currentPage > 1) {
    // Build the previous page
    let newParams;
    const previousPage = currentPage - 1;
    if (previousPage === 1) {
      newParams = { ...url.searchParams };
      delete newParams.page;
    } else {
      newParams = { ...url.searchParams, page: currentPage - 1 };
    }
    paginationObject.previousPage = {
      page: currentPage - 1,
      url: `?${Object.keys(newParams)
        .map((key) => {
          return `${key}=${newParams[key]}`;
        })
        .join('&')}`,
    };
  }

  const paginatedVacancies = sortVacancies(vacancies, sorting).slice(
    (currentPage - 1) * 10,
    currentPage * 10,
  );

  return {
    paginatedVacancies,
    paginationObject,
  };
};
