import {
  renderRichText,
  StoryblokComponent,
  storyblokEditable,
} from '@storyblok/react/rsc';
import Image from 'next/image';

export default function ImageTile({ blok }) {
  const { image = '', title, subtitle, bodyText, button } = blok;
  const parsedBodyText = renderRichText(bodyText);

  const isVideo =
    /\.(mp4|avi|wmv|mov|flv|mkv|webm|vob|ogv|m4v|3gp|3g2|mpeg|mpg|m2v|m4v|svi|3gpp|3gpp2|mxf|roq|nsv|flv|f4v|f4p|f4a|f4b)$/.test(
      image.filename,
    );

  return (
    <div
      className="c-image-tile__tile-wrapper tile-wrapper"
      {...storyblokEditable(blok)}
    >
      <div className="c-image-tile__image-container">
        {isVideo ? (
          <video
            className={`c-image-tile__video`}
            // Note(Fran): we skip ahead to load the first frame,
            // otherwise mobile doesn't show anything
            src={image.filename + '#t=0.001'}
            playsInline
            autoPlay
            muted={true}
            loop
            type="video/mp4"
          />
        ) : (
          <Image
            className="c-image-tile__image"
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
        )}
        {title || subtitle || parsedBodyText || button?.length ? (
          <div className="c-image-tile__text-container">
            <div className="c-image-tile__title-container">
              {subtitle ? (
                <h6 className="c-image-tile__subtitle">{subtitle}</h6>
              ) : null}
              {title ? <h3 className="c-image-tile__title">{title}</h3> : null}
            </div>
            {parsedBodyText ? (
              <div
                className="c-image-tile__body-text"
                dangerouslySetInnerHTML={{ __html: parsedBodyText }}
              />
            ) : null}
            {button?.length ? (
              <div className="button-container">
                {button.map((nestedBlok) => (
                  <StoryblokComponent
                    className="c-image-tile__button"
                    key={nestedBlok._uid}
                    blok={nestedBlok}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
