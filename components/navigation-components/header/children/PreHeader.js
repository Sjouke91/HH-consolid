import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import rewriteSlug from 'utils/rewriteSlug';
import { getLocales } from 'config';

export default function PreHeader({
  preHeaderData,
  locales,
  currentLocale,
  altHrefLang,
}) {
  const [selectedLocale, set_selectedLocale] = useState(currentLocale);
  const router = useRouter();
  const preHeaderMenuItems = preHeaderData?.[0]?.menuItems;

  const { main, alternate } = getLocales();
  const altLocale = currentLocale === main ? alternate : main;
  const altPage = altHrefLang?.link ?? `${altLocale}/home`;

  const handleChange = (e) => {
    if (e.target.value != currentLocale) {
      router.push(`${rewriteSlug(altPage)}`);
    }
  };

  return (
    <div className="c-pre-header__outer-wrapper">
      <div className="c-pre-header__inner-wrapper">
        <div className="c-pre-header__menu-items">
          {preHeaderMenuItems?.map((menuItem) => {
            const isExternal = menuItem?.linkedInternalPage?.linktype === 'url';
            const storyLink =
              menuItem?.linkedInternalPage?.story?.full_slug ??
              menuItem?.linkedInternalPage?.cached_url;

            return storyLink ? (
              <div
                key={menuItem?._uid}
                className="c-pre-header__menu-item-container"
              >
                <div className="c-pre-header__menu-item-content-container">
                  {isExternal ? (
                    <a
                      className={`c-pre-header__menu-item ${
                        menuItem?.linkText === 'in' ? 'linkedin' : ''
                      }`}
                      href={storyLink}
                      target="_blank"
                    >
                      {menuItem?.linkText === 'in' ? null : menuItem?.linkText}
                    </a>
                  ) : (
                    <Link
                      href={rewriteSlug(storyLink)}
                      className="c-pre-header__menu-item"
                    >
                      {menuItem?.linkText}
                    </Link>
                  )}
                </div>
              </div>
            ) : null;
          }) ?? null}
        </div>
      </div>
    </div>
  );
}
