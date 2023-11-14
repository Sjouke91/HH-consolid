import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import {
  buildJobPath,
  DictionaryCtx,
  FileUploadInputField,
  fileValidator,
  GTMApplicationFormFirstInteraction,
  GTMApplicationPurchase,
  GTMJobApplicationStarted,
  gtmJobObjectFormatter,
  modifyJobObject,
  multiColorTitleConverter,
  transformDataURIToBlob,
  useFormStateActions,
  useFormStateReducer,
} from '@direct-impact/difj-core';
import { renderRichText } from '@storyblok/react';
import { useRouter } from 'next/navigation';
import rewriteSlug from 'utils/rewriteSlug';

const initialFormState = {
  type: 'applicationForm',
  status: '',
  loading: false,
  data: null,
  error: null,
};

export default function JobAlertForm({ blok, data }) {
  //STORY BLOK DATA
  const { title, subtitle, bodyText, background, buttonText, fields, type } =
    blok;
  const jobData = data?.jobData;

  const parsedBodyText = renderRichText(bodyText);

  //FORM LOGIC
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  //VARIABLES
  const jobFilled = false;

  const job = jobData;
  // const { translate } = DictionaryCtx.useContext();
  // // const specs = Object.entries(
  // //   modifyJobObject([job], false, translate)[0].specs,
  // // );

  const hrefSuccess = job && {
    pathname: `${buildJobPath(job, true)}/application`,
    query: { application_status: 'success' },
  };
  const hrefError = {
    pathname: job && `${buildJobPath(job, true)}/application`,
    query: { application_status: 'error' },
  };
  const hrefOnReload = job && {
    pathname: job`${buildJobPath(job, true)}/application`,
  };

  // //convert job specs to an array of objects: {key: "city", value: "city", icon: "<svg>"}
  // const specification = Object.entries(
  //   modifyJobObject([job], false, translate)[0].specs,
  // ).map((spec) => {
  //   return {
  //     key: `${spec[0]}:`,
  //     value: `${spec[1]}`,
  //     icon: icons[spec[0]],
  //   };
  // });

  //USE STATES & USE REDUCERS
  const [formState, dispatch] = useFormStateReducer(initialFormState);
  const ACTIONS = useFormStateActions;
  // const [referrer, set_referrer] = useState(false);
  // const [goBackUrl, set_goBackUrl] = useState('/vacatures');
  // const [firstFormInteraction, set_firstformInteraction] = useState(false);
  // const [jobSpecs, set_jobSpecs] = useState([]);
  const [isToggled, setIsToggled] = useState(false);

  //USE CONTEXT/METHODS
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const GTMJobObject = job && gtmJobObjectFormatter(job);

  //USE EFFECTS
  // useEffect(() => {
  //   GTMJobApplicationStarted(GTMJobObject);

  //   if (firstFormInteraction === false) {
  //     set_firstformInteraction(true);
  //     GTMApplicationFormFirstInteraction({ jobsArray: GTMJobObject });
  //   }
  //   if (window.sessionStorage.prevPath) {
  //     set_goBackUrl(window.sessionStorage.prevPath);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!jobSpecsConfig.specs) return;

  //   const visibleJobsSpecsArray = jobSpecsConfig.specs
  //     .filter((item) => item.visibleOnDetail)
  //     .map((item) => item.specName);

  //   const filterJobSpecs = specs
  //     .map((spec) => {
  //       return {
  //         key: `${spec[0]}:`,
  //         value: `${spec[1]}`,
  //         icon: icons[spec[0]],
  //       };
  //     })
  //     .filter((item) => {
  //       const key = item.key.split(':')[0];

  //       return visibleJobsSpecsArray.includes(key);
  //     });

  //   set_jobSpecs(filterJobSpecs);
  // }, []);

  //formData (field values) passed by useForm hook's handleSubmit function
  function onSubmitHandler(formData) {
    onSubmit(formData);
  }

  //FUNCTIONS
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const onSubmit = async (formData) => {
    console.log('SUBMIT_JOBALERT', { formData });
    return;
  };

  const resetForm = () => {
    dispatch({
      type: ACTIONS.RESET_FORM,
    });
  };
  //END OF BUSINESS LOGIC
  return (
    <div
      {...storyblokEditable(blok)}
      className={`c-job-alert-form__outer-wrapper outer-wrapper ${background}`}
    >
      <div className="c-job-alert-form__inner-wrapper inner-wrapper">
        <div className="c-job-alert-form__content-container">
          <div className="c-job-alert-form__toggle" onClick={handleToggle}>
            <span
              className={`c-job-alert-form__toggle--checkbox ${
                isToggled ? 'checked' : ''
              }`}
            />
            <span className="c-job-alert-form__toggle--slider"></span>
          </div>

          <div className="c-job-alert-form__text-container">
            {title ? (
              <h2 className="c-job-alert-form__title">{title}</h2>
            ) : null}
            {subtitle ? (
              <h5 className="c-job-alert-form__subtitle subtitle">
                {subtitle}
              </h5>
            ) : null}
          </div>
        </div>
        {isToggled && (
          <>
            {parsedBodyText ? (
              <div
                className="c-job-alert-form__body-text"
                dangerouslySetInnerHTML={{ __html: parsedBodyText }}
              />
            ) : null}
            <form
              className="c-job-alert-form__form-container"
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
                      />
                    ))
                  : null}
                <button
                  className="c-job-alert-form__submit-button  show-as-button primary"
                  type="submit"
                >
                  {buttonText}
                </button>
              </fieldset>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
