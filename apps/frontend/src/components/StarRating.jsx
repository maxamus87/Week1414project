const STAR_PATH =
  "M12 2.5l2.9 6.16 6.6.77-4.9 4.5 1.3 6.57L12 17.3l-5.9 3.2 1.3-6.57-4.9-4.5 6.6-.77z";

function Star({ fillPercent, size }) {
  const clipId = `star-clip-${Math.round(fillPercent * 1000)}-${size}`;

  return (
    <span className="star" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path d={STAR_PATH} className="star__outline" />
      </svg>
      {fillPercent > 0 ? (
        <svg viewBox="0 0 24 24" width={size} height={size} className="star__fill-svg">
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y="0" width={24 * fillPercent} height="24" />
            </clipPath>
          </defs>
          <path d={STAR_PATH} className="star__fill" clipPath={`url(#${clipId})`} />
        </svg>
      ) : null}
    </span>
  );
}

export default function StarRating({ rating = 0, size = 16, showValue = false }) {
  const stars = [1, 2, 3, 4, 5].map((position) => {
    const fillPercent = Math.max(0, Math.min(1, rating - (position - 1)));
    return <Star key={position} fillPercent={fillPercent} size={size} />;
  });

  return (
    <span className="star-rating" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {stars}
      {showValue ? <span className="star-rating__value">{rating.toFixed(1)}</span> : null}
    </span>
  );
}
