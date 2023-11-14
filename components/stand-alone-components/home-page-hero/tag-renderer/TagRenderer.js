import { useState, useEffect } from 'react';
import { StoryblokComponent } from '@storyblok/react';
import { storyblokEditable } from '@storyblok/js';

//returns different every 10 secs - then renders tag
export default function TagRenderer({ tags, isTitle, className }) {
  const lastIndex = tags?.length - 1;
  const [currentIndex, set_currentIndex] = useState(0);
  const currentTag = tags?.[currentIndex];

  function increment() {
    if (currentIndex === lastIndex) {
      set_currentIndex(0);
    } else {
      set_currentIndex(currentIndex + 1);
    }
  }

  useEffect(function () {
    const incrementInterval = setInterval(function () {
      increment();
    }, 2000);

    return function () {
      clearInterval(incrementInterval);
    };
  });

  return (
    <div className={className}>
      {currentTag ? (
        <StoryblokComponent
          key={currentTag?._uid}
          blok={currentTag}
          isTitle={isTitle}
        />
      ) : (
        ''
      )}
    </div>
  );
}
