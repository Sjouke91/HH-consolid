'use client';
import Image from 'next/image';
import Link from 'next/link';

export function ArticleSlide({ article, articlePage }) {
  const {
    content: {
      heroTitle: list_heroTitle,
      heroSubtitle,
      image,
      excerpt,
      tags,
      author,
      _uid,
    },
    uuid: list_id,
    slug,
  } = article;

  // Background settings
  const href = articlePage ? slug : `/blog/${slug}`;

  if (articlePage === list_heroTitle) return;

  return (
    <Link key={list_id} href={href} className="c-article-card__container ">
      {image.filename ? (
        <Image
          className="c-article-card__image"
          src={image.filename}
          alt={image.alt ?? ''}
          width={0}
          height={0}
          sizes="100%"
          style={{
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      ) : null}
      <div className="c-article-card__text-container">
        {author ? <p className="c-article-card__author">{author}</p> : null}
        {list_heroTitle ? (
          <h4 className="c-article-card__title">{list_heroTitle}</h4>
        ) : null}
        {excerpt ? <p className="c-article-card__excerpt">{excerpt}</p> : null}
        <p className="c-article-card__link show-as-button link">
          {/* TODO: add to translate */}
          Lees meer
        </p>
      </div>
    </Link>
  );
}
