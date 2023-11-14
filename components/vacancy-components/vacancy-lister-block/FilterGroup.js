import Link from 'next/link';
import { useState } from 'react';

function FilterGroup({ filterGroup, translate, trackFilterActivation }) {
  const numberOfRowsOnConstrain = 3;
  const [isOpen, setIsOpen] = useState(true);
  const [isConstrained, setIsConstrained] = useState(true);
  if (!FilterGroup || !filterGroup.filterGroup || !filterGroup.filterValues)
    throw new Error(
      'FilterGroup component requires a filterGroup prop with a filterGroup and filterValues property',
    );
  return (
    <div
      className={`c-filter-group c-filter-group__wrapper ${
        isOpen ? `c-filter-group__wrapper--is-open` : ''
      }`}
    >
      <h3 className="c-filter-group__title" onClick={() => setIsOpen(!isOpen)}>
        {translate('vacancyListerBlock', filterGroup.filterGroup)}
      </h3>
      <ul className="c-filter-group__list">
        {filterGroup.filterValues.map((filterItem, i) => {
          if (!filterItem.filterLink || !`${filterItem.filterName}`) {
            throw new Error(
              'Filter item requires a filterLink & filterName property',
            );
          }
          return (
            <li
              key={i}
              className={`c-filter-group__item ${
                filterItem.filterActive ? 'c-filter-group__item--is-active' : ''
              }
              ${
                isConstrained && i > numberOfRowsOnConstrain - 1
                  ? 'c-filter-group__item--is-hidden'
                  : ''
              }`}
            >
              <Link href={`${filterItem.filterLink}`} scroll={false}>
                <div
                  onClick={() =>
                    trackFilterActivation({
                      filterName: filterGroup.filterGroup,
                      filterValue: filterItem.filterName,
                    })
                  }
                >
                  <span>
                    {translate('vacancyListerBlock', filterItem.filterName)}
                  </span>
                  <span>{filterItem.filterCount}</span>
                </div>
              </Link>
            </li>
          );
        })}
        {filterGroup.filterValues.length > numberOfRowsOnConstrain ? (
          <button
            className={`c-filter-group__show-more`}
            onClick={() => {
              setIsConstrained(!isConstrained);
            }}
          >
            {isConstrained
              ? translate('vacancyListerBlock', 'showMore')
              : translate('vacancyListerBlock', 'showLess')}
          </button>
        ) : null}
      </ul>
    </div>
  );
}

export default FilterGroup;
