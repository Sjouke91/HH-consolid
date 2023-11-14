export const localization = [
  {
    locale: 'nl',
    vacancy: 'vacature',
    application: 'sollicitatie',
    homePageStoryblok: 'home',
    searchStoryblok: 'zoeken',
    searchBlockSearch: 'zoeken',
    isDefault: true,
    cityNotFilled: 'Stad: niet bekend',
  },
  {
    locale: 'en',
    vacancy: 'vacancy',
    application: 'application',
    homePageStoryblok: 'home',
    searchStoryblok: 'en/search',
    searchBlockSearch: 'en/search',
    isDefault: false,
    cityNotFilled: 'city: not filled',
  },
];

export const getLocales = () => ({
  main: localization?.find((lang) => lang?.isDefault)?.locale,
  alternate: localization?.find((lang) => !lang?.isDefault)?.locale,
});

export function getLocalisationObject(currentLocale) {
  const defaultLocale = localization?.find((obj) => obj.isDefault);
  const correctLocale = currentLocale
    ? localization?.find((obj) => obj?.locale == currentLocale)
    : defaultLocale;

  return correctLocale;
}
