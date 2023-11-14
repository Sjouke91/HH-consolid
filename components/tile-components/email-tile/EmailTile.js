// import Image from 'next/image';

import { StoryblokComponent, storyblokEditable } from '@storyblok/react/rsc';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '@/components/loading-spinner/LoadingSpinner';
import pushToDataLayer from '@/lib/gtm/gtm-datalayer-push';
import FormModal from '@/components/form-modal/FormModal';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function EmailBlock({ blok, translate, jobData }) {
  const { title, subtitle, buttonText, fields } = blok;
  const { executeRecaptcha } = useGoogleReCaptcha();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, set_modalContent] = useState({ title: '', message: '' });

  const onSubmitHandler = async (formData) => {
    const apiRoute = '/api/share-vacancy-form';

    let token;
    if (!executeRecaptcha) {
      console.error('invalid/missing recaptcha');
      return;
    } else {
      token = await executeRecaptcha('formBlock');
    }

    const formPayload = {
      jobData: jobData,
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
      className={'c-email-block__outer-wrapper outer-wrapper'}
      {...storyblokEditable(blok)}
    >
      <div className="c-email-block__inner-wrapper inner-wrapper">
        <div className={'c-email-block__text-container'}>
          <h4 className="c-email-block__title">{title}</h4>
          <p className="c-email-block__subtitle">{subtitle}</p>
        </div>
        {isSubmitting ? (
          <LoadingSpinner />
        ) : (
          <form
            className="c-email-block-form__form-container"
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
                className="c-email-block-form__submit-button  show-as-button secondary"
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
    </div>
  );
}
