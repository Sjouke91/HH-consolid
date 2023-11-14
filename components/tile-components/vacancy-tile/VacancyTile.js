import Image from 'next/image';
import {
  renderRichText,
  StoryblokComponent,
  storyblokEditable,
} from '@storyblok/react';

export default function VacancyTile({ blok }) {
  const { title, subtitle, bodyText, image, button } = blok;

  const parsedBodyText = renderRichText(bodyText);

  return (
    <div
      className="c-vacancy-tile__tile-wrapper tile-wrapper"
      {...storyblokEditable(blok)}
    >
      {image?.filename ? (
        <div className="c-vacancy-tile__image-container">
          <Image
            className="c-vacancy-tile__image"
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
      <div className="c-vacancy-tile__text-container">
        <h3 className="c-vacancy-tile__title">{title}</h3>
        {parsedBodyText ? (
          <div
            className="c-vacancy-tile__body-text"
            dangerouslySetInnerHTML={{ __html: parsedBodyText }}
          />
        ) : null}
        <div className="c-vacancy-tile__button-container">
          {button?.length
            ? button.map((nestedBlok) => (
                <StoryblokComponent
                  className="c-vacancy-tile__button"
                  key={nestedBlok._uid}
                  blok={nestedBlok}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
