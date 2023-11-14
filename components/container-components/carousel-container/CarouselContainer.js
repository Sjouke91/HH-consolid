'use client';
import { storyblokEditable, StoryblokComponent } from '@storyblok/react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  DotButton,
  useDotButton,
} from 'lib/embla-carousel/EmblaCarouselDotButton';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from 'lib/embla-carousel/EmblaCarouselArrowButtons';
import { useDimensions } from 'utils/useDimensions';

export default function CarouselContainer({
  blok,
  jobCounts,
  translate,
  recruiterProfilesArray,
}) {
  const {
    title,
    subtitle,
    tiles,
    button,
    amountOfColumns,
    backgroundImage,
    backgroundColor,
    tileType,
  } = blok;

  // Carousel settings
  const options = { align: 'end', containScroll: 'trimSnaps' };
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  // Background settings
  const { isMobile, isTablet, isDesktop } = useDimensions();
  const background = backgroundColor?.[0]?.backgroundColor ?? '';
  const imagePosition = `alignment-${backgroundImage?.[0]?.imagePosition}`;

  let imageUrl;
  if (isMobile) imageUrl = backgroundImage?.[0]?.imageMobile.filename;
  if (isTablet) imageUrl = backgroundImage?.[0]?.imageTablet.filename;
  if (isDesktop) imageUrl = backgroundImage?.[0]?.imageDesktop.filename;

  const getOuterWrapperClass = () => {
    return [
      'c-carousel-container__outer-wrapper',
      'outer-wrapper',
      amountOfColumns,
      background,
      backgroundImage?.length ? imagePosition : '',
    ].join(' ');
  };

  return (
    <div
      {...storyblokEditable(blok)}
      className={getOuterWrapperClass()}
      style={
        imageUrl
          ? {
              backgroundImage: `url(${imageUrl})`,
            }
          : {}
      }
    >
      <div className="c-carousel-container__inner-wrapper">
        <div className="c-carousel-container__content-wrapper">
          <div className="c-carousel-container__title-container title-container">
            {subtitle ? (
              <h5 className="c-carousel-container__subtitle subtitle">
                {subtitle}
              </h5>
            ) : null}
            {title ? (
              <h2 className="c-carousel-container__title">{title}</h2>
            ) : null}
          </div>
        </div>
        <div className="c-carousel-container__wrapper-button">
          <div className="button-left">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
          </div>
          <div className="button-right">
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>
          <div
            className="c-carousel-container__carousel-wrapper"
            ref={emblaRef}
          >
            <div className="c-carousel-container__carousel-container">
              {/* Only map through tiles if tileType is unset */}
              {!tileType &&
                tiles.map((nestedBlok, index) => (
                  <div
                    className="c-carousel-container__carousel-slide"
                    key={index}
                  >
                    <StoryblokComponent
                      blok={nestedBlok}
                      jobCounts={jobCounts}
                      key={nestedBlok._uid}
                      translate={translate}
                    />
                  </div>
                ))}
              {tileType && tileType === 'recruiterBlock'
                ? recruiterProfilesArray?.map(function (rec, i) {
                    return (
                      <div
                        className="c-carousel-container__carousel-slide"
                        key={rec._uid}
                      >
                        <StoryblokComponent
                          blok={rec}
                          jobCounts={jobCounts}
                          translate={translate}
                          alt={rec}
                          recruiterProfilesArray={recruiterProfilesArray}
                        />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
      <div className="c-carousel-container__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={'c-carousel-container__dot'.concat(
              index === selectedIndex
                ? ' c-carousel-container__dot--selected'
                : '',
            )}
          />
        ))}
      </div>
      <div className="c-carousel-container__button-container button-container">
        {button?.length
          ? button.map((nestedBlok) => (
              <StoryblokComponent
                blok={nestedBlok}
                key={nestedBlok._uid}
                className="c-hero__button"
                translate={translate}
              />
            ))
          : null}
      </div>
    </div>
  );
}
