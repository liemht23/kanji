import React from "react";

const Incorrect: React.FC = () => (
  <div className="incorrect-anim flex flex-col items-center justify-center">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle
        cx="40"
        cy="40"
        r="36"
        stroke="#ef4444"
        strokeWidth="8"
        fill="#ffe6e6"
      />
      <path
        d="M28 28L52 52M52 28L28 52"
        stroke="#ef4444"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-2xl font-bold text-red-600 mt-2 incorrect-text-anim">
      Incorrect!
    </span>
  </div>
);

export default Incorrect;
