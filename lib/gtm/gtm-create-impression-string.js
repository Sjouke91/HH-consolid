const createImpressionstring = ({ jobData = {} }) => {
  return `item_list_name: ${
    jobData.title ? jobData.title : null
  }, item_list_id: ${
    jobData.publicationId ? jobData.publicationId : null
  }, item_name: ${jobData.title ? jobData.title : null}, item_id: ${
    jobData.publicationId ? jobData.publicationId : null
  }, region: ${jobData.specs.region ? jobData.specs.region : null}, duration: ${
    jobData.specs.duration ? jobData.specs.duration : null
  }, working_hours: ${
    jobData.specs.hoursPerWeek ? jobData.specs.hoursPerWeek : null
  }, start_date: ${
    jobData.specs.startDate ? jobData.specs.startDate : null
  }, closing_date: ${
    jobData.specs.closingDate ? jobData.specs.closingDate : null
  }, price: ${1.0}, quantity: ${1.0}`;
};

export default createImpressionstring;
