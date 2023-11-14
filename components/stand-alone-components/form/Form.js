'use client';
import { StoryblokComponent, storyblokEditable } from '@storyblok/react/rsc';
import React, { useState } from 'react';
import FormModal from '@/components/form-modal/FormModal';
import { useForm } from 'react-hook-form';
import getConfig from 'next/config';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { renderRichText } from '@storyblok/react';

export default function Form({ blok }, data) {
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
    bodyText,
    translate,
  } = blok;

  //BUSINESS LOGIC
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();

  const agencyId = null;

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, set_modalContent] = useState({ title: '', message: '' });

  //formData (field values) passed by useForm hook's handleSubmit function
  function onSubmitHandler(formData) {
    onSubmit(formData, contactFormType, contactFormDestination, agencyId);
  }

  const onSubmit = async (formData, formType, destination, agencyId) => {
    const apiRoute = '/api/post-contact-form';

    let token;
    if (!executeRecaptcha) {
      console.error('invalid/missing recaptcha');
      return;
    } else {
      token = await executeRecaptcha('formBlock');
    }

    let GTMFormObject;
    try {
      GTMFormObject = { type: formType };
    } catch (error) {
      console.error('GTMFormObject missing');
    }

    let googleCID;
    try {
      googleCID =
        window && window.ga && window.ga.getAll()
          ? window.ga.getAll()[0].get('clientId')
          : false;
    } catch (error) {
      console.error('googleCID missing');
    }

    let anonymousId;
    try {
      anonymousId = process.env.SEGMENT_KEY
        ? await analytics.user().anonymousId()
        : '';
    } catch (error) {
      console.error('anonymousId missing');
    }

    const data = {
      formType,
      contactFormName,
      contactFormType,
      formDestinationEmail: contactFormDestination
        ? contactFormDestination
        : '',
      contactEmailBody: contactFormEmailBody
        ? renderRichText(contactFormEmailBody?.json)
        : '',
      contactEmailSubject: contactFormEmailSubject
        ? contactFormEmailSubject
        : '',
      googleCID,
      deviceId: window.deviceId,
      formUrl: window.location.href,
      anonymousId: anonymousId,
      recaptcha: token,
      form: {
        ...formDataWithId,
        agency: agencyId,
      },
    };
    await fetch(apiRoute, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data && data.status === 'success') {
          // Set modal content for success
          set_modalContent({
            title: translate('applicationForm', 'successTitle'),
            message: translate('applicationForm', 'successBodyText'),
          });
          setShowModal(true);

          //GTM Datalayer push: contact form
          const dataLayerEvent = {
            event: 'form_submission',
            form_type: 'Contact form',
          };
          pushToDataLayer(dataLayerEvent);
        } else {
          console.error('error: ', data.status);
        }
      })
      .catch((error) => {
        // Set modal content for error
        set_modalContent({
          title: translate('applicationForm', 'errorTitle'),
          message: translate('applicationForm', 'errorBodyText'),
        });
        setShowModal(true);
      });
    // }
  };

  return (
    <div
      className={`c-form__outer-wrapper outer-wrapper `}
      {...storyblokEditable(blok)}
    >
      {isSubmitting ? (
        <LoadingSpinner />
      ) : (
        <div className="c-form__inner-wrapper inner-wrapper">
          <div className="c-form__text-container text-container">
            {subtitle ? (
              <h5 className="c-form__subtitle subtitle">{subtitle}</h5>
            ) : null}
            {title ? <h2 className="c-form__title">{title}</h2> : null}
          </div>
          <form
            className="c-form__form-container"
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
                className="c-form__submit-button  show-as-button primary"
                type="submit"
              >
                {buttonText}
              </button>
            </fieldset>
          </form>
          {showModal && (
            <FormModal
              title={modalContent.title}
              message={modalContent.message}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}
