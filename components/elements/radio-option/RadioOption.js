import { storyblokEditable } from '@storyblok/react';

export default function RadioOption({ blok, name }) {
  const { id, label } = blok;

  return (
    <div className="c-radio-option__container">
      <input
        {...storyblokEditable(blok)}
        className="c-radio-option"
        type="radio"
        id={id}
        name={name}
        value={name}
      />
      <label className="c-radio-option__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
