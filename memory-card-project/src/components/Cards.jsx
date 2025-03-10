export default function Cards({ text, photo, click }) {
  return (
    <button
      className='flex flex-col items-center mx-6 mt-6 px-4 text-sm bg-gray-200 rounded-sm border-4 border-solid hover:cursor-pointer hover:bg-gray-500 transition duration-100 ease-in active:border-red-600 active:transition-none'
      onClick={click}
    >
      <img src={photo} alt='pokemon-photo' />
      {text}
    </button>
  );
}
