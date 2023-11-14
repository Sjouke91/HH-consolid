import Button from '@/components/elements/button/Button';
import getRelatedVacancies from '@/lib/lister-aux/get-related-vacancies';
import { renderRichText, storyblokEditable } from '@storyblok/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import icons from 'public/icons';
import rewriteSlug from 'utils/rewriteSlug';

export default function RelatedVacancyBlock({
  blok,
  jobData,
  relatedVacancies,
  translate,
}) {
  if (!relatedVacancies.length) return <></>;
  const { title, subtitle, bodyText, background, buttonText } = blok;
  const parsedBodyText = renderRichText(bodyText);

  return (
    <div
      {...storyblokEditable(blok)}
      className={`c-related-vacancy-block__outer-wrapper outer-wrapper background secondary`}
    >
      <div className="c-related-vacancy-block__inner-wrapper inner-wrapper">
        <div className="c-related-vacancy-block__title-container">
          {subtitle ? (
            <h5 className="c-related-vacancy-block__subtitle subtitle">
              {subtitle}
            </h5>
          ) : null}
          {title ? (
            <h2 className="c-related-vacancy-block__title">{title}</h2>
          ) : null}
          {parsedBodyText ? (
            <div
              className="c-related-vacancy-block__title"
              dangerouslySetInnerHTML={{ __html: parsedBodyText }}
            />
          ) : null}
        </div>
        <div className="c-related-vacancy-block__vacancy-container">
          {relatedVacancies.map((vacancy, i) => {
            const {
              title: jobTitle,
              sector,
              specs,
              applicationProcedure,
              intro,
              startingData,
              jobId,
              vacLink,
              vacancyUrl,
            } = vacancy;

            //todo: check whether correct specs are linked to correct icons
            const specArray = specs
              ? Object.entries(specs).map(([name, value]) => {
                  const icon = icons[name];
                  return { name: name, value: value, icon: icon };
                })
              : null;

            return (
              <div className="c-related-vacancy-block__vacancy" key={i}>
                <div className="c-related-vacancy-block__spec-and-title-container">
                  {jobTitle ? (
                    <h3 className="c-related-vacancy-block__vacancy-title">
                      {jobTitle}
                    </h3>
                  ) : null}
                  {specArray?.length && (
                    <div className="c-related-vacancy-block__spec-container">
                      {specArray.map(({ name, value, icon }, i) => {
                        return (
                          <div
                            className="c-related-vacancy-block__spec"
                            key={i}
                          >
                            {icon ? (
                              <div
                                className="c-related-vacancy-block__spec-icon"
                                dangerouslySetInnerHTML={{ __html: icon }}
                              />
                            ) : null}
                            {value ? (
                              <p className="c-related-vacancy-block__spec-value">
                                {value}
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <Link
                  href={`${rewriteSlug(vacancyUrl)}`}
                  className={`c-related-vacancy-block__button show-as-button secondary`}
                >
                  {buttonText
                    ? buttonText
                    : translate('relatedVacancyBlock', 'showVacancy')}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
