import Image from 'next/image';
import Link from 'next/link';
import { storyblokEditable } from '@storyblok/react/rsc';
import rewriteSlug from 'utils/rewriteSlug';

export default function CategoryTile({ blok, jobCounts }) {
  const { title, image, categoryName, showVacancyCount, linkedPage } = blok;

  return (
    <Link
      href={`${rewriteSlug(
        linkedPage?.story?.full_slug ?? linkedPage.cached_url,
      )}`}
      legacyBehavior
    >
      <div
        className="c-category-tile__tile-wrapper tile-wrapper"
        {...storyblokEditable(blok)}
      >
        <div className="c-category-tile__image-wrapper">
          {image?.filename ? (
            <Image
              className="c-category-tile__image"
              src={image.filename}
              alt={image.alt ?? 'testimonial image'}
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          ) : null}
        </div>
        <div className="c-category-tile__content-container">
          <h3 className="c-category-tile__title">{title}</h3>
          {showVacancyCount
            ? jobCounts?.map((job) =>
                job.category === categoryName ? (
                  <div className="c-category-tile__count">{job.count}</div>
                ) : null,
              )
            : null}

          <div className="c-category-tile__arrow" />
        </div>
      </div>
    </Link>
  );
}
