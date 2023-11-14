import { storyblokEditable } from '@storyblok/react/rsc';
import { Fragment } from 'react';
export default function MaxLength({ blok, errors }) {
  return (
    <>
      {errors && errors.phone?.type === 'maxLength' ? (
        <p className="c-validator__error-message" {...storyblokEditable(blok)}>
          {blok.errorMessage}
        </p>
      ) : null}
    </>
  );
}
