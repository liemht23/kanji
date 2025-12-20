import React from "react";

interface GradientSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;

  startColor: string; // màu đầu gradient
  endColor: string; // màu cuối gradient

  disabled?: boolean;
}

/* Convert hex → [r,g,b] */
const hexToRgb = (hex: string) => {
  const value = hex.replace("#", "");
  return [
    parseInt(value.substring(0, 2), 16),
    parseInt(value.substring(2, 4), 16),
    parseInt(value.substring(4, 6), 16),
  ];
};

const GradientSlider = ({
  min,
  max,
  value,
  onChange,
  startColor,
  endColor,
  disabled = false,
}: GradientSliderProps) => {
  const percent = ((value - min) * 100) / (max - min);

  const sc = hexToRgb(startColor);
  const ec = hexToRgb(endColor);

  const mix = sc.map((s, i) => Math.round(s + ((ec[i] - s) * percent) / 100));
  const thumbColor = `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;

  return (
    <input
      type="range"
      min={min}
      max={max}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="modern-slider w-full"
      style={
        {
          "--thumb-border": thumbColor,
          "--thumb-bg": "#fff",
          background: `linear-gradient(to right,
          ${startColor} 0%,
          ${endColor} ${percent}%,
          #e5e7eb ${percent}%,
          #e5e7eb 100%)`,
        } as React.CSSProperties
      }
    />
  );
};

export default GradientSlider;
