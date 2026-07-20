import { useState } from "react";
import StarRatingInput from "./StarRatingInput.jsx";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      setError("Please choose a rating from 1 to 5.");
      return;
    }

    setError("");

    try {
      await onSubmit({ rating, comment });
      setRating(5);
      setComment("");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Rating
        <StarRatingInput value={rating} onChange={setRating} />
      </label>

      <label>
        Comment
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows="3"
          placeholder="What did you think?"
        />
      </label>

      {error ? <p className="status status--error">{error}</p> : null}

      <button type="submit">Post review</button>
    </form>
  );
}
