import getJobsFromMongo from './lister-aux/get-jobs-mongo';

export default async (categoryValue) => {
  const vacancies = await getJobsFromMongo();

  const jobCount = vacancies.filter(
    (job) => job.industry === categoryValue,
  ).length;

  return { category: categoryValue, count: jobCount };
};
