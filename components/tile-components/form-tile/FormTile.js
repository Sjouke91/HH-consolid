'use client';
import { StoryblokComponent, storyblokEditable } from '@storyblok/react/rsc';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { renderRichText } from '@storyblok/react';
import FormModal from '@/components/form-modal/FormModal';
import LoadingSpinner from '@/components/loading-spinner/LoadingSpinner';
import pushToDataLayer from '@/lib/gtm/gtm-datalayer-push';

export default function FormTile({ blok, translate }, data) {
  //STORY BLOK DATA
  const {
    title,
    subtitle,
    buttonText,
    fields,
    contactFormDestination,
    contactFormName,
    contactFormType,
    contactFormEmailSubject,
    contactFormEmailBody,
  } = blok;

  //BUSINESS LOGIC
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, set_modalContent] = useState({ title: '', message: '' });

  const onSubmitHandler = async (formData) => {
    const apiRoute = '/api/contact-form';

    let token;
    if (!executeRecaptcha) {
      console.error('invalid/missing recaptcha');
      return;
    } else {
      token = await executeRecaptcha('formBlock');
    }

    const formPayload = {
      formDestinationEmail: contactFormDestination
        ? contactFormDestination
        : '',
      contactEmailSubject: contactFormEmailSubject
        ? contactFormEmailSubject
        : '',
      recaptcha: token,
      form: {
        ...formData,
      },
    };

    try {
      const response = await fetch(apiRoute, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formPayload),
      });

      const data = await response.json();

      if (data && data.status === 'success') {
        // Set modal content for success
        set_modalContent({
          title: translate('formStatusComponent', 'successTitle'),
          message: translate('formStatusComponent', 'successBodyText'),
        });
        setShowModal(true);

        //GTM Datalayer push: contact form
        const dataLayerEvent = {
          event: 'form_submission',
          form_type: 'Contact form',
        };
        pushToDataLayer(dataLayerEvent);
      } else {
        console.error(
          'we expected a success message but got something else',
          data,
        );
        throw new Error('Error submitting form');
      }
    } catch (error) {
      console.error('ERROR: ', error);

      // Set modal content for error
      set_modalContent({
        title: translate('formStatusComponent', 'errorTitle'),
        message: translate('formStatusComponent', 'errorBodyText'),
      });

      setShowModal(true);
      console.error('Error:', error);
    }
  };
  return (
    <div
      className={`c-form-tile__tile-wrapper tile-wrapper`}
      {...storyblokEditable(blok)}
    >
      <div className="c-form-tile__text-container">
        {subtitle ? (
          <h5 className="c-form-tile__subtitle subtitle">{subtitle}</h5>
        ) : null}
        {title ? <h2 className="c-form-tile__title">{title}</h2> : null}
      </div>
      {isSubmitting ? (
        <LoadingSpinner />
      ) : (
        <form
          className="c-form-tile__form-container"
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <fieldset>
            {fields?.length
              ? fields.map((nestedBlok) => (
                  <StoryblokComponent
                    blok={nestedBlok}
                    key={nestedBlok._uid}
                    register={register}
                    errors={errors}
                    translate={translate}
                  />
                ))
              : null}
            <button
              className="c-form-tile__submit-button  show-as-button secondary"
              type="submit"
            >
              {buttonText}
            </button>
          </fieldset>
        </form>
      )}
      {showModal && (
        <FormModal
          title={modalContent.title}
          message={modalContent.message}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
