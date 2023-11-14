'use client';
import { StoryblokComponent } from '@storyblok/react';
import { UiCtx } from '@direct-impact/difj-core';
import { translateString } from 'lib/translateString';
import { useEffect } from 'react';
import pushToDataLayer from '@/lib/gtm/gtm-datalayer-push';
import { usePathname } from 'next/navigation';
import writeUtm from '@/lib/gtm/gtm-write-utm';

export default function StoryblokLayout(props) {
  const {
    children,
    headerMenu,
    footerMenu,
    organizationalSchema,
    altHrefLang,
    currentLocale,
    params,
    pageType,
    showBreadcrumbs,
    dictionary,
  } = props;
  const currentPage = usePathname();
  const translate = translateString(dictionary);

  //GTM Datalayer push: Page view event
  useEffect(() => {
    const dataLayerEvent = {
      event: 'page_view',
      page: currentPage,
    };
    pushToDataLayer(dataLayerEvent);
  }, []);

  // Store utms in window.sessionStorage
  useEffect(() => {
    if (!window) {
      console.error('no window');
      return;
    }
    const url = window.location.search;
    const referrer = document.referrer;

    if (
      document &&
      document.location.hostname &&
      (url || (referrer !== '' && !referrer.includes('www.edv-koenigstein.de')))
    ) {
      const utm = writeUtm(referrer);
    }
  }, []);

  return (
    <>
      <UiCtx.Provider>
        <StoryblokComponent
          blok={headerMenu}
          altHrefLang={altHrefLang}
          currentLocale={currentLocale}
          params={params}
          pageType={pageType}
          showBreadcrumbs={showBreadcrumbs}
          translate={translate}
        />
        {children}
        <StoryblokComponent
          translate={translate}
          blok={footerMenu}
          organizationalSchema={organizationalSchema}
        />
      </UiCtx.Provider>
    </>
  );
}
