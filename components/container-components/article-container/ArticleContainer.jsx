import { storyblokEditable, StoryblokComponent } from '@storyblok/react/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { useDimensions } from 'utils/useDimensions';
import { ArticleCarousel } from './ArticleCarousel';

export default function ArticleContainer({
  blok,
  articleArray,
  articlePage,
  translate,
}) {
  const { title, subtitle, amountOfColumns, backgroundImage, backgroundColor } =
    blok;

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
      'c-grid-container__outer-wrapper',
      'outer-wrapper',
      background,
      backgroundImage?.length ? imagePosition : '',
    ].join(' ');
  };

  return (
    <section
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
      <div className="c-article-list__inner-wrapper inner-wrapper">
        <div className="c-article-list__container">
          <ArticleCarousel
            blok={blok}
            tiles={articleArray}
            articlePage={articlePage}
            translate={translate}
          />
        </div>
      </div>
    </section>
  );
}
