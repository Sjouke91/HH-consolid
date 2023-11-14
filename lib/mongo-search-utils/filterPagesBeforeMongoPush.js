import { updatePagesCollection } from '@/lib/mongo-search-utils/mongodb';
import { storyBloksToJson } from '@/lib/mongo-search-utils/storyBloksToJson';

export async function filterStoriesBeforeMongoPush(allStories) {
  if (!allStories || !allStories?.length) {
    return console.log(
      'filterStoriesBeforeMongoPush| allStories parameter missing!',
    );
  }

  const searchPages = [];
  const deleteArray = [
    'siteconfig',
    'sitemap',
    'danke',
    'job-alert',
    'thank',
    'search',
    'zoeken',
    'id',
    'vacancies/KS',
  ];
  //filter out siteConfig (header + footer+Dict), from story array

  const filteredStories = allStories?.filter(function (story, i) {
    //story = name,slug,full_slug,
    //if thing.name.toLowerCase = siteconfig or...
    const name = story?.name?.toLowerCase();
    const slug = story?.slug?.toLowerCase();
    const isDetailPage = name === 'vacancyid' ? true : false;

    //check if slug starts with any deleted things
    const startsWith = deleteArray.some((del) => slug?.startsWith(del));

    const toDelete =
      isDetailPage ||
      startsWith ||
      deleteArray?.includes(slug) ||
      deleteArray?.includes(name);
    return !toDelete;
  });

  filteredStories &&
    filteredStories?.forEach(function (story, i) {
      const bloksArr = story?.content?.body;
      const processedBloks = storyBloksToJson(
        bloksArr,
        story?.metaDescription,
        story?.pageTitle,
      );
      const pageData = {
        id: story?.id,
        uuid: story?.uuid,
        pageName: story?.pageName || story?.name || '',
        content: processedBloks || '',
        slug: story?.slug,
        fullSlug: story?.full_slug,
        defaultFullSlug: story?.default_full_slug,
        alternateSlugs: story?.alternates,
        translatedSlugs: story?.translated_slugs,
      };
      searchPages.push(pageData);
    });

  if (searchPages.length > 0) {
    await updatePagesCollection({
      recordArray: searchPages,
      database: process.env.MONGO_DATABASE_NAME,
      collectionName: 'pages',
    });
  }
}
