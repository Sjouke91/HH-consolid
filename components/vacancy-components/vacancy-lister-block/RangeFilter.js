import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { getLocalisationObject } from 'config';
import rewriteSlug from 'utils/rewriteSlug';
import { usePlacesWidget } from 'react-google-autocomplete';

function RangeFilter({ translate, currentLocale }) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const [coordinates, setCoordinates] = React.useState('');
  const [range, setRange] = React.useState(25);
  const [isOpen, setIsOpen] = React.useState(true);

  const localeObj = getLocalisationObject(currentLocale);
  const searchPrefixLocale = localeObj?.searchStoryblok;

  const { ref, autocompleteRef } = usePlacesWidget({
    apiKey: 'AIzaSyBbFhegi0YhahWarIah7gx5OnNsQjRD-oo',
    onPlaceSelected: (place) => {
      setCoordinates(
        `lon=${place.geometry.location.lng()}&lat=${place.geometry.location.lat()}`,
      );
      setSearch(place.formatted_address);
    },
    options: {
      types: ['(regions)'],
      componentRestrictions: { country: 'nl' },
      fields: ['geometry.location', 'formatted_address'],
    },
  });

  const isValidSearch = coordinates !== '';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValidSearch) {
      router.push(
        rewriteSlug(`/${searchPrefixLocale}?${coordinates}&range=${range}`),
      );
    }
  };

  const handleRangeChange = (e) => {
    setRange(parseInt(e.target.value));
  };

  return (
    <div
      className={`c-filter-group c-filter-group__wrapper ${
        isOpen ? `c-filter-group__wrapper--is-open` : ''
      }`}
    >
      <h3 className="c-filter-group__title" onClick={() => setIsOpen(!isOpen)}>
        {translate('vacancyListerBlock', 'searchByLocation')}
      </h3>
      <div className="c-filter-group__list c-filter-range c-filter-range__wrapper">
        <div className="c-filter-range__zip-wrapper">
          <input
            className={`c-filter-range__zip-search`}
            value={search}
            ref={ref}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${translate(
              'vacancyListerBlock',
              'locationSearchPlaceholder',
            )}`}
            id="filter-range-zip-search"
            onKeyDown={handleKeyDown}
          />
          <label
            htmlFor="filter-range-zip-search"
            className="c-filter-range__zip-label"
          >
            <Image src="/circle8-region.svg" width={16} height={16} alt="" />
          </label>
        </div>

        <fieldset className="c-filter-range__fieldset">
          <legend className="c-filter-range__fieldset-title">
            {translate('vacancyListerBlock', 'rangeSearchTitle')}
          </legend>
          <input
            type="radio"
            name="range"
            value="25"
            id="25"
            checked={range === 25}
            onChange={handleRangeChange}
          />
          <label className="c-filter-range__range-input" htmlFor="25">
            {translate('vacancyListerBlock', 'rangeWithin')} 25Km
          </label>
          <input
            type="radio"
            name="range"
            value="50"
            id="50"
            checked={range === 50}
            onChange={handleRangeChange}
          />
          <label className="c-filter-range__range-input" htmlFor="50">
            {translate('vacancyListerBlock', 'rangeWithin')} 50Km
          </label>
          <input
            type="radio"
            name="range"
            value="100"
            id="100"
            checked={range === 100}
            onChange={handleRangeChange}
          />
          <label className="c-filter-range__range-input" htmlFor="100">
            {translate('vacancyListerBlock', 'rangeWithin')} 100Km
          </label>
          <input
            type="radio"
            name="range"
            value="200"
            id="200"
            checked={range === 200}
            onChange={handleRangeChange}
          />
          <label className="c-filter-range__range-input" htmlFor="200">
            {translate('vacancyListerBlock', 'rangeWithin')} 200Km
          </label>
        </fieldset>

        <Link
          href={`/${searchPrefixLocale}?${coordinates}&range=${range}`}
          className={`c-filter-range__button ${
            isValidSearch ? '' : 'c-filter-range__button--disabled'
          }`}
        >
          {translate('vacancyListerBlock', 'locationSearchPlaceholder')}
        </Link>
      </div>
    </div>
  );
}

export default RangeFilter;
