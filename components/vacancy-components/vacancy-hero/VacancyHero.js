'use client';
import { useState, useEffect } from 'react';
import { storyblokEditable } from '@storyblok/react';
import ApplicationButton from '@/components/elements/button/ApplicationButton';
import { useDimensions } from 'utils/useDimensions';
import rewriteSlug from 'utils/rewriteSlug';
import icons from 'public/icons.js';
import { sortSpecArray } from 'utils/specSorter';

export default function VacancyHero({ blok, jobData, translate }) {
  const {
    showVacancySpecs,
    showVacancyTitle,
    button,
    pageType,
    backgroundImage,
    backgroundColor,
  } = blok;

  useEffect(() => {
    if (!window) return;
    setScrollY(window.scrollY);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { isMobile, isTablet, isDesktop } = useDimensions();
  const background = backgroundColor?.[0]?.backgroundColor ?? '';
  const imagePosition = `alignment-${backgroundImage?.[0]?.imagePosition}`;

  let imageUrl;
  if (isMobile) imageUrl = backgroundImage?.[0]?.imageMobile.filename;
  if (isTablet) imageUrl = backgroundImage?.[0]?.imageTablet.filename;
  if (isDesktop) imageUrl = backgroundImage?.[0]?.imageDesktop.filename;

  const {
    title: jobTitle,
    sector,
    specs,
    applicationProcedure,
    startingData,
    workplaceType,
  } = jobData;

  const specArray = specs
    ? Object.entries(specs).map(([name, value]) => {
        const icon = icons[name];
        const label = translate('vacancyListerBlock', name);
        return { name: name, value: value, icon: icon, label: label };
      })
    : null;

  const [scrollY, setScrollY] = useState(0);
  const minimize =
    scrollY >= 180 || pageType === 'application' ? 'minimize' : '';

const sortedSpecs = sortSpecArray({specArray});
  return (
    <section
      {...storyblokEditable(blok)}
      className={`c-vacancy-hero__vacancy-hero-wrapper ${pageType} ${
        background ? imagePosition : ''
      } ${minimize}`}
    >
      <div
        className={`c-vacancy-hero__outer-wrapper outer-wrapper ${imagePosition} ${background} ${minimize}`}
        style={
          imageUrl
            ? {
                backgroundImage: `url(${imageUrl})`,
              }
            : {}
        }
      >
        <div className="c-vacancy-hero__inner-wrapper inner-wrapper">
          <div className={`c-vacancy-hero__content-container ${minimize}`}>
            <div className={`c-vacancy-hero__text-container ${minimize}`}>
              {/* Add to dictionary */}
              {showVacancyTitle && jobTitle ? (
                <h1 className={`c-vacancy-hero__title ${minimize}`}>
                  {jobTitle}
                </h1>
              ) : null}

              {showVacancySpecs ? (
                <div className="c-vacancy-hero__spec-container spec-container">
                  {sortedSpecs?.length ? (
                    <div className="c-vacancy-hero__usp-container">
                      {sortedSpecs.map(({ name, value, icon, label }, index) => {
                        if (name === 'freelancer' || name === 'fachmann')
                          return null;

                        return (
                          <div className={`c-vacancy-hero__usp`} key={index}>
                            <div className="c-vacancy-hero__usp-label">
                              <div dangerouslySetInnerHTML={{ __html: icon }} />
                              <h5>{label}</h5>
                            </div>
                            <h5 className="c-vacancy-hero__usp-value">
                              {value}
                            </h5>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <form className="c-vacancy-hero__button-container">
              {pageType === 'detail' && button && button?.length
                ? button.map((nestedBlok) => (
                    <ApplicationButton
                      blok={nestedBlok}
                      key={nestedBlok._uid}
                      href={`${rewriteSlug(
                        `${jobData.vacancyUrl}/application`,
                      )}`}
                      className="c-vacancy-hero__button show-as-button primary"
                    />
                  ))
                : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
