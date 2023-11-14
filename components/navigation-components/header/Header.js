'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import { localization } from 'utils/build-alt-hreflang';
import rewriteSlug from 'utils/rewriteSlug';
import icons from 'public/icons';
import PreHeader from './children/PreHeader';
import Breadcrumbs from './children/Breadcrumbs';

export default function Header(props) {
  const {
    blok,
    altHrefLang,
    currentLocale,
    pageType,
    params,
    showBreadcrumbs,
    translate,
  } = props;
  const { logo, menuItems, preHeader, searchBar } = blok;
  const locales = localization && Object.keys(localization);
  const router = useRouter();
  const [showOverlay, set_showOverlay] = useState(false);
  const [menuOpen, set_menuOpen] = useState(false);
  const searchData = searchBar[0];

  const handleClick = () => {
    set_menuOpen((prevState) => !prevState);
    const body = document.querySelector('body');

    if (menuOpen && !showOverlay) {
      body.classList?.remove('overflow-y-hidden');
    } else {
      body.classList?.toggle('overflow-y-hidden');
    }
  };

  const handleNavigate = () => set_menuOpen(false);

  let url;
  if (typeof window !== 'undefined') {
    url = window?.location?.href;
  }

  const openOverlay = () => {
    set_showOverlay(true);
    const body = document.querySelector('body');
    body.classList?.add('overflow-y-hidden');
  };

  const closeOverlay = () => {
    set_showOverlay(false);
    const body = document.querySelector('body');
    if (!menuOpen) {
      body.classList?.remove('overflow-y-hidden');
    }
  };

  function closeMobileMenu() {
    set_menuOpen(false);
    const body = document.querySelector('body');

    if (menuOpen && !showOverlay) {
      body.classList?.remove('overflow-y-hidden');
    }
  }

  const pushToHome = () =>
    router.push(`${rewriteSlug(`/${currentLocale}/home`)}`);

  useEffect(() => {
    const body = document.querySelector('body');

    if (menuOpen) {
      body.classList.add('overflow-y-hidden');
    } else {
      body.classList.remove('overflow-y-hidden');
    }

    // Cleanup function to remove the class when the component is unmounted
    return () => body.classList.remove('overflow-y-hidden');
  }, [menuOpen]);

  useEffect(() => {
    const body = document.querySelector('body');

    if (menuOpen) {
      body.classList.add('overflow-y-hidden');
    } else {
      body.classList.remove('overflow-y-hidden');
    }

    // Cleanup function to remove the class when the component is unmounted
    return () => body.classList.remove('overflow-y-hidden');
  }, [menuOpen]);

  return (
    <>
      {showBreadcrumbs && <Breadcrumbs params={params} pageType={pageType} />}
      <div className="header__overlay-wrapper">
        <div
          className={`c-header__search-overlay ${
            showOverlay ? 'overlay-visible' : ''
          }`}
        >
          <div
            onClick={closeOverlay}
            className="c-header__search-overlay-close"
            dangerouslySetInnerHTML={{
              __html: icons.close,
            }}
          ></div>
          <StoryblokComponent
            currentLocale={currentLocale}
            key={searchData?._uid}
            blok={searchData}
            closeHeaderSearchOverlay={closeOverlay}
            closeMobileMenu={closeMobileMenu}
          />
        </div>
      </div>
      <div
        {...storyblokEditable(blok)}
        className={`c-header__outer-wrapper outer-wrapper ${
          menuOpen ? 'menu-open' : ''
        }`}
      >
        <div
          className={`c-header__inner-wrapper inner-wrapper ${
            menuOpen ? 'menu-open' : ''
          }`}
        >
          <div
            className={`c-header__pre-header ${menuOpen ? 'menu-open' : ''}`}
          >
            {preHeader ? (
              <PreHeader
                preHeaderData={preHeader}
                locales={locales}
                currentLocale={currentLocale}
                altHrefLang={altHrefLang}
                translate={translate}
              />
            ) : null}
          </div>
          <div
            className={`c-header__logo-links  ${menuOpen ? 'menu-open' : ''}`}
          >
            <div
              className={`c-header__logo-link-wrapper ${
                menuOpen ? 'menu-open' : ''
              }`}
            >
              <div className="c-header__image-container image-container">
                <Image
                  onClick={pushToHome}
                  src={logo.filename}
                  alt={logo.alt}
                  width={200}
                  height={50}
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div
                className={`c-header__mobile-icons ${
                  menuOpen ? 'menu-open' : ''
                }`}
              >
                {menuOpen ? (
                  <div className="c-header__mobile-search">
                    <Image
                      onClick={openOverlay}
                      src={'/circle8-mobile-search.svg'}
                      className="c-header__mobile-search-icon"
                      width={40}
                      height={40}
                      alt="close menu"
                    />
                  </div>
                ) : null}
                <div
                  onClick={handleClick}
                  className={`c-header__mobile-menu ${
                    menuOpen ? 'menu-open' : ''
                  }`}
                >
                  {menuOpen ? (
                    <Image
                      src={'/circle8-mobile-menu-close.svg'}
                      className="c-header__menu-icon"
                      width={40}
                      height={40}
                      alt="close menu"
                    />
                  ) : (
                    <Image
                      alt="open menu"
                      className="c-header__menu-icon"
                      src={'/circle8-mobile-menu.svg'}
                      width={40}
                      height={40}
                    />
                  )}
                </div>
              </div>
            </div>
            <div
              className={`c-header__menu-container ${
                menuOpen ? 'menu-open' : ''
              }`}
            >
              {menuItems.map((nestedBlok) => {
                return (
                  <StoryblokComponent
                    handleNavigate={handleNavigate}
                    blok={nestedBlok}
                    key={nestedBlok._uid}
                  />
                );
              })}
            </div>
            {searchData ? (
              <div className="c-header__desktop-search">
                <div
                  className={`c-header__search-icon `}
                  dangerouslySetInnerHTML={{
                    __html: icons.headerSearch,
                  }}
                  onClick={openOverlay}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
