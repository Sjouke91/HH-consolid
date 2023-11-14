import {
  storyblokEditable,
  StoryblokComponent,
  renderRichText,
} from '@storyblok/react';
import { useRef, useState, useEffect } from 'react';
import { useDimensions } from 'utils/useDimensions';

export default function VideoBlock({ blok }) {
  const {
    title,
    subtitle,
    video,
    autoplay,
    fullscreen,
    bodyText,
    button,
    backgroundImage,
    backgroundColor,
  } = blok;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const parsedBodyText = renderRichText(bodyText);

  const toggleVideo = () => {
    isPlaying ? videoRef.current.play() : videoRef.current.pause();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (autoplay) {
      videoRef.current.play().catch((error) => {
        console.error('Video autoplay failed:', error);
      });
      setIsPlaying(true);
    }
  }, [autoplay]);

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
      'c-video-block__outer-wrapper',
      'outer-wrapper',
      background,
      backgroundImage?.length ? imagePosition : '',
    ].join(' ');
  };

  return (
    <section {...storyblokEditable(blok)} className={getOuterWrapperClass()}>
      <div
        className={`c-video-block__inner-wrapper inner-wrapper ${
          fullscreen ? 'fullscreen' : ''
        }`}
        style={
          imageUrl
            ? {
                backgroundImage: `url(${imageUrl})`,
              }
            : {}
        }
      >
        <div className="c-video-block__title-container">
          {subtitle && <h5 className="c-video-block__subtitle">{subtitle}</h5>}
          {title && <h2 className="c-video-block__title">{title}</h2>}
        </div>
        {parsedBodyText ? (
          <div
            className="c-video-block__body-text"
            dangerouslySetInnerHTML={{ __html: parsedBodyText }}
          />
        ) : null}
        <div
          className={`c-video-block__video-container ${
            isPlaying ? 'playing' : ''
          }`}
          onClick={toggleVideo}
        >
          <video
            ref={videoRef}
            className={`c-video-block__video ${fullscreen ? 'fullscreen' : ''}`}
            // Note(Fran): we skip ahead to load the first frame,
            // otherwise mobile doesn't show anything
            src={video.filename + '#t=0.001'}
            playsInline
            controls
            type="video/mp4"
            onEnded={() => setIsPlaying(false)}
            {...(autoplay ? { autoPlay: true, muted: true } : {})}
          />
        </div>
        {button && button.length
          ? button.map((b) => (
              <StoryblokComponent
                blok={b}
                key={b?._uid}
                className="c-video-block__button"
              />
            ))
          : ''}
      </div>
    </section>
  );
}
