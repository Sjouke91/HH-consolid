import { storyblokEditable } from '@storyblok/react/rsc';
export default function Numeric({ blok, errors }) {
  return (
    <>
      {errors && errors.phone?.type === 'pattern' ? (
        <p className="c-validator__error-message" {...storyblokEditable(blok)}>
          {blok.errorMessage}
        </p>
      ) : null}
    </>
  );
}
