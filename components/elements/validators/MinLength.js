import { storyblokEditable } from '@storyblok/react/rsc';
import { Fragment } from 'react';
export default function MinLength({ blok, errors }) {
  return (
    <>
      {errors && errors.phone?.type === 'minLength' ? (
        <p className="c-validator__error-message" {...storyblokEditable(blok)}>
          {blok.errorMessage}
        </p>
      ) : null}
    </>
  );
}
