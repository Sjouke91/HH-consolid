import { getLocales } from 'config';

const rewriteSlug = (slug) => {
  if (!slug?.trim()) return '';

  let finalSlug = `${slug}`.trim();

  const { main, alternate } = getLocales();

  // e.g. slug = fixed-today/nl/over-ons
  if (finalSlug?.startsWith('fixed-today/')) {
    finalSlug = finalSlug?.replace('fixed-today/', '/');
  }
  if (finalSlug?.startsWith(`/${main}`)) {
    finalSlug = finalSlug?.replace(`/${main}`, '');
  }

  if (
    finalSlug?.startsWith(`/${alternate}/home`) ||
    finalSlug?.startsWith('/home')
  ) {
    finalSlug = finalSlug?.replace('/home', '/');
  }

  if (finalSlug.startsWith('tel:') || finalSlug.startsWith('mailto:')) {
    return `${finalSlug}`;
  }

  if (!finalSlug.startsWith('/')) {
    return `/${finalSlug}`;
  }

  return finalSlug;
};

export default rewriteSlug;
