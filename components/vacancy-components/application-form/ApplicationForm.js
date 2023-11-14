import { useEffect, useState } from 'react';
import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import { useForm, Controller } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { transformDataURIToBlob } from '@direct-impact/difj-core';
import FormModal from '@/components/form-modal/FormModal';
import promisifyFileReader from 'utils/promisifyFileReader';
import tryJSON from 'utils/tryJSON';
import formatGtmJobObject from '@/lib/gtm/gtm-create-job-object';
import pushToDataLayer from '@/lib/gtm/gtm-datalayer-push';
import Loading from 'app/[[...urlPath]]/loading';
import readUtm from '@/lib/gtm/gtm-read-utm';

const apiRoute = '/api/application-form';

export default function Application({ blok, jobData, translate }) {
  // todo add success/error form message on submit (same as for Form.js)
  const [showModal, setShowModal] = useState(false);
  const [modalContent, set_modalContent] = useState({
    title: '',
    message: '',
    show: false,
  });

  const [formType, setFormType] = useState('');

  // GTM Datalayer push: Start application
  useEffect(() => {
    const dataLayerEvent = {
      event: 'begin_checkout',
      ecommerce: {
        currency: 'EUR',
        value: 1,
        items: [jobData ? formatGtmJobObject({ jobData: jobData }) : {}],
      },
    };
    pushToDataLayer(dataLayerEvent);
  }, []);

  const formApplicationTypeOptions = [
    {
      name: translate('applicationForm', 'independentProfessional'),
      value: 'independent professional',
      type: 'independentProfessional',
    },
    {
      name: translate('applicationForm', 'expat'),
      value: 'expat',
      type: 'expat',
    },
    {
      name: translate('applicationForm', 'supplier'),
      value: 'supplier',
      type: 'supplier',
    },
  ];

  // filters out type options that do not match the job
  function filterApplicationTypeOptions(optionsArr, jobData) {
    const isExpat = jobData?.expat && 'expat';
    const isSupplier = jobData?.supplier && 'supplier';
    const selfEmployed = jobData?.selfEmployed && 'independent professional';
    const typeArr = [isExpat, isSupplier, selfEmployed];

    const filteredOptions = optionsArr.filter((o) =>
      typeArr.includes(o?.value),
    );

    return filteredOptions;
  }

  // Filtering logic

  const filteredOptions = filterApplicationTypeOptions(
    formApplicationTypeOptions,
    jobData,
  );

  // STORY BLOK DATA
  const {
    title,
    subtitle,
    background,
    buttonText,
    fields,
    supplierFields,
    expatFields,
    type,
  } = blok;

  // FORM LOGIC
  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    control,
  } = useForm({ mode: 'onChange' });

  if (!fields?.length || !supplierFields?.length)
    return <h1>{translate('applicationForm', 'noFieldsFound')}</h1>;

  // form application config, maybe move this to SB
  const [formFields, set_formFields] = useState(getDefaultFormFields());

  function getDefaultFormFields() {
    if (jobData?.selfEmployed) {
      return fields;
    } else if (jobData?.expat) {
      return expatFields;
    } else if (jobData?.supplier) {
      return supplierFields;
    } else {
      return [];
    }
  }

  const selectOnChangeHandler = (formType) => {
    // setFormResponse(null);

    if (formType === 'supplier') {
      // THIS IS HARDCODED INTHE BACKEND> DO NOT TOUCH
      setFormType('supplier');
      return set_formFields(supplierFields);
    } else if (formType === 'independent professional') {
      // THIS IS HARDCODED INTHE BACKEND> DO NOT TOUCH
      setFormType('independentProfessional');
      return set_formFields(fields);
    } else if (formType === 'expat') {
      setFormType('expat');
      return set_formFields(expatFields);
    } else {
      return set_formFields([]);
    }
  };

  // USE CONTEXT/METHODS
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmitHandler = async (data) => {
    const newFormData = new FormData();

    function get_ga_clientid() {
      let cookie = {};
      document.cookie.split(';').forEach(function (el) {
        let splitCookie = el.split('=');
        let key = splitCookie[0].trim();
        let value = splitCookie[1];
        cookie[key] = value;
      });
      return cookie['_ga'].substring(6);
    }

    // Put everything that we can see in the form
    for await (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object') {
        const fileToSendRead = await promisifyFileReader(value);
        if (fileToSendRead) {
          newFormData.set(key, JSON.stringify(fileToSendRead));
        }
      } else {
        newFormData.set(key, value);
      }
    }
    // Add everything we need to pass by hand, enriching the form payload on submit. (hidden to visitor)
    newFormData.set('jobPublicationId', jobData.jobId ? jobData.jobId : null);
    newFormData.set('applicationType', formType);

    /* Marketing specific stuff */
    const googleCID = get_ga_clientid();
    const transactionId = `${Date.now()}-${googleCID}`;
    const utmValues = readUtm();
    newFormData.append('C8_Transaction_Id__c', transactionId);
    newFormData.append('googleCID', googleCID);
    newFormData.append('byner__UTM_Source__c', utmValues?.source || '');
    newFormData.append('byner__UTM_Medium__c', utmValues?.medium || '');
    newFormData.append('byner__UTM_Campaign__c', utmValues?.campaign || '');
    newFormData.append('byner__UTM_Content__c', utmValues?.content || '');
    newFormData.append(
      'byner__UTM_Term__c',
      utmValues?.googleclid
        ? utmValues?.googleclid
        : utmValues?.keyword
        ? utmValues?.keyword
        : '',
    );

    /* Additional job data */
    newFormData.append('jobTitle', jobData.title);
    newFormData.append('jobIndustry', jobData.industry);
    newFormData.append('recruiterName', jobData.recruiter.fullName);
    newFormData.append('recruiterEmail', jobData.recruiter.email);

    /* Add files */
    const cv = newFormData.get('cv');
    if (cv) {
      const newCv = tryJSON(cv);
      if (newCv) {
        newFormData.delete('cv');
        newFormData.set(
          'cv',
          transformDataURIToBlob(newCv.file, newCv.name, newCv.type),
        );
      }
    }
    const coverLetter = newFormData.get('coverLetter');
    if (coverLetter) {
      // Note that we need to send cover-letter instead of coverLetter. We could format better storyblok to match our backend.
      const newCoverLetter = tryJSON(coverLetter);
      if (newCoverLetter) {
        newFormData.delete('coverLetter');
        newFormData.set(
          'cover-letter',
          transformDataURIToBlob(
            newCoverLetter.file,
            newCoverLetter.name,
            newCoverLetter.type,
          ),
        );
      }
    }

    let token;
    if (!executeRecaptcha) {
      console.error('invalid/missing recaptcha');
      return;
    } else {
      token = await executeRecaptcha('formBlock');
    }
    newFormData.append('recaptcha', token);

    try {
      const response = await fetch(apiRoute, {
        method: 'POST',
        body: newFormData,
      });

      const data = await response.json();

      if (data.status === 'success') {
        set_modalContent({
          title: translate('formStatusComponent', 'successTitle'),
          message: translate('formStatusComponent', 'successBodyText'),
        });
        setShowModal(true);

        //GTM Datalayer push: purchase
        const dataLayerEvent = {
          event: 'purchase',
          ecommerce: {
            transaction_id: transactionId,
            affiliation: 'website',
            value: 1,
            currency: 'EUR',
            tax: 0,
            shipping: 0,
            items: [jobData ? formatGtmJobObject({ jobData: jobData }) : {}],
          },
        };
        pushToDataLayer(dataLayerEvent);
      } else {
        set_modalContent({
          title: translate('formStatusComponent', 'errorTitle'),
          message: translate('formStatusComponent', 'errorBodyText'),
        });
        setShowModal(true);
        throw new Error('status is not success');
      }
    } catch (e) {
      set_modalContent({
        title: translate('formStatusComponent', 'errorTitle'),
        message: translate('formStatusComponent', 'errorBodyText'),
      });
      setShowModal(true);
    }
  };

  // If single filtered option, set formType to that option's type
  // otherwise no formType exists (as it would be set by the select)
  useEffect(
    function () {
      const singleOption =
        filteredOptions?.length === 1 && filteredOptions?.[0];

      if (singleOption) {
        setFormType(singleOption?.type);
      }
    },
    [filteredOptions],
  );
  return (
    <div
      {...storyblokEditable(blok)}
      className={`c-application-form__outer-wrapper outer-wrapper `}
    >
      {isSubmitting ? (
        <Loading />
      ) : (
        <div className="c-application-form__inner-wrapper inner-wrapper">
          <div className="c-application-form__text-container text-container">
            {subtitle ? (
              <h5 className="c-application-form__subtitle subtitle">
                {subtitle}
              </h5>
            ) : null}
            {title ? (
              <h2 className="c-application-form__title">{title}</h2>
            ) : null}
          </div>

          <form
            className="c-application-form__form-container"
            onSubmit={handleSubmit(onSubmitHandler)}
            autoComplete="off"
          >
            <fieldset>
              {filteredOptions?.length > 1 ? (
                <div className="c-text-field__container --full-width-input application-form-select">
                  <label className="c-application-form__select-label">
                    {translate('applicationForm', 'applicationType')}
                    <select
                      className="c-application-form__select"
                      onChange={(e) => selectOnChangeHandler(e.target.value)}
                    >
                      <option
                        value=""
                        disabled
                        selected
                        className="c-application-form__select-option"
                      >
                        {translate('applicationForm', 'selectApplicationType')}
                      </option>
                      {formApplicationTypeOptions.length
                        ? filterApplicationTypeOptions(
                            formApplicationTypeOptions,
                            jobData,
                          ).map((item, i) => (
                            <option
                              value={item.value}
                              className="c-application-form__select-option"
                              key={i}
                            >
                              {item.name}
                            </option>
                          ))
                        : null}
                    </select>
                  </label>
                </div>
              ) : null}
              {formFields?.length ? (
                <div className="c-text-field__container --full-width-input c-application-form__line-break" />
              ) : null}
              {formFields?.length
                ? formFields.map((nestedBlok) => (
                    <StoryblokComponent
                      blok={nestedBlok}
                      key={nestedBlok._uid}
                      register={register}
                      errors={errors}
                      control={control}
                      Controller={Controller}
                      translate={translate}
                    />
                  ))
                : null}
              {formFields?.length ? (
                <button
                  className="c-application-form__submit-button  show-as-button primary"
                  type="submit"
                  disabled={isValid ? false : true}
                >
                  {buttonText}
                </button>
              ) : null}
            </fieldset>
          </form>
          {showModal ? (
            <FormModal
              title={modalContent.title}
              message={modalContent.message}
              onClose={() => setShowModal(false)}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
