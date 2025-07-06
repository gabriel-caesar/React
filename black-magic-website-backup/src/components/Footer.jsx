import { useContext } from 'react';
import { globalContext } from '../App';

function Footer() {

  const { isAdmin, setIsAdmin } = useContext(globalContext);

  return (
    <div id="footer"
    className='bg-gray-100 text-gray-950 w-full flex flex-col justify-center items-center relative p-4'>
      <h1
      className='fontCinzel font-bold w-full bg-gray-100 text-center h-15 flex justify-center items-center mb-2'>
        Copyright © 2025 Black Magic Bakehouse by Caesar Websites. All Rights Reserved.
      </h1>
      <button className='bg-gray-950 text-gray-100 border-2 border-transparent fontCinzel font-bold w-25 rounded-md hover:cursor-pointer hover:bg-gray-100 hover:text-gray-950 hover:border-gray-950 transition-all duration-300'
      onClick={() => setIsAdmin(!isAdmin)}>
        Admin
      </button>
    </div>
  )
}

export default Footer;