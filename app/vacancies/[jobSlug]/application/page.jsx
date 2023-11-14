import StoryblokLayout from '@/components/StoryblokLayout';
import getJobFromMongo from 'lib/vacancy-data/mongo-get-job-data';
import {
  getConfiguration,
  getApplicationPage,
  getVacancyPage,
} from '@/lib/storyblok-getters';
import StoryblokStory from '@storyblok/react/story';
import getJobsForPage from 'lib/create-vacancy-lister';
import getSearchData from '/lib/create-search-lister';
import buildAltHreflang from 'utils/build-alt-hreflang';
import { notFound } from 'next/navigation';
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
  const title = `${jobData?.title ?? 'Job'} Application | Königstein`;
  const description = jobData?.intro ?? '';

  const dutchSlug = `/vacature/${params?.jobSlug}/application`;
  const englishSlug = `/en/vacancy/${params?.jobSlug}/application`;
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

export default async function VacancyApplication({ params, searchParams }) {
  if (!params.lang) return notFound();

  const { data } = await getApplicationPage(params);
  if (!data) return notFound();

  const config = await getConfiguration(params.lang);
  if (!config) {
    console.error('ISSUE IN', params);
    throw new Error('Failed to load config');
  }

  const dictionaryData = config.data.story.content?.dictionaryLocale;
  const dictionary = dictionaryData && JSON.parse(dictionaryData);

  const headerMenu = config.data.story.content.headerData[0];
  const footerMenu = config.data.story.content.footerData[0];
  const jobData = await getJobFromMongo({
    publicationId: params.jobSlug,
    config,
    locale: params.lang,
  });

  if (!jobData) return notFound();

  const organizationalSchema = config.data.story.content?.organizationSchema;

  const isSearchPage = data?.story?.content?.isSearchPage;
  // TODO: check whether boolean showBreadcrumbs work
  const showBreadcrumbs = data?.story?.content?.showBreadcrumbs;

  // TODO: All the languages is not working in job detial
  const altHrefLang = buildAltHreflang(
    data?.story?.alternates?.[0],
    params.lang,
  );

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
        headerMenu={headerMenu}
        footerMenu={footerMenu}
        dictionary={dictionary}
        params={params}
        showBreadcrumbs={showBreadcrumbs}
        pageType="application"
        currentLocale={params.lang}
        altHrefLang={altHrefLang}
        organizationalSchema={organizationalSchema}
      >
        <StoryblokStory
          story={data.story}
          jobData={jobData}
          url={{
            params,
            searchParams,
          }}
          dictionary={dictionary}
        />
      </StoryblokLayout>
    </>
  );
}
