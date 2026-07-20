export default function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
        <path
          d="M3 8h14v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M6 3.5c0 1-1 1-1 2s1 1 1 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M10 3.5c0 1-1 1-1 2s1 1 1 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <p className="status status--empty">{text}</p>
    </div>
  );
}
