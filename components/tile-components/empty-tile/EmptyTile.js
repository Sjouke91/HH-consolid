import { storyblokEditable } from '@storyblok/react/rsc';

export default function EmptyTile({ blok }) {
  return (
    <div
      className="c-empty-tile__tile-wrapper tile-wrapper"
      {...storyblokEditable(blok)}
    ></div>
  );
}
