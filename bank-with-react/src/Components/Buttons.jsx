export default function Button({ text, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`${className} hover:opacity-70 cursor-pointer duration-75 ease-in`}
    >
      {text}
    </button>
  );
}
