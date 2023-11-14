import cleanJobObject from '../clean-job-object';
import getJobsFromMongo from './get-jobs-mongo';

export const hardCodedVisibleSpecConfig = {
  visibleSpecConfiguration: [
    {
      filter: 'region',
      showOnRelatedVacancyCard: true,
      showOnVacancyHero: false,
    },
    {
      filter: 'city',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: true,
    },
    {
      filter: 'sector',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'educationLevel',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'employmentTerm',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'experienceLevel',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'hoursPerWeek',
      showOnRelatedVacancyCard: true,
      showOnVacancyHero: true,
    },
    {
      filter: 'functionGroup',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'function',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'industry',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'companyType',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'educationLevel',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'closingDate',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: true,
    },
    {
      filter: 'salary',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: false,
    },
    {
      filter: 'startDate',
      showOnRelatedVacancyCard: false,
      showOnVacancyHero: true,
    },
    {
      filter: 'duration',
      showOnRelatedVacancyCard: true,
      showOnVacancyHero: true,
    },
  ],
};

const amountOfVacancies = 3;

export default async ({ relatedValue, config, url }) => {
  let relatedVacancies = [];
  const visibleSpecConfig = config?.data?.story?.content?.vacancySpecConfig
    ? JSON.parse(config.data.story.content.vacancySpecConfig)
        .visibleSpecConfiguration
    : visibleSpecs.visibleSpecConfiguration;

  const visibleSpecArray = visibleSpecConfig
    .filter((filterItem) => filterItem.showOnRelatedVacancyCard)
    .map((filterItem) => filterItem.filter);

  const vacancies = await getJobsFromMongo({ locale: url.params.lang });

  if (vacancies?.length) {
    relatedVacancies = vacancies.filter((v) => {
      //return false when job is the same as displayed job
      if (v.publicationId === url.params.jobSlug) return false;

      return (
        v.filteringElements.functionGroup.toLowerCase() ===
        relatedValue.toLowerCase()
      );
    });
  }

  // Put related vacancies back
  const cleanVacancies = relatedVacancies.map((vacancy) =>
    cleanJobObject({
      jobData: vacancy,
      visibleSpecArray,
      locale: url.params.lang,
    }),
  );

  return cleanVacancies.slice(0, amountOfVacancies);
};
