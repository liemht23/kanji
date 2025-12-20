import React from "react";

const Correct: React.FC = () => (
  <div className="correct-anim flex flex-col items-center justify-center">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle
        cx="40"
        cy="40"
        r="36"
        stroke="#22c55e"
        strokeWidth="8"
        fill="#e0ffe6"
      />
      <path
        d="M25 42L37 54L56 31"
        stroke="#22c55e"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-2xl font-bold text-green-600 mt-2 correct-text-anim">
      Correct!
    </span>
  </div>
);

export default Correct;
