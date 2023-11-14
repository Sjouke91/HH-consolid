import { useEffect, useRef, useState } from 'react';

// NOTE(Fran): adapted from:
// https://web.archive.org/web/20230425122252/https://usehooks.com/useHover/

/* How to use:
function App() {
  const [componentRef, hoverRef] = useHover();

  return (
    <div ref={componentRef}>
      {hoverRef.current ? 'Hovering!' : 'not hovering...'}
    </div>
  );
}
*/

export const useHover = () => {
  const componentRef = useRef(null);
  const [hover, set_hover] = useState(false);

  const handleMouseOver = () => set_hover(true);
  const handleMouseOut = () => set_hover(false);

  useEffect(() => {
    const node = componentRef.current;

    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [componentRef.current]);

  return [componentRef, hover];
};
