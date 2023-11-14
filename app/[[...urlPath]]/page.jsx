import { notFound } from 'next/navigation';
import StoryblokStory from '@storyblok/react/story';
import jobCategoryCount from 'lib/job-category-count';
import buildAltHreflang from 'utils/build-alt-hreflang';
import StoryblokLayout from '@/components/StoryblokLayout';
import getJobsForPage from 'lib/create-vacancy-lister';
import getSearchData from 'lib/create-search-lister';
import {
  getAllPages,
  getArticles,
  getConfiguration,
  getOnePage,
} from 'lib/storyblok-getters';
import { Suspense } from 'react';
import Loading from './loading';
import rewriteSlug from 'utils/rewriteSlug';

// Return a list of `params` to populate the [slug] dynamic segments
export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages;
}
// Route level optimizations, see
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
// to go to production

export const dynamicParams = true;
export const dynamic = 'auto';
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const revalidate = 14400;

export async function generateMetadata({ params }) {
  const page = await getOnePage(params);
  const config = await getConfiguration(params?.lang);

  const { content, full_slug, alternates } = page?.data?.story ?? {};

  const favicon = config?.data?.story?.content?.favicon?.filename;

  // TODO(Fran): remove content.pageTitile and content.metaDescription after
  // migrating content to the new seo type page plugin in storyblok
  const index = !content?.noIndex ?? true;
  const title = content?.seo?.title ?? content?.pageTitle ?? 'Königstein';
  const description =
    content?.seo?.description ?? content?.metaDescription ?? '';

  // NOTE(Fran): Funciton that generates alternate cannonicals for each languages
  const languages = alternates?.reduce((langs, { full_slug }) => {
    const hasLocale = /^fixed-today\/[a-z]{2}\//g.test(full_slug);
    const locale = full_slug?.split('/')[1];

    if (hasLocale) return { ...langs, [locale]: rewriteSlug(full_slug) };
    return langs;
  }, {});

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_HOST_NAME),
    title,
    description,
    robots: {
      index,
    },
    alternates: {
      canonical: rewriteSlug(full_slug),
      languages: {
        ...languages,
        'x-default': languages?.nl ?? rewriteSlug(full_slug),
      },
    },
    openGraph: {
      title: content?.seo?.og_title,
      description: content?.seo?.og_description,
      images: [{ url: content?.seo?.og_image, width: 800, height: 600 }],
      type: 'website',
      siteName: 'Königstein',
    },
    twitter: {
      title: content?.seo?.twitter_title,
      description: content?.seo?.twitter_description,
      images: [content?.seo?.twitter_image],
    },
    icons: [{ url: favicon ? favicon : '/public/favicon.png' }],
    // pagination: {
    //   prev: '/pagination/1',
    //   next: '/pagination/3',
    // },
  };
}

export default async function Home({ params, searchParams }) {
  // When a 404 on static pages, this page tries to render because it is a catch all route [...]
  // and you get any random string in the lang. We throw the 404 after anyway, but good to catch it here.
  const config = await getConfiguration(params?.lang);
  if (!config) {
    console.error('ISSUE IN', params);
    throw new Error('Failed to load config');
  }

  const articleArray = await getArticles(params?.lang);
  if (!articleArray.length) {
    console.error('ISSUE IN', params);
    // throw new Error('Failed to load articles');
  }

  const recruiterProfilesArray =
    config.data.story.content?.recruiterProfiles || [];

  const headerMenu = config.data.story.content.headerData[0];
  const footerMenu = config.data.story.content.footerData[0];
  const organizationalSchema = config.data.story.content?.organizationSchema;

  const dictionaryData = config.data.story.content?.dictionaryLocale;
  const dictionary = dictionaryData && JSON.parse(dictionaryData);
  const { data } = await getOnePage(params);
  if (!data) return notFound();

  const altHrefLang = buildAltHreflang(data.story.alternates[0], params.lang);
  const isSearchPage = data?.story?.content?.isSearchPage;
  let jobListerData;
  const showBreadcrumbs = data?.story?.content?.showBreadcrumbs;

  const categoryNames = [];
  const contentBody = data?.story?.content?.body;
  contentBody?.forEach((body) => {
    body?.tiles?.forEach((tile) => {
      if (tile?.component === 'categoryTile') {
        categoryNames.push(tile?.categoryName);
      }
    });
  });
  // map over the categoryNames array to return an array of promises.
  const jobCountsPromises = categoryNames.map(
    async (categoryName) => await jobCategoryCount(categoryName),
  );
  const jobCounts = await Promise.all(jobCountsPromises);

  if (isSearchPage) {
    jobListerData = await getSearchData(data.story, {
      params,
      searchParams,
    });
  } else {
    jobListerData = await getJobsForPage(data.story, {
      params,
      searchParams,
    });
  }

  const organizationSchema = JSON.parse(
    config?.data?.story?.content?.organizationSchema,
  );
  delete organizationSchema.socials;

  const pageResults = jobListerData?.pages;
  const pageResultsByLocale =
    pageResults &&
    pageResults?.filter((mongoPage) =>
      mongoPage?.fullSlug?.includes(`/${params?.lang}/`),
    );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Suspense fallback={<Loading />}>
        <StoryblokLayout
          headerMenu={headerMenu}
          footerMenu={footerMenu}
          organizationalSchema={organizationalSchema}
          pageResults={pageResultsByLocale}
          params={params}
          showBreadcrumbs={showBreadcrumbs}
          pageType="page"
          currentLocale={params.lang}
          altHrefLang={altHrefLang}
          dictionary={dictionary}
        >
          <StoryblokStory
            story={data.story}
            isSearchPage={isSearchPage}
            pageResults={pageResultsByLocale}
            jobListerData={jobListerData}
            jobCounts={jobCounts}
            url={{
              params,
              searchParams,
            }}
            dictionary={dictionary}
            currentLocale={params.lang}
            articleArray={articleArray}
            recruiterProfilesArray={recruiterProfilesArray}
          />
        </StoryblokLayout>
      </Suspense>
    </>
  );
}
