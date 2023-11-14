import { useRouter, usePathname } from 'next/navigation';

export function SortingMenu({translate,type}){

  const router = useRouter();
  const pathname = usePathname();

  //config = mobile / desktop
  function handleSort(e) {
    const sortOption = e.target.value;
    if (sortOption) {
      router.push(`${pathname}?sorting=${sortOption}`);
    }
  }

  return (
    <div data-type={type} className="c-vacancy-lister__sorting-container">
    <h5 className="c-vacancy-lister__sorting-title">
      {`${translate('vacancyListerBlock', 'sortingDropdownTitle')}`}
    </h5>
    <div className="c-vacancy-lister__sorting-menu-container">
      <select
        onChange={handleSort}
        defaultValue="deadline"
        className="c-vacancy-lister__sorting-menu"
      >
        <option value="deadline">
          {translate('vacancyListerBlock', 'closingDate')}
        </option>
        <option value="most-recent">
          {translate('vacancyListerBlock', 'mostRecent')}
        </option>
        <option value="starting-date-asc">
          {translate('vacancyListerBlock', 'startingDate')}
          {`(${translate('vacancyListerBlock', 'firstToLast')})`}
        </option>
        <option value="starting-date-desc">
          {translate('vacancyListerBlock', 'startingDate')}
          {`(${translate('vacancyListerBlock', 'lastToFirst')})`}
        </option>
      </select>
    </div>
  </div>
  )
}