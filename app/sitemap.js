import getJobsFromMongo from '@/lib/lister-aux/get-jobs-mongo';
import { getAllPagesIsolated } from '@/lib/storyblok-getters';
import { getLocalisationObject } from 'config';
import { getLocales } from 'config';
import rewriteSlug from 'utils/rewriteSlug';

export default async function sitemap() {
  const { main, alternate } = getLocales();

  const vacancyMain = getLocalisationObject(main)?.vacancy;
  const vacancyAlternate = getLocalisationObject(alternate)?.vacancy;

  try {
    const pages = await getAllPagesIsolated();
    const vacanciesMain = await getJobsFromMongo({ locale: main });
    const vacanciesAlternate = await getJobsFromMongo({ locale: alternate });

    const URL = process?.env?.NEXT_PUBLIC_HOST_NAME ?? 'https://fixedtoday.nl/';

    const routes = pages
      .filter((page) => page?.content?.noIndex === false)
      .map(({ full_slug }) => ({
        url: `${URL}${rewriteSlug(full_slug)}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 1,
      }));

    const mainVancancyRoutes = vacanciesMain.map(({ publicationId }) => ({
      url: `${URL}/${vacancyMain}/${publicationId}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    }));

    const alternateVancancyRoutes = vacanciesAlternate.map(
      ({ publicationId }) => ({
        url: `${URL}/${alternate}/${vacancyAlternate}/${publicationId}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 1,
      }),
    );

    return [...routes, ...mainVancancyRoutes, ...alternateVancancyRoutes];
  } catch (error) {
    console.error(`sitemap.ts ${error}`);
    return [];
  }
}
