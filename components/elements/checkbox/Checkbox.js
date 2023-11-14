import { useState } from 'react';
import { StoryblokComponent, renderRichText } from '@storyblok/react';

export default function Checkbox({ blok, register, errors }) {
  const { id, name, label, labelWithLink, validators, isFullWidth } = blok;

  const [checked, set_checked] = useState(false);
  const toggleChecked = () => set_checked((prev) => !prev);

  // render either label with link or without or when no label empty string
  const parsedBodyText = renderRichText(labelWithLink) ?? <p>{label ?? ''}</p>;

  // register hook onto input - returns data such as the hook's onchange, ref etc
  const registerWrapper = () => {
    let registered;

    if (name) {
      const required = !!validators?.find(
        (findReq) => findReq.component === 'required',
      );

      registered = register(name, { required });
    }
    return registered;
  };

  // get the data hook functions and data
  const checkField = registerWrapper();

  return (
    <div
      className={`c-checkbox__container checkbox ${
        isFullWidth ? '--full-width-input' : ''
      }`}
    >
      <label className="c-checkbox__label" htmlFor={id}>
        {label}
      </label>
      <div className="c-checkbox__policy-container">
        <input
          className="c-checkbox__input"
          type="checkbox"
          id={id}
          name={name}
          {...checkField}
          onChange={(e) => {
            toggleChecked();
            // call the hooks handler
            checkField.onChange(e);
          }}
        />
        <label
          className={`c-checkbox__policy ${
            !checked && errors?.privacy ? 'unchecked' : ''
          }`}
          htmlFor={id}
          dangerouslySetInnerHTML={{ __html: parsedBodyText }}
        ></label>
      </div>
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
