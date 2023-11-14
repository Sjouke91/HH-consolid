'use client';
import Form from '../form/Form';
import SearchBlockSchema from './SearchBlock.schema';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import rewriteSlug from 'utils/rewriteSlug';
import { getLocalisationObject } from 'config';

export default function SearchBlockComponent({
  blok,
  currentLocale,
  closeHeaderSearchOverlay,
  closeMobileMenu,
}) {
  //storyblok data
  const {
    title,
    inputFields,
    button,
    background,
    subtitle,
    bodyText,
    searchTarget,
    isHeaderSearch,
    searchButtonColour,
  } = blok;

  const localeObj = getLocalisationObject(currentLocale);
  const searchPrefixLocale = localeObj?.searchBlockSearch;

  const router = useRouter();
  //form state
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  function onSubmitHandler(formData) {
    const searchQuery = buildSearchQuery(formData);
    if (isHeaderSearch) {
      closeHeaderSearchOverlay();
      closeMobileMenu();
    }
    router.push(rewriteSlug(searchQuery));
  }
  //Builds search query from formData
  function buildSearchQuery(formData) {
    if (!formData || !Object.values(formData)?.length) return;
    const queryArray = [];
    //loop through formData object keys and check if properties have values
    //build final query from key-value strings
    for (const pair in formData) {
      if (formData?.[pair]) {
        const lowercaseProperty = pair?.toLowerCase();
        const lowercaseValue = formData?.[pair]?.toLowerCase();
        queryArray.push(`${lowercaseProperty}=${lowercaseValue}`);
      }
    }
    searchTarget && queryArray?.push(`searchTarget=${searchTarget}`);
    const searchQuery = `/${searchPrefixLocale}?${queryArray.join('&')}`;
    return searchQuery;
  }
  const schemaData = {
    title,
    inputFields,
    blok,
    onSubmitHandler,
    handleSubmit,
    register,
    button,
    background,
    subtitle,
    bodyText,
    searchButtonColour,
  };

  return <SearchBlockSchema data={schemaData} />;
}
