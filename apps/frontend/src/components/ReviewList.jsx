import { useAuth } from "../context/AuthContext.jsx";
import EmptyState from "./EmptyState.jsx";
import StarRating from "./StarRating.jsx";

export default function ReviewList({ reviews, onDelete }) {
  const { user } = useAuth();

  if (reviews.length === 0) {
    return <EmptyState text="No reviews yet. Be the first to leave one!" />;
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review.id} className="review-card">
          <div className="review-card__header">
            <strong>{review.user.name}</strong>
            <StarRating rating={review.rating} size={14} />
          </div>
          {review.comment ? <p>{review.comment}</p> : null}
          {user && user.id === review.userId ? (
            <button
              type="button"
              className="review-card__delete"
              onClick={() => onDelete(review.id)}
            >
              Delete my review
            </button>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
