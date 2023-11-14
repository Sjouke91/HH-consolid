export function getCleanPostcode(stringArg) {
  //return unformatted string if it includes a space already
  if (stringArg && stringArg.includes(' ')) {
    return stringArg;
  } else if (stringArg && !stringArg.includes(' ')) {
    //return string with letters replaced with space + letters
    const str = stringArg;
    const firstChar = str.match('[a-zA-Z]');
    const firstCharIndex = str.indexOf(firstChar);

    const letters = str.slice(firstCharIndex);
    const strWithSpace = str.replace(letters, ` ${letters}`);
    return strWithSpace;
  } else {
    return stringArg;
  }
}
