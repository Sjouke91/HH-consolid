import { useState } from 'react';
import { StoryblokComponent, storyblokEditable } from '@storyblok/react';

// todo file validations
export default function FileInput({
  blok,
  register,
  errors,
  control,
  Controller,
  translate,
}) {
  const { name, placeholder, label, validators, isFullWidth } = blok;
  const type = 'file';
  const [filename, set_filename] = useState('');
  const [extension, set_extension] = useState('');

  //function for conditionally calling the register function - causes error if no name entered
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
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    const fileType = file.type;
    const extension = fileType?.slice(fileType?.indexOf('/') + 1);
    set_extension(extension);
    set_filename(file.name);
  }

  //useFormFieldData
  const fieldWrapper = registerWrapper();

  return (
    <div
      className={`c-file-field__container ${
        isFullWidth ? '--full-width-input' : ''
      }`}
      {...storyblokEditable(blok)}
    >
      <label className="" htmlFor={name}>
        {label}
      </label>

      <label className={`file`} htmlFor={name}>
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, ...field } }) => {
          return (
            <input
              type={type}
              id={name}
              name={name}
              placeholder={placeholder}
              {...field}
              value={value?.fileName}
              onChange={(event) => {
                handleFileChange(event);
                onChange(event.target.files[0]);
              }}
            />
          );
        }}
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
      <span className={`c-file-field__file_notice `}>
        {filename
          ? `${filename.substring(0, 5)}...(.${extension})`
          : translate('applicationForm', 'noFileFound')}
      </span>
    </div>
  );
}
