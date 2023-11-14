import { filterStoriesBeforeMongoPush } from '@/lib/mongo-search-utils/filterPagesBeforeMongoPush';
import { storyBloksToJson } from '@/lib/mongo-search-utils/storyBloksToJson';
import { getStoriesToStoreInMongo } from '@/lib/storyblok-getters';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  const searchParams = request?.nextUrl?.searchParams;

  const tag = searchParams.get('tag');
  const path = searchParams.get('path');
  const secret = searchParams.get('secret');
  console.info({ tag, path, secret });

  // Check for secret to confirm this is a valid request
  if (secret !== process.env.ON_DEMAND_ISR_TOKEN) {
    new Response(
      JSON.stringify({
        status: '422',
        message: 'Invalid token',
      }),
      {
        status: 422,
      },
    );
  }

  try {
    if (tag) {
      console.info('revalidating ', tag);
      revalidateTag(tag);
    }
    if (path) {
      console.info('revalidating path', path);
      revalidatePath(path);
    }
    //update pages collection (to keep search results up to date)
    const allStories = await getStoriesToStoreInMongo();
    allStories && (await filterStoriesBeforeMongoPush(allStories));

    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'something went right',
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Something went wrong',
      }),
      {
        status: 422,
      },
    );
  }
}
