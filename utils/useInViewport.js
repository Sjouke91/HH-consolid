import { useEffect, useMemo, useState } from 'react';

export const useInViewport = (ref) => {
  const [isIntersecting, set_isIntersecting] = useState(false);

  const observer =
    typeof window !== 'undefined'
      ? useMemo(
          () =>
            new IntersectionObserver(
              ([entry]) => set_isIntersecting(entry.isIntersecting),
              { threshold: 1 },
            ),
          [],
        )
      : {};

  useEffect(() => {
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

  return isIntersecting;
};
