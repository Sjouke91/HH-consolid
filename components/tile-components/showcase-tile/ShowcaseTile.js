import {
  renderRichText,
  StoryblokComponent,
  storyblokEditable,
} from '@storyblok/react/rsc';
import Image from 'next/image';
import Link from 'next/link';

export default function ShowcaseTile({ blok }) {
  const { image = '', title } = blok;
  return (
    <div
      className="c-showcase-tile__tile-wrapper tile-wrapper"
      {...storyblokEditable(blok)}
    >
      <LinkWrapper>
        <div className="c-showcase-tile__image-container">
          <Image
            className="c-showcase-tile__image"
            src={image.filename}
            alt={image.alt ?? ''}
            width={0}
            height={0}
            sizes="100%"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>
      </LinkWrapper>
    </div>
  );
}

function LinkWrapper({ className, href, children }) {
  if (href)
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  else return children;
}
