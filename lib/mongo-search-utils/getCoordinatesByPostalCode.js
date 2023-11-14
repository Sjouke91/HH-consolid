// import coordinateList from './postalCodeCoordinates.json';
import coordinateList from './cityCoordinatesGerman.json';

export function getCoordinatesByPostalCode(postalCode) {
  if (!postalCode) return [null, null];
  if (postalCode && coordinateList && typeof postalCode === 'string') {
    const formattedPostalCode = postalCode?.trim();
    const postalCodeCoordinates = coordinateList.find(function (location) {
      return location.postcode.includes(formattedPostalCode);
    });

    if (postalCodeCoordinates) {
      const { lng, lat } = postalCodeCoordinates;
      return [lng, lat];
    } else {
      return [null, null];
    }
  } else {
    return [null, null];
  }
}
