import { storyblokEditable } from '@storyblok/react/rsc';
import { Fragment } from 'react';
export default function Email({ blok, errors }) {
  return (
    <>
      {errors && errors?.email?.type === 'pattern' ? (
        <p className="c-validator__error-message" {...storyblokEditable(blok)}>
          {blok.errorMessage}
        </p>
      ) : null}
    </>
  );
}
