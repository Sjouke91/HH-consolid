export const getJobSchema = (jobData = {}) => {
  const datePosted = new Date(
    jobData.firstPublishedAt?.timestamp?.t,
  ).toISOString();
  const validThrough = new Date(
    jobData.closingDate?.timestamp?.t,
  ).toISOString();

  const getMonths = (string = '') => {
    if (string.toLowerCase().match('/junior||jr/')) return 12;
    if (string.toLowerCase().match('/medior||med/')) return 36;
    if (string.toLowerCase().match('/senior||sr/')) return 48;
    return 0;
  };

  const {
    title,
    intro,
    industry,
    recruiter,
    location,
    salary,
    specs: { employmentTerm, experienceLevel } = {},
  } = jobData;

  const data = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    ...(title && { title }),
    ...(intro && { description: intro }),
    ...(datePosted && { datePosted }),
    ...(validThrough && { validThrough }),
    ...(industry && { industry }),
    ...(employmentTerm && { employmentTerm }),

    ...(experienceLevel && {
      experienceRequirements: {
        '@type': 'OccupationalExperienceRequirements',
        monthsOfExperience: getMonths(experienceLevel),
      },
    }),
    hiringOrganization: {
      '@type': 'Organization',
      name: jobData.company.name,
    },
    ...(recruiter && {
      applicationContact: {
        '@type': 'ContactPoint',
        email: recruiter.email,
        name: recruiter.fullName,
        telephone: recruiter.phone,
      },
    }),
    ...(location && {
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressRegion: location.region,
          addressLocality: location.city,
          streetAddress: location.address,
          addressCountry: location.country,
          postalCode: location.postalCode,
        },
      },
    }),
    ...(salary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: {
          '@type': 'QuantitativeValue',
          MinValue: salary.from,
          MaxValue: salary.to,
          unitText: salary.period,
        },
      },
    }),
  };

  return data;
};
