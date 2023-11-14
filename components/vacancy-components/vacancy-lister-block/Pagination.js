import Link from 'next/link';

function Pagination({ pagination }) {
  if (!pagination) return null;
  return (
    <div className="c-lister-pagination__wrapper">
      {pagination.previousPage ? (
        <Link
          href={`${pagination.previousPage.url}${
            pagination?.sorting ? `&sorting=${pagination.sorting}` : ''
          }`}
          className="c-lister-pagination__page"
        >
          {pagination.previousPage.page}
        </Link>
      ) : null}

      {pagination.nextPage ? (
        <Link
          href={`${pagination.nextPage.url}${
            pagination?.sorting ? `&sorting=${pagination.sorting}` : ''
          }`}
          className="c-lister-pagination__page"
        >
          {pagination.nextPage.page}
        </Link>
      ) : null}
    </div>
  );
}

export default Pagination;
