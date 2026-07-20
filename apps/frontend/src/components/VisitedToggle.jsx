export default function VisitedToggle({ visited, onToggle, disabled }) {
  return (
    <button
      type="button"
      className={`visited-toggle${visited ? " visited-toggle--active" : ""}`}
      onClick={onToggle}
      disabled={disabled}
    >
      {visited ? (
        <svg className="icon-pop" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
          <path
            d="M4 12l5 5 11-11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {visited ? "Visited" : "Mark as visited"}
    </button>
  );
}
