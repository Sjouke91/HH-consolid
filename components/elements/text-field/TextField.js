'use client';
import { StoryblokComponent, storyblokEditable } from '@storyblok/react';

export default function FormInput({ blok, register, errors, translate }) {
  const { name, type, placeholder, label, validators, isFullWidth } = blok;
  // conditionally calls the register function - causes error if no name entered
  function registerWrapper() {
    let registered;
    if (name) {
      registered = register(name, {
        required:
          validators &&
          validators?.find((findReq) => findReq.component === 'required')
            ? true
            : false,
        pattern:
          (type === 'email' &&
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ||
          (type === 'tel' &&
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im),
        maxLength:
          type === 'tel' &&
          validators?.find((findMax) => findMax.maxLength)?.maxLength,
        minLength:
          type === 'tel' &&
          validators?.find((findMin) => findMin.minLength)?.minLength,
      });
    }
    return registered;
  }

  // useFormFieldData
  const field = registerWrapper();
  const errorClass = errors ? errors[name] : null;
  return (
    <div
      className={`c-text-field__container ${
        isFullWidth ? '--full-width-input' : ''
      }`}
      {...storyblokEditable(blok)}
    >
      <label className={``} htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        step="0.01"
        placeholder={placeholder}
        data-lpignore="true"
        {...field}
        className={`${errorClass ? 'error' : ''}`}
      />
      {validators?.length
        ? validators?.map((nestedBlok) => (
            <StoryblokComponent
              blok={nestedBlok}
              key={nestedBlok._uid}
              errors={errors}
              inputName={name}
            />
          ))
        : null}
    </div>
  );
}
