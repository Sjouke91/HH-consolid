import React from 'react';
import { useDimensions } from 'utils/useDimensions';

export default function ArticleHero({
  heroTitle,
  heroSubtitle,
  heroBackgroundImage,
}) {
  // Background settings
  const { isMobile, isTablet, isDesktop } = useDimensions();
  const imagePosition = `alignment-${heroBackgroundImage?.[0]?.imagePosition}`;

  let imageUrl;
  if (isMobile) imageUrl = heroBackgroundImage?.[0]?.imageMobile.filename;
  if (isTablet) imageUrl = heroBackgroundImage?.[0]?.imageTablet.filename;
  if (isDesktop) imageUrl = heroBackgroundImage?.[0]?.imageDesktop.filename;

  return (
    <section
      className={`c-article-hero__outer-wrapper outer-wrapper background secondary alignment-${heroBackgroundImage?.[0]?.imagePosition}`}
      style={
        imageUrl
          ? {
              backgroundImage: `url(${imageUrl})`,
            }
          : {}
      }
    >
      <div className="c-article-hero__inner-wrapper inner-wrapper">
        <div className="c-article-hero__text-container">
          <div>
            {heroTitle ? (
              <h1 className="c-article-hero__title">{heroTitle}</h1>
            ) : null}
            {heroSubtitle ? (
              <p className="c-article-hero__subtitle">{heroSubtitle}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
