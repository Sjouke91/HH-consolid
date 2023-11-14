'use client';
import { useState } from 'react';
import { storyblokEditable, StoryblokComponent } from '@storyblok/react/rsc';
import { useDimensions } from 'utils/useDimensions';

export default function TabContainer({ blok, translate }) {
  const { title, subtitle, tiles, button, backgroundImage, backgroundColor } =
    blok;

  const [activeIndex, set_activeIndex] = useState(0);

  // Background settings
  const { isMobile, isTablet, isDesktop } = useDimensions();
  const background = backgroundColor?.[0]?.backgroundColor ?? '';
  const imagePosition = `alignment-${backgroundImage?.[0]?.imagePosition}`;

  let imageUrl;
  if (isMobile) imageUrl = backgroundImage?.[0]?.imageMobile.filename;
  if (isTablet) imageUrl = backgroundImage?.[0]?.imageTablet.filename;
  if (isDesktop) imageUrl = backgroundImage?.[0]?.imageDesktop.filename;

  const getOuterWrapperClass = () => {
    return [
      'c-tab-container__outer-wrapper',
      'outer-wrapper',
      background,
      backgroundImage?.length ? imagePosition : '',
    ].join(' ');
  };

  return (
    <section
      {...storyblokEditable(blok)}
      className={getOuterWrapperClass()}
      style={{ ...(imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}) }}
    >
      <div className="c-tab-container__inner-wrapper inner-wrapper">
        {subtitle || title ? (
          <div className="c-tab-container__title-container title-container">
            {subtitle ? (
              <h5 className="c-tab-container__subtitle subtitle">{subtitle}</h5>
            ) : null}
            {title ? <h2 className="c-tab-container__title">{title}</h2> : null}
          </div>
        ) : null}
        {tiles?.length ? (
          <div className={`c-tab-container__tab-container`}>
            {tiles.map((tile, index) => (
              <div
                key={index}
                className={`c-tab-container__tab ${
                  index === activeIndex ? 'active' : ''
                }`}
                onClick={() => set_activeIndex(index)}
              >
                {tile?.title ?? index + 1}
              </div>
            ))}
          </div>
        ) : null}
        {tiles?.length ? (
          <div className={`c-tab-container__tile-container`}>
            {tiles.map((nestedBlok, index) =>
              index === activeIndex ? (
                <StoryblokComponent
                  translate={translate}
                  blok={nestedBlok}
                  key={nestedBlok._uid}
                />
              ) : null,
            )}
          </div>
        ) : null}
        {button?.length ? (
          <div className="c-tab-container__button-container">
            {button.map((nestedBlok) => (
              <StoryblokComponent
                blok={nestedBlok}
                key={nestedBlok._uid}
                className="c-tab-container__button"
                translate={translate}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
