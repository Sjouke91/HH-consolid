import { storyblokEditable } from '@storyblok/react/rsc';

export default function Spacer({ blok }) {
  const { title, isFullWidth } = blok;
  return (
    <h4
      className={`c-spacer__title ${isFullWidth ? '--full-width-input' : ''}`}
      {...storyblokEditable(blok)}
    >
      {title ? title : null}
    </h4>
  );
}
