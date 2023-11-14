import Link from 'next/link';
import React from 'react';

function BooleanGroup({ booleanGroup, translate, trackFilterActivation }) {
  return (
    <div className="c-filter-group c-boolean-group c-boolean-group__wrapper">
      <h4 className="c-filter-group__title c-boolean-group__title">
        {translate('vacancyListerBlock', booleanGroup.booleanGroup)}
      </h4>
      <div className="c-filter-group c-boolean-group__options">
        {booleanGroup.booleanOption.map((booleanOption, i) => {
          if (!booleanOption.booleanLink)
            return (
              <span
                className={`c-boolean-group__option ${
                  booleanOption.booleanActive
                    ? 'c-boolean-group__option--is-active'
                    : ''
                }`}
                key={i}
              >
                {translate('vacancyListerBlock', booleanOption.booleanName)}
              </span>
            );
          return (
            <Link
              className={`c-boolean-group__option ${
                booleanOption.booleanActive
                  ? 'c-boolean-group__option--is-active'
                  : ''
              }`}
              key={i}
              href={booleanOption.booleanLink}
              scroll={false}
              onClick={() => {
                trackFilterActivation({
                  filterName: booleanGroup.booleanGroup,
                  filterValue: booleanOption.booleanName,
                });
                return true;
              }}
            >
              {translate('vacancyListerBlock', booleanOption.booleanName)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default BooleanGroup;
