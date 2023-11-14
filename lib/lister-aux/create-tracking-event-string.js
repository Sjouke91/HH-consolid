function paramsToString(obj) {
  const objectPropArray = Object.entries(obj);

  const result = objectPropArray.map(([name, value]) => {
    const rewrittenValue = value.replaceAll(' |', ',');
    return `${name}: ${rewrittenValue}`;
  });

  return result.join(' | ');
}

function createTrackingEventString({ searchParams }) {
  return paramsToString(searchParams);
}

export default createTrackingEventString;
