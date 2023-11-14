import normalizeJob from 'lib/normalize-job';

const query = JSON.stringify({
  query: `{

    vacancies(limit: 4000) {
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
      description
      employmentContitions
      applicationProcedure
      specs {
        educationLevel
        employmentTerm
        experienceLevel
        hoursPerWeek
        languages
        suitableFor
        minimumWorkingDurationMonths
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
      company {
        name
        description
        companyType
      }
    }


  }`,
});

const getJobsFromMongo = async ({ locale = 'nl' } = {}) => {
  if (process.env.CACHE_DEV_MODE) {
    console.info('getJobsFromMongo');
  }
  try {
    const response = await fetch(process.env.MONGO_GRAPHQL_ENDPOINT, {
      method: 'post',
      body: query,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': query.length,
        apiKey: process.env.MONGO_API_KEY,
      },
      next: { revalidate: 3600, tags: ['vacancies-all'] },
    });

    if (process.env.CACHE_DEV_MODE) {
      console.info(
        `getJobsFromMongo Status: ${response.status} | ${response.cacheState}`,
      );
    }

    const json = await response?.json();
    if (process.env.CACHE_DEV_MODE) {
      console.info(`Status: ${response.status} | ${response.cacheState}`);
    }
    const vacancies = json?.data?.vacancies;

    return vacancies.map((vacancy) =>
      normalizeJob({ jobData: vacancy, locale: locale }),
    );
  } catch (e) {
    console.error('Error fetching vacancies from mongo: ', e);
  }
};

export default getJobsFromMongo;
