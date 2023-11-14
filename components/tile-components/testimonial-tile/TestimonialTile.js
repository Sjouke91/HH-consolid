import { renderRichText, storyblokEditable } from '@storyblok/react/rsc';
import Image from 'next/image';

export default function TestimonialTile({ blok }) {
  const {
    title,
    subtitle,
    bodyText,
    button,
    rating,
    image,
    testimonialAuthorDescription,
    testimonialAuthorName,
  } = blok;

  const parsedBodyText = renderRichText(bodyText);

  return (
    <div
      className="c-testimonial-tile__tile-wrapper tile-wrapper"
      {...storyblokEditable(blok)}
    >
      <div className="c-testimonial-tile__text-container">
        <div className="c-testimonial-tile__left-quotation-container"></div>
        {rating ? (
          <div className="c-testimonial-tile__rating">
            <div
              className="c-testimonial-tile__stars"
              style={{ width: 74 * (rating / 5) }}
            />
          </div>
        ) : null}

        <h3 className="c-testimonial-tile__title">{title}</h3>
        {parsedBodyText ? (
          <div
            className="c-testimonial-tile__body-text"
            dangerouslySetInnerHTML={{ __html: parsedBodyText }}
          />
        ) : null}
      </div>
      <div className="c-testimonial-tile__right-quotation-container"></div>
      <div className="c-testimonial-tile__author-container">
        <div className="c-testimonial-tile__image-wrapper">
          {image?.filename ? (
            <Image
              className="c-testimonial-tile__image"
              src={image.filename}
              alt={image.alt ?? ''}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%' }}
            />
          ) : null}
        </div>
        <div className="c-testimonial-tile__author-description-container">
          {testimonialAuthorName ? (
            <div className="c-testimonial-tile__author-name">
              {testimonialAuthorName}
            </div>
          ) : null}
          {testimonialAuthorDescription ? (
            <div className="c-testimonial-tile__author-description">
              {testimonialAuthorDescription}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
