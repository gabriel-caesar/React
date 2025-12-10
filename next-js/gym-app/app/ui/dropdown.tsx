import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { capitalizeInitial } from '../actions/utils';

export default function Dropdown({
  options,
  selector,
  setSelector,
  style,
}: {
  options: string[];
  selector: string;
  setSelector: React.Dispatch<React.SetStateAction<string>>;
  style: string;
}) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false); // opens the dropdown

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      id='dropdown-wrapper' 
      className={`relative mt-2 ${style}`}
    >
      <div
        id='selector-container'
        className={`
          ${openDropdown ? 'bg-neutral-700 scale-101' : 'bg-neutral-800'}
          rounded-lg shadow-md flex items-center justify-between w-full transition-all duration-300
          border-1 border-neutral-500 hover:cursor-pointer hover:scale-101 text-[16px] px-2 py-1
        `}
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        {selector ? capitalizeInitial(selector) : 'Choose one option'}
        <IoChevronDown
          className={`${openDropdown && '-rotate-180'} transition-all duration-300`}
        />
      </div>
      <ul
        id='selected-container'
        className={`
          ${openDropdown ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          absolute top-full rounded-lg bg-neutral-800 border-1 border-neutral-500
          w-full text-[16px] p-2 transition-all duration-300 mt-1
        `}
      >
        {options.length > 0 ? (
          options.map((opt, i) => {
            return (
              <li
                key={opt}
                className={`${i !== options.length - 1 && 'mb-3'} hover:cursor-pointer hover:text-red-400 rounded-lg text-neutral-400 hover:bg-neutral-800 transition-all`}
                onClick={() => {
                  setSelector(opt);
                  setOpenDropdown(false);
                }}
              >
                {opt}
              </li>
            );
          })
        ) : (
          <p>No options to select</p>
        )}
      </ul>
    </motion.div>
  );
}
