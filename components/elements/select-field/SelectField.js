import { StoryblokComponent, storyblokEditable } from '@storyblok/react';

export default function SelectField({ blok, register, errors }) {
  const { name, type, placeholder, label, selectOptions, validators } = blok;
  return (
    <div className="c-select-field__container" {...storyblokEditable(blok)}>
      <label className="c-select-field__label" htmlFor={name}>
        {label}
      </label>
      <div className="c-select-field__wrapper">
        <select
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          defaultValue=""
          className="c-select-field__menu"
          {...register(name, {
            required: !!validators?.find(
              (findReq) => findReq.component === 'required',
            ),
          })}
        >
          {placeholder ? (
            <option className="c-select-field__placeholder" value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {selectOptions?.length
            ? selectOptions.map((option) => {
                return (
                  <StoryblokComponent
                    blok={option}
                    key={option?._uid}
                    errors={errors}
                  />
                );
              })
            : null}
        </select>
      </div>
    </div>
  );
}
