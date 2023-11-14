import TagRenderer from '@/components/stand-alone-components/home-page-hero/tag-renderer/TagRenderer';
import {
  renderRichText,
  StoryblokComponent,
  storyblokEditable,
} from '@storyblok/react/rsc';

export default function ParagraphTile({ blok, isLeft }) {
  const { title, subtitle, textAlignment, bodyText, button, titleTags } = blok;
  const parsedBodyText = renderRichText(bodyText);

  return (
    <div
      {...storyblokEditable(blok)}
      className={`c-paragraph-tile__tile-wrapper tile-wrapper ${
        isLeft ? 'left' : 'right'
      }`}
    >
      <div className={`c-paragraph-tile__text-container ${textAlignment}`}>
        {subtitle ? (
          <h5 className="c-paragraph-tile__subtitle subtitle">{subtitle}</h5>
        ) : null}
        <div className="c-paragraph-tile__title-wrapper">
          {title ? <h2 className="c-paragraph-tile__title">{title}</h2> : null}
          <TagRenderer tags={titleTags} isTitle={true} className="c-paragraph-tile__tags"/>
        </div>
        {parsedBodyText ? (
          <div
            className="c-paragraph-tile__body-text"
            dangerouslySetInnerHTML={{ __html: parsedBodyText }}
          />
        ) : null}
        {button?.length ? (
          <div className="c-paragraph-tile__button-container button-container">
            {button.map((nestedBlok) => (
              <StoryblokComponent
                className="c-paragraph-tile__button"
                key={nestedBlok._uid}
                blok={nestedBlok}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
