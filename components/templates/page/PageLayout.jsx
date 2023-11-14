import { storyblokEditable, StoryblokComponent } from '@storyblok/react/rsc';
import MongoSearchComponent from '../../stand-alone-components/mongo-search/MongoSearch.component';
// import Head from 'next/head';
import Cookiewall from '../../stand-alone-components/cookiewall/Cookiewall';
import { translateString } from '@/lib/translateString';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

//Storyblok-specific layout component
export default function PageLayout(props) {
  if (!props) return null;
  const {
    blok,
    jobListerData,
    url,
    isSearchPage,
    pageResults,
    dictionary,
    relatedVacancies,
    jobCounts,
    currentLocale,
    articleArray,
    recruiterProfilesArray,
  } = props;

  const translate = translateString(dictionary);

  const jobData = props.jobData;

  const { body, pageTitle } = blok;

  return (
    <main {...storyblokEditable(blok)} className="c-page-layout__outer-wrapper">
      <GoogleReCaptchaProvider
        reCaptchaKey={'6Lf5F8AoAAAAAE7fLMzfqsgdsIYIOkkex7M5PLSb'}
        scriptProps={{
          defer: true,
          appendTo: 'head',
        }}
      >
        <Cookiewall translate={translate} />
        {body?.length
          ? body.map((nestedBlok) => {
              if (
                isSearchPage &&
                nestedBlok?.component == 'vacancyListerBlock'
              ) {
                return;
              }
              return (
                <StoryblokComponent
                  blok={nestedBlok}
                  jobCounts={jobCounts}
                  key={nestedBlok._uid}
                  jobListerData={
                    nestedBlok.component === 'vacancyListerBlock'
                      ? jobListerData
                      : null
                  }
                  jobData={jobData}
                  url={url}
                  relatedVacancies={relatedVacancies}
                  translate={translate}
                  currentLocale={currentLocale}
                  articleArray={articleArray}
                  recruiterProfilesArray={recruiterProfilesArray}
                />
              );
            })
          : null}
        {isSearchPage && jobListerData ? (
          <MongoSearchComponent
            translate={translate}
            jobListerData={jobListerData}
            currentLocale={currentLocale}
          />
        ) : null}
      </GoogleReCaptchaProvider>
    </main>
  );
}
