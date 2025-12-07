import { SetStateAction } from 'react';
import { FaDumbbell, FaPlus, FaUser } from 'react-icons/fa';
import { FaBowlFood } from 'react-icons/fa6';

export default function SectionTogglerButton({
  toggler,
  setToggler,
  name
}: {
  toggler: string;
  setToggler: React.Dispatch<SetStateAction<string>>;
  name: string;
}) {
  return (
    <button
      id={`${toggler}-info-button`}
      aria-label={`${toggler}-info-button`}
      className={`
        ${toggler === name && 'bg-neutral-500 scale-105'} group active:scale-95
        p-1 rounded-md hover:cursor-pointer hover:text-red-400 hover:scale-105 transition-all
      `}
      onClick={() => setToggler(name)}
    >
      {name === 'general' ? (
        <FaUser />
      ) : name === 'meal' ? (
        <FaBowlFood />
      ) : name === 'exercises' ? (
        <FaDumbbell />
      ) :(
        <FaPlus />
      )}
      <div
        id={`${toggler}-caption`}
        aria-label={`${toggler}-caption`}
        className='absolute text-white whitespace-nowrap left-1/2 -translate-x-1/2 -bottom-6 bg-neutral-700 rounded-lg px-2 w-fit text-center text-sm hover:cursor-default pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 transition-all duration-300'
      >
        {name === 'general' ? (
          'General'
        ) : name === 'meal' ? (
          'Meals'
        ) : name === 'exercises' ? (
          'Exercises'
        ) : (
          'Details'
        )}
      </div>
    </button>
  );
}
