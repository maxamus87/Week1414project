import { useState } from "react";

const STAR_PATH =
  "M12 2.5l2.9 6.16 6.6.77-4.9 4.5 1.3 6.57L12 17.3l-5.9 3.2 1.3-6.57-4.9-4.5 6.6-.77z";

const LABELS = { 1: "Poor", 2: "Not great", 3: "Okay", 4: "Great", 5: "Excellent" };

export default function StarRatingInput({ value, onChange, size = 22 }) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  return (
    <div className="star-input" onMouseLeave={() => setHoverValue(0)}>
      {[1, 2, 3, 4, 5].map((position) => (
        <button
          key={position}
          type="button"
          className="star-input__button"
          style={{ transitionDelay: `${(position - 1) * 25}ms` }}
          aria-label={`${position} star${position === 1 ? "" : "s"} - ${LABELS[position]}`}
          aria-pressed={value === position}
          onMouseEnter={() => setHoverValue(position)}
          onFocus={() => setHoverValue(position)}
          onClick={() => onChange(position)}
        >
          <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <path
              d={STAR_PATH}
              fill={position <= displayValue ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
      <span className="star-input__label">{displayValue ? LABELS[displayValue] : "Select a rating"}</span>
    </div>
  );
}
