import pushToDataLayer from '@/lib/gtm/gtm-datalayer-push';
import Link from 'next/link';
import { useEffect } from 'react';

function ActiveFilters({ filters, translate }) {
  return (
    <div className="c-active-filters c-active-filters__wrapper">
      {filters && filters?.activeFiltersObject?.length ? (
        <h5 className="c-active-filters__title">
          {translate('vacancyListerBlock', 'activeFiltersTitle')}
        </h5>
      ) : null}

      {filters.activeFiltersObject && filters.activeFiltersObject.length ? (
        <div className="c-active-filters__actions">
          {filters.activeFiltersObject.map((activeFilter) => (
            <Link
              key={activeFilter.filterGroup + activeFilter.filterValue}
              href={activeFilter.disableLink}
              scroll={false}
              className="c-active-filters__item"
            >
              {translate('vacancyListerBlock', activeFilter.filterValue)}
            </Link>
          ))}
          <Link
            href={filters.context.removeFiltersLink}
            scroll={false}
            className="c-active-filters__reset"
          >
            {translate('vacancyListerBlock', 'resetActiveFilters')}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default ActiveFilters;
