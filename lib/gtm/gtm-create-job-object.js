const formatGtmJobObject = ({ jobData = {}, index = 0 }) => {
  return {
    item_name: jobData.title ? jobData.title : null,
    item_id: jobData.publicationId ? jobData.publicationId : null,
    item_variant: jobData.jobId ? jobData.jobId : null,
    //check with colin
    item_category: jobData.specs.category ? jobData.specs.category : null,
    region: jobData.specs.region ? jobData.specs.region : null,
    //check with colin
    city: jobData.specs.city ? jobData.specs.city : null,
    duration: jobData.specs.duration ? jobData.specs.duration : null,
    price: 1.0,
    working_hours: jobData.specs.hoursPerWeek
      ? jobData.specs.hoursPerWeek
      : null,
    start_date: jobData.specs.startDate ? jobData.specs.startDate : null,
    closing_date: jobData.specs.closingDate ? jobData.specs.closingDate : null,
    index: index,
  };
};

export default formatGtmJobObject;
