export function sortVacancies(vacancies, sorting) {
  switch (sorting) {
    case 'deadline':
      //SORT BY DEADLINE (closingDate)
      const sortedByDeadline = vacancies?.sort((a, b) => {
        return a.closingDate.timestamp.t - b.closingDate.timestamp.t;
      });
      return sortedByDeadline;

    case 'most-recent':
      const sortedByMostRecent = vacancies?.sort((a, b) => {
        return b.firstPublishedAt.timestamp.t - a.firstPublishedAt.timestamp.t;
      });
      return sortedByMostRecent;

    case 'starting-date-asc':
      //newest (first) to oldest - ascending
      const sortedByStartingDateAsc = vacancies?.sort((a, b) => {
        return a.startingDate.timestamp.t - b.startingDate.timestamp.t;
      });
      return sortedByStartingDateAsc;

    case 'starting-date-desc':
      //oldest (first) to newest - descending
      const sortedBystartingDateDsc = vacancies?.sort((a, b) => {
        return b.startingDate.timestamp.t - a.startingDate.timestamp.t;
      });
      return sortedBystartingDateDsc;

    default:
      //SORT BY DEADLINE (closingDate)
      const deadlinedDefaultSort = vacancies?.sort((a, b) => {
        return a.closingDate.timestamp.t - b.closingDate.timestamp.t;
      });
      return deadlinedDefaultSort;
  }
}
