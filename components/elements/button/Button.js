'use client';
import Link from 'next/link';
import { storyblokEditable } from '@storyblok/react/rsc';
import rewriteSlug from 'utils/rewriteSlug';

export default function Button({ blok, className = '', href }) {
  const isExternal = blok?.linkedPage?.linktype === 'url';
  const storyLink =
    blok?.linkedPage?.story?.full_slug ?? blok?.linkedPage?.cached_url;

  return (
    <Link
      {...storyblokEditable(blok)}
      className={`${className} show-as-button ${blok.type ? blok.type : ''} ${
        blok.color ? blok.color : ''
      }`}
      href={
        href
          ? `${rewriteSlug(href)}`
          : `${isExternal ? storyLink : rewriteSlug(storyLink)}`
      }
      legacyBehavior
    >
      <a
        target={isExternal ? '_blank' : '_self'}
        className={`${className} show-as-button ${blok.type ? blok.type : ''} ${
          blok.color ? blok.color : ''
        }`}
      >
        {blok.buttonText}
      </a>
    </Link>
  );
}
