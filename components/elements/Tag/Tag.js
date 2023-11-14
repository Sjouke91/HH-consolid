import { storyblokEditable } from '@storyblok/js';

export default function Tag({ blok, isTitle }) {
  const { tagName } = blok;

  return (
    <span
      {...storyblokEditable(blok)}
      className={`c-tag__item ${isTitle ? 'title' : ''}`}
    >
      {tagName}
    </span>
  );
}
