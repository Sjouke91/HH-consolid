// import cityList from './cityCoordinates.json';
import cityList from './cityCoordinatesGerman.json';

const accentAltArray = [
  { name: 'ä', alt: 'a' },
  { name: 'ö', alt: 'o' },
  { name: 'ü', alt: 'u' },
  { name: 'ë', alt: 'e' },
];

function getAlt(accent) {
  const match = accentAltArray.find((a) => a.name === accent);
  return match.alt;
}

export function getCoordinatesByCityName(cityName) {
  const accents = ['ä', 'ö', 'ü', 'ë'];
  if (!cityName) return [null, null];
  if (cityName && cityList && typeof cityName === 'string') {
    const formattedString = cityName?.toLowerCase()?.trim();
    const accentRemoved = formattedString
      ?.split('')
      ?.map(function (letter) {
        if (accents?.includes(letter)) {
          //if letter is an accent
          const accent = accents.find((acc) => letter === acc);
          const alt = getAlt(accent);
          return alt;
        } else {
          return letter;
        }
      })
      ?.join('');
    const matchedCityObject = cityList.find(function (cityObj) {
      const city = cityObj?.city && cityObj?.city?.toLowerCase()?.trim();
      const accentMatch = city?.includes(formattedString);
      const altMatch = city?.includes(accentRemoved);
      return accentMatch || altMatch;
    });
    if (matchedCityObject) {
      const { lng, lat } = matchedCityObject;
      return [lng, lat];
    } else {
      return [null, null];
    }
  } else {
    return [null, null];
  }
}
