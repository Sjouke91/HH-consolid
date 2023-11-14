import {
  storyblokEditable,
  renderRichText,
  StoryblokComponent,
} from '@storyblok/react/rsc';
import { useDimensions } from 'utils/useDimensions';

export default function ListContainer({ blok, jobCounts, translate }) {
  const {
    title,
    subtitle,
    bodyText,
    tiles,
    button,
    backgroundImage,
    backgroundColor,
  } = blok;
  const parsedBodyText = renderRichText(bodyText);

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
      'c-list-container__outer-wrapper',
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
      <div className="c-list-container__inner-wrapper inner-wrapper">
        {subtitle || title ? (
          <div className="c-list-container__title-container title-container">
            {subtitle ? (
              <h5 className="c-list-container__subtitle subtitle">
                {subtitle}
              </h5>
            ) : null}
            {title ? (
              <h2 className="c-list-container__title">{title}</h2>
            ) : null}
          </div>
        ) : null}
        {parsedBodyText ? (
          <div
            className="c-list-container__body-text"
            dangerouslySetInnerHTML={{ __html: parsedBodyText }}
          />
        ) : null}
        <div className={`c-list-container__tile-container`}>
          {tiles?.map((nestedBlok) => (
            <StoryblokComponent
              blok={nestedBlok}
              jobCounts={jobCounts}
              key={nestedBlok._uid}
              translate={translate}
            />
          )) ?? null}
        </div>
        {button?.length ? (
          <div className="c-list-container__button-container button-container">
            {button.map((nestedBlok) => (
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
