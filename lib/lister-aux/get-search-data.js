import * as Realm from 'realm-web';
import normalizeJob from 'lib/normalize-job';
import { getCoordinatesByPostalCode } from '../mongo-search-utils/getCoordinatesByPostalCode';
import { getCleanPostcode } from '@/lib/mongo-search-utils/getCleanPostcode';
import { getCoordinatesByCityName } from '../mongo-search-utils/getCoordinatesByCityName';

//Query for the mongo GraphQL resolver fieldNames
export const searchVacancyQuery = `
  query ($input: String) {
    searchVacanciesResolver(input: $input) {
      _id
      jobId
      status
      priorityStatus
      isDeleted
      firstPublishedAt {
        timestamp {
          t
          i
        }
      }
      startingDate {
        timestamp {
          t
          i
        }
      }
      closingDate {
        timestamp {
          t
          i
        }
      }
      showWebsiteStartDate {
        timestamp {
          t
          i
        }
      }
      showWebsiteEndDate {
        timestamp {
          t
          i
        }
      }
      publicationId
      category
      industry
      function
      functionGroup
      sector
      topVacature
      subCategory
      title
      intro
      location {
        city
        region
        country
        postalCode
        address
      }
      salary {
        from
        to
        period
      }
      specs {
        educationLevel
        employmentTerm
        experienceLevel
        hoursPerWeek
        workplaceType
        languages
      }
      workingHours {
        min
        max
      }
      tags

      company {
        name
        description
        companyType
      }
    }
  }
`;

export const searchVacancyRangeQuery = `
  query ($input: String) {
    searchVacanciesRangeResolver(input: $input) {
      _id
      jobId
      status
      priorityStatus
      isDeleted
      firstPublishedAt {
        timestamp {
          t
          i
        }
      }
      startingDate {
        timestamp {
          t
          i
        }
      }
      closingDate {
        timestamp {
          t
          i
        }
      }
      showWebsiteStartDate {
        timestamp {
          t
          i
        }
      }
      showWebsiteEndDate {
        timestamp {
          t
          i
        }
      }
      publicationId
      category
      industry
      function
      functionGroup
      sector
      topVacature
      subCategory
      title
      intro
      location {
        city
        region
        country
        postalCode
        address
      }
      salary {
        from
        to
        period
      }
      specs {
        educationLevel
        employmentTerm
        experienceLevel
        hoursPerWeek
        workplaceType
        languages
      }
      workingHours {
        min
        max
      }

      company {
        name
        description
        companyType
      }
    }
  }
`;

export const searchPageQuery = `
  query ($input: String) {
    searchPagesResolver(input: $input) {
      _id
      id
      uuid
      pageName
      content
      slug
      fullSlug
      defaultFullSlug
      alternateSlugs {
        name
        slug
        full_slug
      }
    }
  }
`;

// Connect to MongoDB Realm app
const APP_ID = process.env.MONGO_APP_ID;
const graphqlUri = process.env.MONGO_GRAPHQL_ENDPOINT;
const app = new Realm.App(APP_ID);

// Gets valid Realm user access token to authenticate requests, handles login and token refreshing
async function getValidAccessToken() {
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  } else {
    await app.currentUser.refreshAccessToken();
  }
  return app.currentUser.accessToken;
}

//Fetching functions
async function getMongoSearchData({
  query,
  lat,
  long,
  postcode,
  range,
  searchTarget,
  locale = 'nl',
}) {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('INVALID OR MISSING ATLAS ACCESS TOKEN');
  }

  if (searchTarget === 'content') {
    return getMongoPages(query, accessToken);
  }

  //lon lat search - no query
  if (long && lat && range && !query) {
    //SEARCH BY POSTCODE WITHIN A RANGE
    const rangeQuery =
      lat && long ? `long=${long}+lat=${lat}+range=${range}` : '';
    return getMongoJobsWithinRange(rangeQuery, accessToken);
  }

  //postcode search - no query
  if (postcode && range && !query) {
    const cleanPostcode = getCleanPostcode(postcode);
    let coords = getCoordinatesByPostalCode(postcode);

    if (coords && Array.isArray(coords) && coords?.includes(null)) {
      coords = getCoordinatesByCityName(postcode);
    }

    if (coords && coords?.includes(null)) {
      console.info('getMongoSearchData| Missing coordinates');
      return [];
    }
    const long = coords && coords?.[0];
    const lat = coords && coords?.[1];

    //SEARCH BY POSTCODE WITHIN A RANGE
    const rangeQuery =
      lat && long ? `long=${long}+lat=${lat}+range=${range}` : '';
    return getMongoJobsWithinRange(rangeQuery, accessToken);
  }

  //QUERY - no location data
  if (query && !postcode && !range) {
    return getMongoJobs(query, accessToken);
  }
}

async function getMongoJobs(q, token) {
  if (!q) {
    console.info('MISSING SEARCH QUERY - JOB SEARCH');
    return;
  }
  try {
    const vacancySearchResponse = await fetch(graphqlUri, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `${searchVacancyQuery}`,
        variables: { input: `${q}` },
      }),
      next: { revalidate: 3600, tags: ['vacancies-all'] },
    });

    if (process.env.CACHE_DEV_MODE) {
      console.log(
        `vacancySearchResponse Status: ${vacancySearchResponse.status} | ${vacancySearchResponse.cacheState}`,
      );
    }

    const vacancySearchResponseData = await vacancySearchResponse?.json();
    const vacancySearchResult =
      vacancySearchResponseData?.data?.searchVacanciesResolver;

    if (vacancySearchResult && vacancySearchResult?.length) {
      return { vacancies: vacancySearchResult };
    } else {
      console.log('getMongoJobs: No jobs received from mongo search query');
      return { vacancies: [] };
    }
  } catch (error) {
    console.error(error);
  }
}

async function getMongoJobsWithinRange(q, token) {
  if (!q) {
    console.log('MISSING SEARCH QUERY - RANGE SEARCH');
    return;
  }
  try {
    const vacancySearchResponse = await fetch(graphqlUri, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchVacancyRangeQuery,
        variables: { input: q },
      }),
      next: { revalidate: 3600, tags: ['vacancies-all'] },
    });

    if (process.env.CACHE_DEV_MODE) {
      console.log(
        `vacancySearchResponse Status: ${vacancySearchResponse.status} | ${vacancySearchResponse.cacheState}`,
      );
    }
    const vacancySearchResponseData = await vacancySearchResponse.json();
    const vacancySearchResult =
      vacancySearchResponseData?.data?.searchVacanciesRangeResolver;
    if (vacancySearchResult && vacancySearchResult?.length) {
      return {
        vacancies: vacancySearchResult,
      };
    } else {
      console.log(
        'getMongoJobsWithinRange: No jobs received via mongo geospatial/range search query',
      );
      return { vacancies: [] };
    }
  } catch (error) {
    console.error(error);
  }
}

async function getMongoPages(q, token) {
  if (!q) {
    console.log('MISSING SEARCH QUERY - PAGE SEARCH');
    return;
  }
  try {
    const pageSearchResponse = await fetch(graphqlUri, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchPageQuery,
        variables: { input: q },
      }),
      next: { revalidate: 3600, tags: ['pages-all'] },
    });

    if (process.env.CACHE_DEV_MODE) {
      console.log(
        `pageSearchResponse Status: ${pageSearchResponse.status} | ${pageSearchResponse.cacheState}`,
      );
    }
    const pageSearchResponseData = await pageSearchResponse?.json();
    const pageSearchResult = pageSearchResponseData?.data?.searchPagesResolver;

    if (pageSearchResult && pageSearchResult?.length) {
      return { pageResults: pageSearchResult };
    } else {
      console.log(
        'getMongoPages| No pages received via mongo page search query',
      );
      return { pageResults: [] };
    }
  } catch (error) {
    console.error(error);
  }
}

const getSearchJobsFromMongo = async ({
  lat,
  long,
  postcode,
  query,
  searchTarget,
  locale,
  range,
}) => {
  const response = await getMongoSearchData({
    lat,
    long,
    postcode,
    query,
    searchTarget,
    locale,
    range,
  });

  return {
    vacancies: response?.vacancies
      ? response.vacancies.map((job) => normalizeJob({ jobData: job, locale }))
      : null,
    pageResults: response?.pageResults,
    searchTarget: searchTarget,
  };
};

export default getSearchJobsFromMongo;
