/**
 * Filters an array of vacancies by a given filter key and value.
 *

 * @param {string} filterKey - The key to filter by.
 * @param {string} filterValue - The value to filter by. Always a string, even if it's a number, comma separated values
 * @param {Array} vacancies - The array of vacancies to filter.
 * @returns {Array} An array of vacancies that match the filter key and value.
 *

 */

// import customVacancyMapping from './custom-vacancy-mapping';

const filterJobListerByFilter = ({ filterKey, filterValue, vacancies }) => {
  if (filterKey.startsWith('is_')) {
    // Type Boolean
    // Booleans are a true false value on a key (see job normalizer to see how we transform it)
    return vacancies.filter((vacancy) => {
      return vacancy.filteringElements[filterValue] === true;
    });
  } else if (filterKey.startsWith('min_')) {
    // Type min integer

    // TODO: Talk with Sjouke if we can improve this in the normalizer

    return vacancies.filter((vacancy) => {
      const hourNumber = parseInt(
        // TODO: make this more reliable in case of job formatting change.

        vacancy.filteringElements[filterKey.replace('min_', '')]?.split(
          ' ',
        )[0] ?? '40',
      );
      const filterNumber = parseInt(filterValue);
      return filterNumber <= hourNumber;
    });
  } else if (filterKey.startsWith('max_')) {
    // Type max integer
    return vacancies.filter((vacancy) => {
      const hourNumber = parseInt(
        // TODO: make this more reliable in case of job formatting change.

        vacancy.filteringElements[filterKey.replace('max_', '')]?.split(
          ' ',
        )[0] ?? '40',
      );
      const filterNumber = parseInt(filterValue);

      return filterNumber >= hourNumber;
    });
  } else {
    // Normal filter

    // make sure not set includes the values that generate not set, undefined and empty strings

    const allValuesToFilterBy = filterValue.split(',');

    if (allValuesToFilterBy.includes('not set')) {
      allValuesToFilterBy.push('');
      allValuesToFilterBy.push(undefined);
    }

    return vacancies.filter((vacancy) => {
      return allValuesToFilterBy.includes(vacancy.filteringElements[filterKey]);
    });
  }
};

export default filterJobListerByFilter;
