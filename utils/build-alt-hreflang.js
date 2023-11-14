import { getLocales } from 'config';

const buildAltHreflang = ({ full_slug } = {}, currentLang) => {
  const { main, alternate } = getLocales();

  return {
    locale: currentLang === main ? alternate : main,
    link: full_slug?.replace('fixed-today/', '') ?? '/',
  };
};

export const localization = {
  nl: {
    vacancy: 'vacInDutch',
    application: 'applicationInGer',
  },
  en: {
    vacancy: 'vacInEng',
    application: 'applicationInDutch',
  },
};

export default buildAltHreflang;
