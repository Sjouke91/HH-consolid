import Image from 'next/image';
import {
  renderRichText,
  StoryblokComponent,
  storyblokEditable,
} from '@storyblok/react/rsc';

export default function GeneralTile({ blok }) {
  const { title, subtitle, bodyText, image, background, button } = blok;
  const parsedBodyText = renderRichText(bodyText);
  return (
    <div
      className={`c-general-tile__tile-wrapper tile-wrapper ${background}`}
      {...storyblokEditable(blok)}
    >
      {image?.filename ? (
        <div className="c-general-tile__image-container">
          <Image
            className="c-general-tile__image"
            src={image.filename}
            alt={image.alt ?? 'testimonial image'}
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: 'auto',
              height: 'auto',
            }}
          />
        </div>
      ) : null}
      {title || subtitle || parsedBodyText || button.length ? (
        <div className="c-general-tile__text-container">
          <div>
            {subtitle ? (
              <h5 className="c-general-tile__subtitle subtitle">{subtitle}</h5>
            ) : null}
            {title ? <h3 className="c-general-tile__title">{title}</h3> : null}
          </div>
          {parsedBodyText ? (
            <div
              className="c-general-tile__body-text"
              dangerouslySetInnerHTML={{ __html: parsedBodyText }}
            />
          ) : null}
          {button?.length ? (
            <div className="button-container">
              {button.map((nestedBlok) => (
                <StoryblokComponent
                  className="c-general-tile__button"
                  key={nestedBlok._uid}
                  blok={nestedBlok}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
