export default function FavoriteButton({ isFavorite, onToggle, disabled }) {
  return (
    <button
      type="button"
      className={`favorite-button${isFavorite ? " favorite-button--active" : ""}`}
      onClick={onToggle}
      disabled={disabled}
    >
      {isFavorite ? "★ Favorited" : "☆ Add to favorites"}
    </button>
  );
}
