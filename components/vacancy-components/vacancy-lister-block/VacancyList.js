import React from 'react';
import VacancyGridCard from './VacancyGridCard';

function VacancyList({ vacancies, translate }) {
  return (
    <div className="c-vacancy-list">
      {vacancies?.map((vacancy, i) => {
        return (
          <VacancyGridCard vacancy={vacancy} key={i} translate={translate} />
        );
      })}
    </div>
  );
}

export default VacancyList;
