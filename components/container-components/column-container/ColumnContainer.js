import { storyblokEditable, StoryblokComponent } from '@storyblok/react';
import { useDimensions } from 'utils/useDimensions';

export default function ColumnContainer({ blok, jobCounts, translate }) {
  const {
    title,
    subtitle,
    tiles,
    button,
    proportion,
    backgroundImage,
    backgroundColor,
    padding_top,
    padding_bottom,
  } = blok;

  const { isMobile, isTablet, isDesktop } = useDimensions();
  const background = backgroundColor?.[0]?.backgroundColor ?? '';
  const imagePosition = `alignment-${backgroundImage?.[0]?.imagePosition}`;

  let imageUrl;
  if (isMobile) imageUrl = backgroundImage?.[0]?.imageMobile.filename;
  if (isTablet) imageUrl = backgroundImage?.[0]?.imageTablet.filename;
  if (isDesktop) imageUrl = backgroundImage?.[0]?.imageDesktop.filename;

  const getOuterWrapperClass = () => {
    return [
      'c-column-container__outer-wrapper',
      'outer-wrapper',
      background,
      backgroundImage?.length ? imagePosition : '',
      padding_top ? 'padding-top' : '',
      padding_bottom ? 'padding-bottom' : '',
    ].join(' ');
  };

  return (
    <section
      {...storyblokEditable(blok)}
      className={getOuterWrapperClass()}
      style={
        imageUrl
          ? {
              backgroundImage: `url(${imageUrl})`,
            }
          : {}
      }
    >
      <div className="c-column-container__inner-wrapper inner-wrapper">
        <div className="c-column-container__title-container title-container">
          {subtitle ? (
            <h5 className="c-column-container__subtitle subtitle">
              {subtitle}
            </h5>
          ) : null}
          {title ? <h2 className="c-grid-container__title">{title}</h2> : null}
        </div>
        <div className={`c-column-container__tile-container p${proportion}`}>
          {tiles.map((nestedBlok, index) => (
            <StoryblokComponent
              blok={nestedBlok}
              isLeft={index === 0}
              jobCounts={jobCounts}
              key={nestedBlok._uid}
              translate={translate}
            />
          ))}
        </div>
        <div className="c-column-container__button-container button-container">
          {button?.length
            ? button.map((nestedBlok) => (
                <StoryblokComponent
                  blok={nestedBlok}
                  key={nestedBlok._uid}
                  className="c-hero__button"
                  translate={translate}
                />
              ))
            : null}
        </div>
      </div>
    </section>
  );
}
