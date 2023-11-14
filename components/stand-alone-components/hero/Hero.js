'use client';
import {
  StoryblokComponent,
  renderRichText,
  storyblokEditable,
} from '@storyblok/react/rsc';
import Image from 'next/image';
import { useDimensions } from 'utils/useDimensions';

export default function Hero({ blok }) {
  const {
    title,
    subtitle,
    bodyText,
    image,
    button,
    backgroundColor,
    backgroundImage,
  } = blok;

  const parsedBodyText = renderRichText(bodyText);
  const { isMobile, isTablet, isDesktop } = useDimensions();
  const background = backgroundColor?.[0]?.backgroundColor ?? '';
  const imagePosition = `alignment-${backgroundImage?.[0]?.imagePosition}`;

  let imageUrl;
  if (isMobile) imageUrl = backgroundImage?.[0]?.imageMobile.filename;
  if (isTablet) imageUrl = backgroundImage?.[0]?.imageTablet.filename;
  if (isDesktop) imageUrl = backgroundImage?.[0]?.imageDesktop.filename;

  const getOuterWrapperClass = () => {
    return [
      'c-hero__outer-wrapper',
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
      <div className="c-hero__inner-wrapper inner-wrapper">
        <div className="c-hero__text-container">
          <div>
            {subtitle ? <h5 className="c-hero__subtitle">{subtitle}</h5> : null}
            {title ? <h1 className="c-hero__title">{title}</h1> : null}
          </div>
          {parsedBodyText ? (
            <div
              className="c-hero__body-text"
              dangerouslySetInnerHTML={{ __html: parsedBodyText }}
            />
          ) : null}
          {button?.length ? (
            <div className="c-hero__button-container button-container">
              {button.map((nestedBlok) => (
                <StoryblokComponent
                  blok={nestedBlok}
                  key={nestedBlok._uid}
                  className="c-hero__button"
                />
              ))}
            </div>
          ) : null}
        </div>
        {image.filename ? (
          <div className="c-hero__image-container">
            <Image
              className="c-hero__image image"
              width={0}
              height={0}
              src={image.filename}
              alt={image.alt ? image.alt : 'hero image'}
              sizes="100vw"
              style={{
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
