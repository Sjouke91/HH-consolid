'use client';
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
import { storyblokEditable, StoryblokComponent } from '@storyblok/react/rsc';
import { useDimensions } from 'utils/useDimensions';
import { ArticleSlide } from './ArticleSlide';

export function ArticleCarousel({ blok, tiles, articlePage, translate }) {
  const { title, subtitle, button, amountOfColumns } = blok;

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

  const getOuterWrapperClass = () => {
    return [
      'c-article-carousel-container__outer-wrapper',
      'outer-wrapper',
    ].join(' ');
  };

  return (
    <div {...storyblokEditable(blok)} className={getOuterWrapperClass()}>
      <div className="c-article-carousel-container__inner-wrapper">
        <div className="c-article-carousel-container__title-container title-container">
          {subtitle ? (
            <h5 className="c-article-carousel-container__subtitle subtitle">
              {subtitle}
            </h5>
          ) : null}
          {title ? (
            <h2 className="c-article-carousel-container__title">{title}</h2>
          ) : null}
        </div>
        <div className="c-article-carousel-container__wrapper-button">
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
            className="c-article-carousel-container__carousel-wrapper"
            ref={emblaRef}
          >
            <div className="c-article-carousel-container__carousel-container">
              {tiles.map((nestedBlok, index) => {
                //remove blog from lister if it is already shown on an article page
                const {
                  content: { heroTitle: list_heroTitle },
                } = nestedBlok;

                if (articlePage === list_heroTitle) return;

                return (
                  <div
                    className="c-article-carousel-container__carousel-slide"
                    key={index}
                  >
                    <ArticleSlide
                      article={nestedBlok}
                      articlePage={articlePage}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} /> */}
      <div className="c-article-carousel-container__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={'c-article-carousel-container__dot'.concat(
              index === selectedIndex
                ? ' c-article-carousel-container__dot--selected'
                : '',
            )}
          />
        ))}
      </div>
      <div className="c-article-carousel-container__button-container button-container">
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
