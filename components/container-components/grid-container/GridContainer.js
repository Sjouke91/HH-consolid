import { storyblokEditable, StoryblokComponent } from '@storyblok/react/rsc';
import { useDimensions } from 'utils/useDimensions';

export default function GridContainer({ blok, jobCounts, translate }) {
  const {
    title,
    subtitle,
    tiles,
    cta,
    amountOfColumns,
    backgroundImage,
    backgroundColor,
  } = blok;

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
      'c-grid-container__outer-wrapper',
      'outer-wrapper',
      background,
      backgroundImage?.length ? imagePosition : '',
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
      <div className="c-grid-container__inner-wrapper inner-wrapper">
        {subtitle || title ? (
          <div className="c-grid-container__title-container title-container">
            {subtitle ? (
              <h5 className="c-grid-container__subtitle subtitle">
                {subtitle}
              </h5>
            ) : null}
            {title ? (
              <h2 className="c-grid-container__title">{title}</h2>
            ) : null}
          </div>
        ) : null}
        <div className={`c-grid-container__tile-container ${amountOfColumns}`}>
          {tiles.map((nestedBlok) => (
            <StoryblokComponent
              blok={nestedBlok}
              jobCounts={jobCounts}
              key={nestedBlok._uid}
              translate={translate}
            />
          ))}
        </div>
        {cta?.length ? (
          <div className="c-grid-container__button-container button-container">
            {cta.map((nestedBlok) => (
              <StoryblokComponent
                blok={nestedBlok}
                key={nestedBlok._uid}
                className="c-hero__button"
                translate={translate}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
