import { localization } from 'config';

const cleanJobObject = ({ jobData, visibleSpecArray, locale }) => {
  if (!locale) throw new Error('locale is not defined');

  return {
    ...jobData,
    specs: {
      ...(visibleSpecArray.includes('region') && {
        region: jobData.specs?.region ? jobData.specs?.region : '',
      }),
      ...(visibleSpecArray.includes('city') && {
        city: jobData.specs?.city
          ? jobData.specs?.city
          : localization?.cityNotFilled,
      }),
      ...(visibleSpecArray.includes('workingPlaceType') && {
        workplaceType: jobData.specs?.workplaceType
          ? jobData.specs?.workplaceType
          : "",
      }),
      ...(visibleSpecArray.includes('educationLevel') && {
        educationLevel: jobData.specs?.educationLevel
          ? jobData.specs?.educationLevel
          : '',
      }),
      ...(visibleSpecArray.includes('employmentTerm') && {
        employmentTerm: jobData.specs?.employmentTerm
          ? jobData.specs?.employmentTerm
          : '',
      }),
      ...(visibleSpecArray.includes('experienceLevel') && {
        experienceLevel: jobData.specs?.experienceLevel
          ? jobData.specs?.experienceLevel
          : '',
      }),
      ...(visibleSpecArray.includes('hoursPerWeek') && {
        hoursPerWeek: jobData.specs?.hoursPerWeek
          ? jobData.specs?.hoursPerWeek
          : 'hoursPerWeek',
      }),
      ...(visibleSpecArray.includes('functionGroup') && {
        functionGroup: jobData.specs?.functionGroup
          ? jobData.specs?.functionGroup
          : '',
      }),
      ...(visibleSpecArray.includes('function') && {
        function: jobData.specs?.function ? jobData.specs?.function : '',
      }),
      ...(visibleSpecArray.includes('industry') && {
        industry: jobData.specs?.industry ? jobData.specs?.industry : '',
      }),
      ...(visibleSpecArray.includes('companyType') && {
        companyType: jobData.specs?.companyType
          ? jobData.specs?.companyType
          : '',
      }),
      ...(visibleSpecArray.includes('educationLevel') && {
        educationLevel: jobData.specs?.educationLevel
          ? jobData.specs?.city
          : '',
      }),
      ...(visibleSpecArray.includes('closingDate') && {
        closingDate: jobData.specs?.closingDate
          ? jobData.specs?.closingDate
          : '',
      }),
      ...(visibleSpecArray.includes('startDate') && {
        startDate: jobData.specs?.startDate ? jobData.specs?.startDate : '',
      }),
      ...(visibleSpecArray.includes('duration') && {
        duration: jobData.specs?.duration ? jobData.specs?.duration : '',
      }),
      ...(visibleSpecArray.includes('salary') && {
        salary: jobData.specs?.salary ? jobData.specs?.salary : '',
      }),
    },
  };
};

export default cleanJobObject;
