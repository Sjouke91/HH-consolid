// import Image from 'next/image';
import ApplicationButton from '@/components/elements/button/ApplicationButton';
import formatGtmJobObject from '@/lib/gtm/gtm-create-job-object';
import pushToDataLayer from '@/lib/gtm/gtm-datalayer-push';
import {
  // renderRichText,
  StoryblokComponent,
  storyblokEditable,
} from '@storyblok/react';
import { useEffect } from 'react';
import rewriteSlug from 'utils/rewriteSlug';

export default function vacancyParagraph({
  blok,
  jobData,
  url,
  translate,
  recruiterProfilesArray,
}) {
  const { background, alignment, showApplyButton, applyButton } = blok;
  const {
    title: jobTitle,
    sector,
    specs,
    applicationProcedure,
    description,
  } = jobData;

  //GTM Datalayer push: Detail page
  useEffect(() => {
    const dataLayerEvent = {
      event: 'view_item',
      ecommerce: {
        item_list_name: '',
        item_list_id: '',
        items: [formatGtmJobObject({ jobData: jobData })],
      },
    };
    pushToDataLayer(dataLayerEvent);
  }, []);

  return (
    <div
      className={`c-vacancy-paragraph__outer-wrapper outer-wrapper`}
      {...storyblokEditable(blok)}
    >
      <div className="c-vacancy-paragraph__inner-wrapper inner-wrapper">
        <div className={`c-vacancy-paragraph__text-container `}>
          {description ? (
            <div
              className="c-vacancy-paragraph__body-text"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : null}
          <div className="c-vacancy-paragraph__button-container button-container">
            {applyButton && applyButton?.length
              ? applyButton.map((nestedBlok) => (
                  <ApplicationButton
                    blok={nestedBlok}
                    key={nestedBlok._uid}
                    href={`${rewriteSlug(jobData.vacancyUrl)}/application`}
                    className="c-vacancy-paragraph_button secondary"
                  />
                ))
              : null}
          </div>
        </div>
        <div className="c-vacancy-paragraph__sidebar">
          {blok.recruiterBlock?.length
            ? blok.recruiterBlock.map((nestedBlok) => (
                <StoryblokComponent
                  blok={nestedBlok}
                  key={nestedBlok._uid}
                  jobData={jobData}
                  url={url}
                  className="c-vacancy-paragraph__recruiter-block"
                  recruiterProfilesArray={recruiterProfilesArray}
                />
              ))
            : null}
          {blok.shareVacancy?.length
            ? blok.shareVacancy.map((nestedBlok) => (
                <StoryblokComponent
                  blok={nestedBlok}
                  key={nestedBlok._uid}
                  jobData={jobData}
                  url={url}
                  translate={translate}
                  className="c-vacancy-paragraph__share-vacancy"
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
