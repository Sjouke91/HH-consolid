import { StoryblokComponent } from '@storyblok/react';
import React from 'react';
import { storyblokEditable } from '@storyblok/react';

export default function RadioInputField({ blok, register, errors }) {
  const { name, label, radioOptions, validators } = blok;
  return (
    <div className="c-radio-field__container" {...storyblokEditable(blok)}>
      <label className="c-radio-field__label">{label}</label>
      <div className="c-radio-field__option-container">
        {radioOptions?.length &&
          radioOptions.map((option) => {
            return (
              <StoryblokComponent
                blok={option}
                key={option?._uid}
                errors={errors}
                name={name}
              />
            );
          })}
      </div>
    </div>
  );
}
