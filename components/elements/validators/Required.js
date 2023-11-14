import { storyblokEditable } from '@storyblok/react';
import { Fragment } from 'react';
export default function Required({ blok, errors, inputName }) {
  return (
    <>
      {errors && errors?.[inputName]?.type === 'required' ? (
        <p className="c-validator__error-message" {...storyblokEditable(blok)}>
          {blok.errorMessage}
        </p>
      ) : null}
    </>
  );
}
