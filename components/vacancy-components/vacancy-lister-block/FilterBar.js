import FilterGroup from './FilterGroup';
import BooleanGroup from './BooleanGroup';
import RangeFilter from './RangeFilter';
import SearchFilter from './SearchFilter';
import SliderFilter from './SliderFilter';
import pushToDataLayer from '@/lib/gtm/gtm-datalayer-push';
import { SortingMenu } from './SortingMenu';

function FilterBar({ filters, toogleDisplayMobile, translate, currentLocale }) {
  const trackFilterActivation = ({ filterName, filterValue }) => {
    const dataLayerEvent = {
      event: 'select_filter',
      filter_type: filterName ? filterName : '',
      filter_option: filterValue ? filterValue : '',
    };
    pushToDataLayer(dataLayerEvent);
  };

  return (
    <div className="c-filter-bar c-filter-bar__wrapper">
      <h3 className="c-filter-bar__title">
        {translate('vacancyListerBlock', 'filterBarTitle')}
      </h3>
      {filters.context.showSearch ? (
        <SearchFilter translate={translate} currentLocale={currentLocale} />
      ) : null}
      <SortingMenu translate={translate} type="mobile"/>
      {filters?.booleans && filters?.booleans.length > 0
        ? filters.booleans.map((booleanGroup, i) => (
            <BooleanGroup
              translate={translate}
              booleanGroup={booleanGroup}
              key={i}
            />
          ))
        : null}

      {filters?.filters?.map((filterGroup, i) => {
        return (
          <FilterGroup
            translate={translate}
            filterGroup={filterGroup}
            key={i}
            trackFilterActivation={trackFilterActivation}
          />
        );
      })}
      <RangeFilter currentLocale={currentLocale} translate={translate} />
      {filters.sliders?.map((slider) => {
        return (
          <SliderFilter
            translate={translate}
            slider={slider}
            key={slider.urlKey}
            trackFilterActivation={trackFilterActivation}
          />
        );
      })}

      <button
        onClick={toogleDisplayMobile}
        className="c-filter-bar__mobile-toggler primary"
      >
        {/* TODO: Translate this */}
        {translate('vacancyListerBlock', 'filterTogglerShow')}{' '}
        {filters.context.allJobsCount}{' '}
        {translate('vacancyListerBlock', 'filterTogglerVacancies')}
      </button>
    </div>
  );
}

export default FilterBar;
