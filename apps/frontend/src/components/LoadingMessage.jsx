export default function LoadingMessage({ text = "Loading..." }) {
  return <p className="status status--loading">{text}</p>;
}
