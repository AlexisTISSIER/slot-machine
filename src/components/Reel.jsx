import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Reel({ symbol, spinTrigger, index }) {
  const reelRef = useRef();

  useEffect(() => {
    if (spinTrigger != null) {
      const tl = gsap.timeline();
      tl.fromTo(
        reelRef.current,
        { y: -150 },
        { y: 0, duration: 0.5, ease: 'bounce.out', delay: index * 0.1 }
      );
    }
  }, [spinTrigger, index]);

  return (
    <div
  ref={reelRef}
  className="reel-cell flex items-center justify-center"
>
  {symbol && (
    <img src={symbol} alt="" />
  )}
</div>
  );
}
