import { storyblokEditable } from '@storyblok/react/rsc';
import { Fragment } from 'react';
export default function Tel({ blok, errors }) {
  return (
    <p className="c-validator__error-message" {...storyblokEditable(blok)}>
      {errors && errors?.phone?.type === 'pattern' ? blok.errorMessage : null}
    </p>
  );
}
