//reshapes the data of the jobs so that it is easier to handle in the FE & filters

import { localization } from 'config';
import createImpressionstring from './gtm/gtm-create-impression-string';

// !Important - For filtering we only look at what is inside the object filteringElements. This way we can make sure that numbers are clean, naming is nice and we don't care about anything visual.

function timeConverterDateObject(UNIX_timestamp, locale) {
  const localeString = locale === 'nl' ? 'nl-NL' : 'en-EN';
  const currentDate = new Date(UNIX_timestamp);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat(localeString, options).format(
    currentDate,
  );
  return formattedDate;
}

const normalizeJob = ({ jobData, locale = 'nl' } = {}) => {
  if (!jobData || !jobData.specs) {
    throw new Error('No jobdata passed in the normalizer');
  }
  const weekLocale = locale === 'en' ? 'week' : 'week';
  const monthsLocale = locale === 'en' ? 'months' : 'maand(en)';
  const remoteLocale = locale === 'en' ? 'Remote' : 'op afstand';
  const hybridLocale = locale === 'en' ? 'Hybrid' : 'Hybride';

  const workingType = jobData?.specs?.workplaceType;

  const isSelfEmployed =
    jobData.specs.suitableFor?.includes('Self-employed professional') ||
    jobData.specs.suitableFor?.includes('Zelfstandig professional');

  const isSupplier =
    jobData.specs.suitableFor?.includes('Leverancier') ||
    jobData.specs.suitableFor?.includes('Supplier');

  const isExpat = jobData.specs.suitableFor?.includes('Expat');
  // const region = translate({
  //   file: 'Region',
  //   key: jobData.location.region,
  // });
  let hoursPerWeek = '';
  if (jobData?.workingHours) {
    if (jobData.workingHours.min == jobData.workingHours.max) {
      hoursPerWeek = `${jobData.workingHours.min} ${weekLocale}`;
    } else {
      hoursPerWeek = `${jobData.workingHours.min} - ${jobData.workingHours.max} | ${weekLocale}`;
    }
  } else if (jobData?.specs?.hoursPerWeek) {
    hoursPerWeek = `${jobData.specs.hours} | ${weekLocale}`;
  }

  let closingDate = timeConverterDateObject(
    jobData?.closingDate?.timestamp.t,
    locale,
  );

  let startDate = timeConverterDateObject(
    jobData?.startingDate?.timestamp.t,
    locale,
  );
  let duration = jobData.specs.minimumWorkingDurationMonths
    ? `${jobData.specs.minimumWorkingDurationMonths} ${monthsLocale}`
    : '';

  const localizationObj = localization.find((l) => l.locale === locale);

  const relativePath = `${localizationObj.isDefault ? '' : locale + '/'}${
    localizationObj.vacancy
  }`;
  return {
    ...jobData,
    status: jobData.status,
    vacancyUrl: `${relativePath}/${jobData.title.replaceAll(' ', '-')}_${
      jobData.publicationId
    }`,
    impressionString: createImpressionstring({ jobData }),
    publishedAt: timeConverterDateObject(
      jobData.firstPublishedAt.timestamp.t,
      locale,
    ),
    topJob: null,
    salary: jobData.salary,
    recruiter: jobData.recruiter,
    selfEmployed: isSelfEmployed,
    supplier: isSupplier,
    expat: isExpat,
    workplaceType: jobData?.specs?.workplaceType,
    // topJob: showTopjob ? jobData.topVacature : null,
    specs: {
      ...jobData.specs,
      region: jobData.location.region,
      city:
        jobData.specs.workplaceType === 'Op afstand'
          ? remoteLocale
          : jobData.specs.workplaceType === hybridLocale
          ? `${jobData.location.city}, ${remoteLocale}`
          : jobData.location.city,
      industry: jobData.industry,
      function: jobData.function,
      functionGroup: jobData.functionGroup,
      sector: jobData.sector,
      companyType: jobData.company.companyType,
      category: jobData.category ? jobData.category : '',
      hoursPerWeek: hoursPerWeek,
      languages: jobData.specs.languages,
      startDate: startDate,
      closingDate: closingDate,
      //todo translate duration
      duration: duration,
    },

    filteringElements: {
      ...jobData.specs,
      region: jobData.location.region,
      city: jobData.location.city,
      industry: jobData.industry,
      function: jobData.function,
      functionGroup: jobData.functionGroup,
      sector: jobData.sector,
      companyType: jobData.company.companyType,
      category: jobData.category ? jobData.category : '',
      hoursPerWeek: hoursPerWeek,
      languages: jobData.specs.languages,
      startDate: startDate,
      closingDate: closingDate,
      //todo translate duration
      duration: jobData.specs.minimumWorkingDurationMonths ?? false,
      selfEmployed: isSelfEmployed,
      supplier: isSupplier,
      expat: isExpat,
    },
  };
};

export default normalizeJob;
