import Image from 'next/image';
import {
  renderRichText,
  StoryblokComponent,
  storyblokEditable,
} from '@storyblok/react/rsc';
import { useDimensions } from 'utils/useDimensions';

export default function Paragraph({ blok }) {
  const {
    title,
    subtitle,
    bodyText,
    image,
    button,
    textAlignment,
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
      'c-paragraph__outer-wrapper',
      'outer-wrapper',
      background,
      backgroundImage?.length ? imagePosition : '',
    ].join(' ');
  };

  return (
    <div
      className={getOuterWrapperClass()}
      style={
        imageUrl
          ? {
              backgroundImage: `url(${imageUrl})`,
            }
          : {}
      }
      {...storyblokEditable(blok)}
    >
      <div className="c-paragraph__inner-wrapper inner-wrapper">
        <div className={`c-paragraph__text-container ${textAlignment}`}>
        <div className="c-paragraph__title-container">

          {subtitle ? (
            <h3 className="c-paragraph__subtitle">{subtitle}</h3>
          ) : null}
          {title ? (
              <h2 lang="nl" className="c-paragraph__title">
                {title}
              </h2>
          ) : null}
          </div>

          {image?.filename ? (
            <div className="c-paragraph__image-container">
              <Image
                className="c-paragraph__image"
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
            </div>
          ) : null}
          {parsedBodyText ? (
            <div
              className="c-paragraph__body-text"
              dangerouslySetInnerHTML={{ __html: parsedBodyText }}
            />
          ) : null}
          <div className="c-paragraph__button-container button-container">
            {button?.length
              ? button.map((nestedBlok) => (
                  <StoryblokComponent
                    className="c-paragraph__button"
                    key={nestedBlok._uid}
                    blok={nestedBlok}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
