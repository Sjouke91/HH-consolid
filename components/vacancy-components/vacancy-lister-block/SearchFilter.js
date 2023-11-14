import { getLocalisationObject } from 'config';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

function SearchFilter({ translate, currentLocale }) {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const isValidSearch = search && search.length > 2;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValidSearch) {
      {
        /* TODO: Translate this */
      }
      router.push(
        `/${
          getLocalisationObject(currentLocale).searchStoryblok
        }?query=${search}`,
      );
    }
  };

  return (
    <div className="c-filter-search c-filter-search__wrapper">
      <input
        className={`c-filter-search__input`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={translate('vacancyListerBlock', 'searchPlaceholder')}
        id="filter-search"
        onKeyDown={handleKeyDown}
      />
      <label htmlFor="filter-search" className="c-filter-search__label">
        <Image src="/circle8-mobile-search.svg" width={20} height={20} alt="" />
      </label>
      <Link
        href={`/${
          getLocalisationObject(currentLocale).searchStoryblok
        }?query=${search}`}
        className={`c-filter-search__button ${
          isValidSearch ? '' : 'c-filter-search__button--disabled'
        }`}
      >
        <span>{translate('vacancyListerBlock', 'search')}</span>
      </Link>
    </div>
  );
}

export default SearchFilter;
