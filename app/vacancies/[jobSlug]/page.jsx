import { notFound } from 'next/navigation';
import StoryblokStory from '@storyblok/react/story';
import getSearchData from 'lib/create-search-lister';
import getJobsForPage from 'lib/create-vacancy-lister';
import getRelatedVacancies from 'lib/lister-aux/get-related-vacancies';
import { getConfiguration, getVacancyPage } from 'lib/storyblok-getters';
import getJobFromMongo from 'lib/vacancy-data/mongo-get-job-data';
import buildAltHreflang from 'utils/build-alt-hreflang';
import StoryblokLayout from 'components/StoryblokLayout';
import { getJobSchema } from 'utils/getJobSchema';

export async function generateMetadata({ params }) {
  const page = await getVacancyPage(params);

  const config = await getConfiguration(params?.lang);
  const jobData = await getJobFromMongo({
    publicationId: params?.jobSlug,
    config,
    locale: params?.lang,
  });

  const favicon = config?.data?.story?.content?.favicon?.filename;

  const { content } = page?.data?.story ?? {};
  const title = `${jobData?.title ?? 'Job'} | Königstein`;
  const description = jobData?.intro ?? '';

  const dutchSlug = `/vacature/${params?.jobSlug}`;
  const englishSlug = `/en/vacancy/${params?.jobSlug}`;
  const isNl = params?.lang === 'nl';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_HOST_NAME),
    title,
    description,
    alternates: {
      canonical: isNl ? dutchSlug : englishSlug,
      languages: {
        ...(isNl ? { en: englishSlug } : {}),
        ...(!isNl ? { de: dutchSlug } : {}),
        'x-default': dutchSlug,
      },
    },
    openGraph: {
      title,
      description,
      images: [{ url: content?.seo?.og_image, width: 800, height: 600 }],
      type: 'website',
      siteName: 'Königstein',
    },
    twitter: {
      title,
      description,
      images: [content?.seo?.twitter_image],
    },
    icons: [{ url: favicon ? favicon : '/public/favicon.png' }],
  };
}

export default async function VacancyDetail({ params, searchParams }) {
  if (!params.lang) return notFound();

  const { data } = await getVacancyPage(params);
  if (!data) return notFound();

  const config = await getConfiguration(params?.lang);
  if (!config) {
    console.error('ISSUE IN', params);
    throw new Error('Failed to load config');
  }

  const dictionaryData = config.data.story.content?.dictionaryLocale;
  const dictionary = dictionaryData && JSON.parse(dictionaryData);

  const headerMenu = config.data.story.content.headerData[0];
  const footerMenu = config.data.story.content.footerData[0];

  const recruiterProfilesArray =
    config.data.story.content?.recruiterProfiles || [];
  const jobData = await getJobFromMongo({
    publicationId: params.jobSlug,
    config,
    locale: params.lang,
  });

  if (!jobData) return notFound();

  const isSearchPage = data?.story?.content?.isSearchPage;
  // TODO: check whether boolean showBreadcrumbs work
  const showBreadcrumbs = data?.story?.content?.showBreadcrumbs;

  const organizationalSchema = config.data.story.content?.organizationSchema;

  const relatedVacancies = await getRelatedVacancies({
    relatedValue: jobData.filteringElements.functionGroup,
    config,
    url: {
      params,
      searchParams,
    },
  });

  // TODO: All the languages is not working in application or vacancies
  const altHrefLang = data.story.alternates[0]
    ? buildAltHreflang(data.story.alternates[0], params.lang)
    : '';

  let jobsListerData;

  if (isSearchPage) {
    jobsListerData = await getSearchData(data.story, {
      params,
      searchParams,
    });
  } else {
    jobsListerData = await getJobsForPage(data.story, {
      params,
      searchParams,
    });
  }

  const organizationSchema = JSON.parse(
    config?.data?.story?.content?.organizationSchema,
  );
  delete organizationSchema.socials;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJobSchema(jobData)),
        }}
      />
      <StoryblokLayout
        dictionary={dictionary}
        headerMenu={headerMenu}
        footerMenu={footerMenu}
        params={params}
        showBreadcrumbs={showBreadcrumbs}
        pageType="vacancy"
        currentLocale={params.lang}
        altHrefLang={altHrefLang}
        organizationalSchema={organizationalSchema}
        recruiterProfilesArray={recruiterProfilesArray}
      >
        <StoryblokStory
          story={data.story}
          jobData={jobData}
          dictionary={dictionary}
          recruiterProfilesArray={recruiterProfilesArray}
          url={{
            params,
            searchParams,
          }}
          relatedVacancies={relatedVacancies}
        />
      </StoryblokLayout>
    </>
  );
}
