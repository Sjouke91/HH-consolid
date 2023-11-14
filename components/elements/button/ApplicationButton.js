'use client';
import { storyblokEditable } from '@storyblok/react/rsc';
import Link from 'next/link';
import React from 'react';
import rewriteSlug from 'utils/rewriteSlug';

export default function ApplicationButton({ blok, className = '', href = '' }) {
  return (
    <Link
      {...storyblokEditable(blok)}
      className={`${className} ${blok.type} show-as-button`}
      // href={blok.linkedpage.cached_url}
      href={`${rewriteSlug(href)}`}
      legacyBehavior
    >
      <a className={`${className} ${blok.type} show-as-button`}>
        {blok.buttonText}
      </a>
    </Link>
  );
}
// <<<<<<< HEAD

/* =======
    <Link {...storyblokEditable(blok)} href={blok.linkedPage.cached_url}>
>>>>>>> main */
