const getSliderUrl = (searchParamsOriginalToCopy, urlKey) => {
  const searchParams = { ...searchParamsOriginalToCopy };
  // We don't want to keep pagination when you change filters
  delete searchParams.page;
  // We also need to make sure max and min hours are stripped away
  delete searchParams[`min_${urlKey}`];
  delete searchParams[`max_${urlKey}`];

  // This url will be the base for the component to actually pass the new min max values
  return `?${Object.keys(searchParams)
    .map((key) => {
      return `${key}=${searchParams[key]}`;
    })
    .join('&')}`;
};

export default getSliderUrl;
