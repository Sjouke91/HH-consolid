import normalizeJob from 'lib/normalize-job';
import { hardCodedVisibleSpecConfig } from '../lister-aux/get-related-vacancies';
import cleanJobObject from '../clean-job-object';

const GET_JOBS = `query ($publicationId: String) {
    vacancy(query:{publicationId:$publicationId}){
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
        description
        employmentContitions
        applicationProcedure
        specs {
          educationLevel
          employmentTerm
          experienceLevel
          hoursPerWeek
          suitableFor
          minimumWorkingDurationMonths
          languages
          workplaceType
        }
        workingHours {
          min
          max
        }
        tags
        recruiter {
          fullName
          email
          phone
        }
        salary {
          from
          to
          period
        }
        company {
          name
          description
          companyType
        }
      }

  }`;

const getJobFromMongo = async ({ publicationId, config, locale = 'nl' }) => {
  const response = await fetch(process.env.MONGO_GRAPHQL_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
      query: GET_JOBS,
      variables: { publicationId },
    }),
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Length': query.length,
      apiKey: process.env.MONGO_API_KEY,
    },
    next: { revalidate: 3600, tags: ['vacancies-all'] },
  });

  if (process.env.CACHE_DEV_MODE) {
    console.log(
      `getJobFromMongo Status: ${response.status} | ${response.cacheState}`,
    );
  }

  const json = await response.json();

  const visibleSpecConfig = config?.data?.story?.content?.vacancySpecConfig
    ? JSON.parse(config.data.story.content.vacancySpecConfig)
        .visibleSpecConfiguration
    : hardCodedVisibleSpecConfig.visibleSpecConfiguration;

  const visibleSpecArray = visibleSpecConfig
    .filter((filterItem) => filterItem.showOnVacancyHero)
    .map((filterItem) => filterItem.filter);

  if (!json.data.vacancy) return false;

  const normalizedJobObject = normalizeJob({
    jobData: json.data.vacancy,
    locale: locale,
  });

  const cleanedJobObject = cleanJobObject({
    jobData: normalizedJobObject,
    visibleSpecArray,
    locale: locale,
  });

  return cleanedJobObject;
};

export default getJobFromMongo;
