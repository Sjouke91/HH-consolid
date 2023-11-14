import Image from 'next/image';
import { storyblokEditable } from '@storyblok/react';

export default function TeamTile({ blok }) {
  const { image, title, subtitle, email, phone, facebook, linkedin, twitter } =
    blok;

  return (
    <div
      {...storyblokEditable(blok)}
      className="c-team-tile__tile-wrapper tile-wrapper"
    >
      {image?.filename ? (
        <div className="c-team-tile__image-container">
          <Image
            className="c-team-tile__image"
            src={image.filename}
            alt={image.alt ?? ''}
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
      <div className="c-team-tile__text-container">
        <div>
          {title ? <h4 className="c-team-tile__title">{title}</h4> : null}
          {subtitle ? (
            <h5 className="c-team-tile__subtitle">{subtitle}</h5>
          ) : null}
        </div>
        <div>
          {email ? (
            <a
              className="c-team-tile__contact email"
              href={`mailto:${email}`}
              target="_blank"
            >
              {email}
            </a>
          ) : null}
          {phone ? (
            <a
              className="c-team-tile__contact phone"
              href={`tel:${phone}`}
              target="_blank"
            >
              {phone}
            </a>
          ) : null}
        </div>

        <div>
          {facebook || linkedin || twitter ? (
            <div className="c-team-tile__socials-container">
              {facebook ? (
                <a
                  className="c-team-tile__socials facebook"
                  href={facebook}
                  target="_blank"
                />
              ) : null}
              {linkedin ? (
                <a
                  className="c-team-tile__socials linkedin"
                  href={linkedin}
                  target="_blank"
                />
              ) : null}
              {twitter ? (
                <a
                  className="c-team-tile__socials twitter"
                  href={twitter}
                  target="_blank"
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
