import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import Image from 'next/image';

export default function SearchBlockSchema({ data }) {
  const {
    blok,
    title,
    inputFields,
    handleSubmit,
    register,
    errors,
    onSubmitHandler,
    background,
    searchButtonColour,
    subtitle,
    bodyText,
  } = data;

  return (
    <section
      {...storyblokEditable(blok)}
      className={`c-search-block__outer-wrapper outer-wrapper ${background}`}
    >
      <div className="c-search-block__inner-wrapper inner-wrapper">
        <div className="c-search-block__text-content">
          {subtitle ? (
            <div className="c-search-block__subtitle">
              <h5>{subtitle}</h5>
            </div>
          ) : null}
          {title ? (
            <div className="c-search-block__title">
              <h2>{title}</h2>
            </div>
          ) : null}
          {bodyText ? (
            <div className="c-search-block__body-text">
              <p>{bodyText}</p>
            </div>
          ) : null}
        </div>

        <form
          className="c-search-block__input-form"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <fieldset className="c-search-block__input-fields">
            {inputFields?.length
              ? inputFields.map((nestedBlok) => {
                  return (
                    <StoryblokComponent
                      blok={nestedBlok}
                      key={nestedBlok._uid}
                      register={register}
                      errors={errors}
                    />
                  );
                })
              : null}
            <button
              type="submit"
              className={`c-form__submit-button show-as-button ${searchButtonColour} search-block-button`}
            >
              <Image
                className="c-search-block__btn-icon"
                src={'/circle8-search-button.svg'}
                alt={'search icon'}
                width={15}
                height={15}
                // sizes="100vw"
                // style={{ width: '100%' }}
              />
              {blok.submitButtonText}
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
