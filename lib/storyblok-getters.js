import { storyblokInit, apiPlugin } from '@storyblok/js';
import { getStoryblokApi } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';

const isDev = process?.env?.NODE_ENV === 'development';

// Use for CV, group per 60 seconds.
const getCurrentTimestamp = () => {
  return Math.ceil(Math.floor(Date.now() / 1000) / 60) * 60;
};

const sbParams = {
  version: isDev ? 'draft' : 'published',
  // NOTE: enforces a refresh of the cache, when in dev mode
  resolve_links: 'url',
};

export async function getConfiguration() {
  if (process.env.CACHE_DEV_MODE) {
    console.log('getConfiguration');
  }

  try {
    const defaultUrl = `cdn/stories/siteconfig`;

    const storyblokApi = getStoryblokApi();
    // TODO: this we have 2 configs, so this logic is outdated
    const storyblokData = await storyblokApi.get(defaultUrl, sbParams);

    if (!storyblokData) {
      notFound();
    }

    return storyblokData;
  } catch (e) {
    console.error('error in the getConfiguration request', e);
    return false;
  }
}

export async function getVacancyPage(params) {
  if (process.env.CACHE_DEV_MODE) {
    console.log('getVacancyPage');
  }
  try {
    const storyblokApi = getStoryblokApi();
    const data = await storyblokApi.get(`cdn/stories/FT-000232`, {
      ...sbParams,
      cv: isDev ? +new Date() : getCurrentTimestamp(),
    });
    if (!data) {
      throw new Error('NO DATA FOUND');
    }
    return data;
  } catch (e) {
    console.error('error in the getVacancyPage request', e);
    return false;
  }
}

export async function getApplicationPage(params) {
  if (process.env.CACHE_DEV_MODE) {
    console.log('getApplicationPage');
  }
  try {
    const storyblokApi = getStoryblokApi();
    const data = await storyblokApi.get(`cdn/stories/FT-000232/application`, {
      ...sbParams,
      cv: isDev ? +new Date() : getCurrentTimestamp(),
    });
    if (!data) {
      throw new Error('NO DATA FOUND');
    }
    return data;
  } catch (e) {
    console.error('error in the getApplicationPage request', e);
    return false;
  }
}
export async function getOnePage(params) {
  if (process.env.CACHE_DEV_MODE) {
    console.log('getOnePage');
  }
  try {
    const storyblokApi = getStoryblokApi();
    const data = await storyblokApi.get(
      `cdn/stories/${params.urlPath ? params.urlPath.join('/') : 'home'}`,
      { ...sbParams, cv: isDev ? +new Date() : getCurrentTimestamp() },
    );
    return data;
  } catch (e) {
    console.error('error in the getOnePage request', e);
    return false;
  }
}

export async function getAllPages() {
  if (process.env.CACHE_DEV_MODE) {
    console.log('getAllPages');
  }
  try {
    const storyblokApi = getStoryblokApi();
    const data = await storyblokApi.getAll('cdn/stories', {
      ...sbParams,
      cv: isDev ? +new Date() : getCurrentTimestamp(),
    });

    const allSlugs = data
      ?.filter((story) => story.full_slug.startsWith('fixed-today'))
      .map((story) => story?.full_slug.replace('fixed-today/', ''))
      .filter((story) => story && story !== '')
      .map((story) => story.replace('home', ''));

    const allParamsObject = allSlugs
      // Filter out specific "pages"
      .filter((slug) =>
        slug.includes('/job') ||
        slug.includes('/siteconfig') ||
        slug.includes('/application')
          ? false
          : true,
      )
      .map((slug) => {
        if (slug.startsWith('en/'))
          return {
            urlPath: slug.replace('en/', '').split('/'),
            lang: 'en',
          };
        if (slug.startsWith('nl/'))
          return {
            urlPath: slug.replace('nl/', '').split('/'),
            lang: 'nl',
          };

        return {
          urlPath: slug.replace('nl/', '').split('/'),
          lang: 'nl',
        };
      });
    return allParamsObject;
  } catch (e) {
    console.log('getAllPages getStoryblokApi.getAll', e);
    return false;
  }
}

export async function getStoriesToStoreInMongo() {
  try {
    if (process.env.CACHE_DEV_MODE) {
      console.log('getStoriesToStoreInMongo');
    }
    let page = 1;

    const allStories = [];

    async function recursiveFetcher(page) {
      const { storyblokApi } = storyblokInit({
        accessToken: process.env.ACCESS_TOKEN,
        use: [apiPlugin],
        apiOptions: {
          region: 'eu',
          responseInterceptor: (response) => {
            console.log(
              'Real API call to SB on GetStoriestoMongo | ',
              response.status,
              ' XCACHE:',
              // MAYBE THIS HEADER IS NOT THE ONE WE SHOULD USE TO CHECK FOR CACHED RESPONSES
              response.headers['x-cache'],
              ' | Version:',
              response.data.cv,
            );
            // ALWAYS return the response
            return response;
          },
        },
        cache: {
          clear: 'auto',
          type: 'memory',
        },
      });

      const {
        data: { stories },
      } = await storyblokApi.get('cdn/stories', {
        ...sbParams,
        cv: isDev ? +new Date() : getCurrentTimestamp(),
        starts_with: 'fixed-today',
        page: page,
        per_page: 100,
      });

      const storyCount = stories?.length;

      if (stories && stories?.length) {
        allStories.push(stories);
        page = page + 1;
      }

      if (storyCount) {
        await recursiveFetcher(page);
      }
      return;
    }

    await recursiveFetcher(page);

    const final = allStories.flat(2);
    return final;
  } catch (e) {
    console.error('error in the getStoriesToStoreInMongo request', e);
    return false;
  }
}

export async function getAllPagesIsolated() {
  // NOTE(Fran): We are initiating a new api client here so we can access storyblok api
  // while not being on inside the react provider
  const { storyblokApi } = storyblokInit({
    accessToken: 'tLYGPiLYLbBNhXpBCdPQcAtt',
    use: [apiPlugin],
    apiOptions: {
      region: 'eu',

      responseInterceptor: (response) => {
        console.log(
          'Real API call to SB on GetPagesIsolated | ',
          response.status,
          ' XCACHE:',
          // MAYBE THIS HEADER IS NOT THE ONE WE SHOULD USE TO CHECK FOR CACHED RESPONSES
          response.headers['x-cache'],
          ' | Version:',
          response.data.cv,
        );
        // ALWAYS return the response
        return response;
      },
    },
    cache: {
      clear: 'auto',
      type: 'memory',
    },
  });

  const params = {
    ...sbParams,
    cv: isDev ? +new Date() : getCurrentTimestamp(),
    per_page: 25,
  };

  try {
    const request = await storyblokApi.get('cdn/stories', params);

    const totalPages = request?.headers?.total ?? 1;
    const numberOfRequests = Math.ceil(totalPages / params.per_page);

    // Loops until all pages are fetched
    let otherPages = [];
    for (let currentPage = 2; currentPage <= numberOfRequests; currentPage++) {
      otherPages.push(
        ...(
          await storyblokApi.get('cdn/stories', {
            ...sbParams,
            cv: isDev ? +new Date() : getCurrentTimestamp(),
            page: currentPage,
          })
        ).data.stories,
      );
    }
    const pages = [...request.data.stories, ...otherPages];

    const cleanSlugs = pages
      ?.filter((page) => page?.full_slug?.startsWith('fixed-today/'))
      .filter((page) =>
        page.full_slug.includes('/siteconfig') ||
        page.full_slug.includes('/job') ||
        page.full_slug.includes('/application')
          ? false
          : true,
      );

    return cleanSlugs;
  } catch (error) {
    console.log('getAllPagesIsolated storyblokApi.get', error);
    return [];
  }
}

export async function getArticles(params) {
  if (process.env.CACHE_DEV_MODE) {
    console.log('getArticles');
  }
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get(`cdn/stories/`, {
      version: isDev ? 'draft' : 'published',
      starts_with: `/nieuws/`,
      is_startpage: false,
      ...sbParams,
      cv: isDev ? +new Date() : getCurrentTimestamp(),
    });
    return data.stories.length ? data.stories : [];
  } catch (e) {
    console.error('error in the getOnePage request', e);
    return false;
  }
}
