import {
  storyblokEditable,
  StoryblokComponent,
  renderRichText,
} from '@storyblok/react/rsc';
import Image from 'next/image';
import Link from 'next/link';
import ArticleHero from './ArticleHero';

export default function Article({ blok, articleArray }) {
  const {
    heroTitle,
    heroSubtitle,
    heroBackgroundImage,
    bodyText,
    uuid: displayedBlog_id,
    articleContainer,
  } = blok;
  const parsedBodyText = renderRichText(bodyText);
  return (
    <section
      {...storyblokEditable(blok)}
      className="c-article-template__outer-wrapper"
    >
      <ArticleHero
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        heroBackgroundImage={heroBackgroundImage}
      />
      <section className="c-article-paragraph__outer-wrapper outer-wrapper background primary">
        <div className="c-article-paragraph__inner-wrapper inner-wrapper">
          {parsedBodyText ? (
            <div
              className="c-article-paragraph__body-text"
              dangerouslySetInnerHTML={{ __html: parsedBodyText }}
            />
          ) : null}
        </div>
      </section>
      {articleContainer?.length
        ? articleContainer.map((nestedBlok) => (
            <StoryblokComponent
              blok={nestedBlok}
              key={nestedBlok._uid}
              className="c-article-list"
              articleArray={articleArray}
              articlePage={heroTitle}
            />
          ))
        : null}
    </section>
  );
}
