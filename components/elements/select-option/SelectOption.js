import { storyblokEditable } from '@storyblok/react';

export default function SelectOption({ blok }) {
  const { optionName, optionValue } = blok;

  return (
    <option
      {...storyblokEditable(blok)}
      className="c-select-options"
      value={optionValue}
    >
      {optionName}
    </option>
  );
}
