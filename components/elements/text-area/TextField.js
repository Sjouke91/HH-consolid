import { StoryblokComponent, storyblokEditable } from '@storyblok/react';

export default function FormTextarea({ blok, register, errors }) {
  const { name, type, placeholder, label, validators, isFullWidth } = blok;

  // function for conditionally calling the register function - causes error if no name entered
  const registerWrapper = () => {
    let registered;

    if (name) {
      registered = register(name, {
        required: !!validators?.find(
          (findReq) => findReq.component === 'required',
        ),
        pattern:
          (type === 'email' && /^[a-z0-9,_%+-]+@[a-z0-9,-]+\.[a-z{2,4}$]/) ||
          (type === 'tel' &&
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,8}$/),
        maxLength:
          type === 'tel' &&
          validators?.find((findMax) => findMax.maxLength).maxLength,
        minLength:
          type === 'tel' &&
          validators?.find((findMin) => findMin.minLength).minLength,
      });
    }
    return registered;
  };

  // useFormFieldData
  const field = registerWrapper();

  return (
    <div
      {...storyblokEditable(blok)}
      className={`c-text-field__container ${
        isFullWidth ? '--full-width-input' : ''
      }`}
    >
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} placeholder={placeholder} {...field} />
      {validators.length
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
