'use client';
import TagRenderer from '@/components/stand-alone-components/home-page-hero/tag-renderer/TagRenderer';
import {
  StoryblokComponent,
  renderRichText,
  storyblokEditable,
} from '@storyblok/react/rsc';
import Image from 'next/image';

export default function HomePageHero({ blok }) {
  const { title, subtitle, bodyText, image, button, tags } = blok;
  const parsedBodyText = renderRichText(bodyText);
  return (
    <section
      {...storyblokEditable(blok)}
      className="c-home-page-hero__outer-wrapper outer-wrapper"
    >
      <div className="c-home-page-hero__inner-wrapper inner-wrapper">
        <div className="c-home-page-hero__text-container">
          <div>
            {subtitle ? (
              <h5 className="c-home-page-hero__subtitle subtitle">
                {subtitle}
              </h5>
            ) : null}
            {title ? (
              <h1 className="c-home-page-hero__title">{title}</h1>
            ) : null}
          </div>
          {parsedBodyText ? (
            <div className="c-home-page-hero__body-content">
              <div
                className="c-home-page-hero__body-text"
                dangerouslySetInnerHTML={{ __html: parsedBodyText }}
              />
              <TagRenderer tags={tags} className="c-home-page-hero__tags" />
            </div>
          ) : null}
          {button?.length ? (
            <div className="c-home-page-hero__button-container button-container">
              {button.map((nestedBlok) => (
                <StoryblokComponent
                  blok={nestedBlok}
                  key={nestedBlok._uid}
                  className="c-home-page-hero__button"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
