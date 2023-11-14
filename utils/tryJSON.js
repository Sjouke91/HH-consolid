function tryJSON(str) {
  try {
    const parsedJSON = JSON.parse(str);
    return parsedJSON;
  } catch (e) {
    return false;
  }
}

export default tryJSON;
