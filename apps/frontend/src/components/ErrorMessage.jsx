export default function ErrorMessage({ text }) {
  if (!text) {
    return null;
  }

  return <p className="status status--error">{text}</p>;
}
