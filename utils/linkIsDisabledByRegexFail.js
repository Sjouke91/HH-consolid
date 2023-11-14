export function linkIsDisabledByRegexFail(postCodePatternMatch, postcode) {
  let disabledStatus;
  if (postCodePatternMatch === null || !postcode) {
    disabledStatus = false;
  }
  if (postcode && postCodePatternMatch === false) {
    disabledStatus = true;
  }

  return disabledStatus;
}
