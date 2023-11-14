import { useEffect, useState } from 'react';
import { breakpoints } from '@/theme/abstracts/breakpoints';

export const useDimensions = () => {
  const initialState = {
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  };

  const [state, setState] = useState(initialState);
  useEffect(() => {
    if (!window) return;

    const handleResize = () => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= breakpoints?.mobile ?? 600,
        isTablet: window.innerWidth <= breakpoints?.tablet ?? 1000,
        isDesktop: window.innerWidth >= breakpoints?.tablet ?? 1000,
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { ...state };
};
