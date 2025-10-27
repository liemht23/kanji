'use client';

import { useEffect, useRef } from 'react';

interface KanjiAnimateProps {
  kanjiSvgUrl?: string;
}

export default function KanjiAnimate({
  kanjiSvgUrl = '/kanji/09054.svg',
}: KanjiAnimateProps) {
  const objectRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    const objectElement = objectRef.current;
    if (!objectElement) return;

    const handleLoad = () => {
      const svgDoc = objectElement.contentDocument;
      if (!svgDoc) return;

      const paths = svgDoc.querySelectorAll<SVGPathElement>("path[id*='-s']");
      const colors = ["#e11d48", "#f97316", "#facc15", "#22c55e", "#e11d48", "#f97316", "#facc15", "#22c55e", "#e11d48", "#f97316", "#facc15", "#22c55e"];

      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        path.style.stroke = colors[i % colors.length];
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.transition = "stroke-dashoffset 0.4s ease-in-out";

        setTimeout(() => {
          path.style.strokeDashoffset = "0";
        }, i * 250);
      });
    };

    objectElement.addEventListener('load', handleLoad);
    return () => objectElement.removeEventListener('load', handleLoad);
  }, [kanjiSvgUrl]);

  return (
    <div className="w-full flex justify-center items-center">
      <object
        ref={objectRef}
        type="image/svg+xml"
        data={kanjiSvgUrl}
        className="w-full h-full"
      />
    </div>
  );
}
