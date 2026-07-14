import { useState } from "react";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      setError("Please choose a rating from 1 to 5.");
      return;
    }

    setError("");

    try {
      await onSubmit({ rating: numericRating, comment });
      setRating("5");
      setComment("");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Rating
        <select value={rating} onChange={(event) => setRating(event.target.value)}>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Great</option>
          <option value="3">3 - Okay</option>
          <option value="2">2 - Not great</option>
          <option value="1">1 - Poor</option>
        </select>
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
