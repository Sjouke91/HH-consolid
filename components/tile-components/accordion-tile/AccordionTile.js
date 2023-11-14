'use client';
import { useState } from 'react';
import {
  renderRichText,
  StoryblokComponent,
  storyblokEditable,
} from '@storyblok/react/rsc';

export default function AccordionTile({ blok }) {
  const { title, bodyText, button } = blok;
  const parsedBodyText = renderRichText(bodyText);
  const [showBody, set_showBody] = useState(false);

  return (
    <div
      {...storyblokEditable(blok)}
      className="c-accordion-tile__tile-wrapper tile-wrapper"
      onClick={() => set_showBody((prev) => !prev)}
    >
      <div className="c-accordion-tile__text-container">
        <h3
          className={`c-accordion-tile__title ${showBody ? 'show-body' : ''}`}
        >
          {title}
        </h3>
        {parsedBodyText && showBody ? (
          <div
            className="c-accordion-tile__body-text"
            dangerouslySetInnerHTML={{ __html: parsedBodyText }}
          />
        ) : null}
        <div className="c-accordion-tile__button-container button-container">
          {button?.length
            ? button.map((nestedBlok) => (
                <StoryblokComponent
                  className="c-accordion-tile__button"
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
