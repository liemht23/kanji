'use client';
import { useEffect, useState } from 'react';

interface KanjiAnimateProps {
  kanjiSvgUrl?: string;
}

export default function KanjiAnimate({
  kanjiSvgUrl = '/kanji/09054.svg',
}: KanjiAnimateProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(kanjiSvgUrl)
      .then(res => res.text())
      .then(text =>
        text
          .replace(/<\?xml[^>]*>/g, '')
          .replace(/<!DOCTYPE[^>]*\[[\s\S]*?\]>/g, '')
          .replace(/<!DOCTYPE[^>]*>/g, '')
          .replace(/\s(width|height)="[^"]*"/g, '')
      )
      .then(setSvgContent)
      .catch(console.error);
  }, [kanjiSvgUrl]);

  useEffect(() => {
    if (!svgContent) return;
    const container = document.getElementById('kanji-container');
    if (!container) return;
    const paths = container.querySelectorAll<SVGPathElement>("path[id*='-s']");
    const colors = ["#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#2563eb", "#7c3aed"];
    paths.forEach((path, i) => {
      const length = path.getTotalLength();
      path.style.stroke = colors[i % colors.length];
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.transition = 'stroke-dashoffset 0.4s ease-in-out';
      setTimeout(() => {
        path.style.strokeDashoffset = '0';
      }, i * 500);
    });
  }, [svgContent]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        id="kanji-container"
        className="w-[90%] h-[90%] flex justify-center items-center"
        dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
      />
    </div>
  );
}
