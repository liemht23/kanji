"use client";
import { useEffect, useState } from "react";
import { BASE_DURATION, DELAY_BETWEEN } from "@/constants/kanji-const";

interface KanjiAnimateProps {
  kanjiSvgUrl?: string;
  onFinish?: () => void;
}
const KanjiAnimate = ({
  kanjiSvgUrl = "/kanji/09054.svg",
  onFinish,
}: KanjiAnimateProps) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(kanjiSvgUrl)
      .then((res) => res.text())
      .then((text) =>
        text
          .replace(/<\?xml[^>]*>/g, "")
          .replace(/<!DOCTYPE[^>]*\[[\s\S]*?\]>/g, "")
          .replace(/<!DOCTYPE[^>]*>/g, "")
          .replace(/\s(width|height)="[^"]*"/g, "")
      )
      .then(setSvgContent)
      .catch(console.error);
  }, [kanjiSvgUrl]);

  useEffect(() => {
    if (!svgContent) return;
    const container = document.getElementById("kanji-container");
    if (!container) return;
    const paths = container.querySelectorAll<SVGPathElement>("path[id*='-s']");
    const colors = [
      "#dc2626",
      "#ea580c",
      "#ca8a04",
      "#16a34a",
      "#2563eb",
      "#7c3aed",
    ];
    paths.forEach((path, i) => {
      const length = path.getTotalLength();
      path.style.stroke = colors[i % colors.length];
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.getBoundingClientRect();
      setTimeout(() => {
        path.style.transition = `stroke-dashoffset 0.5s ease-in-out ${
          i * 0.3
        }s`;
        path.style.strokeDashoffset = "0";
        path.style.strokeDashoffset = "0";
      }, i * DELAY_BETWEEN);
    });

    const totalDuration = paths.length * (BASE_DURATION + DELAY_BETWEEN);
    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, totalDuration);

    return () => clearTimeout(finishTimer);
  }, [svgContent, onFinish]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        id="kanji-container"
        className="w-[90%] h-[90%] flex justify-center items-center"
        dangerouslySetInnerHTML={
          svgContent ? { __html: svgContent } : undefined
        }
      />
    </div>
  );
};

export default KanjiAnimate;
