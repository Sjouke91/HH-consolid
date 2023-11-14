import Pagination from './Pagination';
import FilterBar from './FilterBar';
import VacancyList from './VacancyList';
import { useEffect, useState } from 'react';
import ActiveFilters from './ActiveFilters';
import { StoryblokComponent } from '@storyblok/react';
import pushToDataLayer from '@/lib/gtm/gtm-datalayer-push';
import formatGtmJobObject from '@/lib/gtm/gtm-create-job-object';
import { useRouter, usePathname } from 'next/navigation';
import { SortingMenu } from './SortingMenu';

export default function VacancyListerComponent(props) {
  const { jobListerData, translate, currentLocale, blok } = props;

  const { vacancies, filters, pagination } = jobListerData;
  const { title, errorMessage } = blok || '';
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const toggleFiltersOpenOnMobile = () => {
    if (mobileFiltersOpen) {
      document.querySelector('body').classList.remove('no-scroll-tablet');
    } else {
      document.querySelector('body').classList.add('no-scroll-tablet');
    }
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const pathname = usePathname();

  //GTM Datalayer push: Lister page
  useEffect(() => {
    const dataLayerEvent = {
      event: 'view_item_list',
      ecommerce: {
        item_list_name: 'job-list',
        items: vacancies?.length
          ? vacancies.map((vacancy, index) =>
              formatGtmJobObject({ jobData: vacancy, index }),
            )
          : [],
      },
    };
    pushToDataLayer(dataLayerEvent);
    return function () {
      document?.querySelector('body')?.classList?.remove('no-scroll-tablet');
    };
  }, []);

  //GTM Datalayer push: Active filter event
  useEffect(() => {
    if (!filters?.trackingEventString) return;
    const dataLayerEvent = {
      event: 'filter_active',
      filter_combination: filters.trackingEventString,
    };
    pushToDataLayer(dataLayerEvent);
  }, [filters]);

  function handleSort(e) {
    const sortOption = e.target.value;
    if (sortOption) {
      router.push(`${pathname}?sorting=${sortOption}`);
    }
  }

  return (
    <div className="c-vacancy-lister ">
      <div className="c-vacancy-lister__title-container">
        <h2 className="c-vacancy-lister__title">{title}</h2>
      </div>
      <div className="c-vacancy-lister__inner-wrapper">
        {filters ? (
          <div
            className={`c-vacancy-lister__left-bar ${
              mobileFiltersOpen ? `c-vacancy-lister__left-bar--is-open` : ''
            }`}
          >
            <FilterBar
              filters={filters}
              toogleDisplayMobile={toggleFiltersOpenOnMobile}
              translate={translate}
              currentLocale={currentLocale}
            />

            <button
              className="mobile-toggler button primary"
              onClick={toggleFiltersOpenOnMobile}
            >
              {translate('vacancyListerBlock', 'filterMobileToggle')}
            </button>
          </div>
        ) : null}

        <div className="c-vacancy-lister__right-bar">
          {!vacancies || vacancies.length == 0 ? <h3>{errorMessage}</h3> : null}
          <div className="c-vacancy-lister__filter-sorting">
            {filters ? (
              <ActiveFilters translate={translate} filters={filters} />
            ) : null}
            <SortingMenu translate={translate} type={'desktop'} />
          </div>
          {props.blok?.jobAlert && props.blok.jobAlert.length ? (
            <StoryblokComponent blok={props.blok.jobAlert[0]} />
          ) : null}
          {vacancies ? (
            <VacancyList translate={translate} vacancies={vacancies} />
          ) : null}
          {pagination ? (
            <Pagination translate={translate} pagination={pagination} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
