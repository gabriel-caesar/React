import '../styles/App.css'

export function Button({
  onClick,
  text
}) {
  return (
    <button
      onClick={onClick}
    >
      {text}
    </button>
  )
};