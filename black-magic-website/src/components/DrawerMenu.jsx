import { useContext } from 'react';
import { globalContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import blackMagicLogo from '../assets/blackmagic-logo.png';
import '../css/topbar.css';


function DrawerMenu() {
  
  const { month, openBars, setOpenBars } = useContext(globalContext);
  const navigate = useNavigate();

  return (
    <div
      id='drawer-nav'
      className={`h-full flex flex-col justify-start items-start w-90 absolute pl-4 pt-4 ${openBars ? 'left-0' : '-left-120'} transition-all duration-500 bg-gray-300 z-4`}
    >

        <button
          className='text-3xl w-12 bg-gray-950 border-2 border-lime-600 hover:cursor-pointer rounded-md transition-all duration-300 flex flex-col justify-center items-center p-2 absolute -right-13 top-2'
          onClick={() => setOpenBars(!openBars)}
        >
          <motion.div
            className='w-full h-1 bg-lime-600 rounded-sm'
            animate={{
              rotate: openBars ? 45 : 0,
              y: openBars ? 8 : 0,
            }}
            transition={{
              duration: 0.8,
            }}
          ></motion.div>
          <motion.div
            className='w-full h-1 bg-lime-600 my-1 rounded-sm'
            animate={{
              opacity: openBars ? 0 : 100,
            }}
            transition={{
              duration: 0.8,
            }}
          ></motion.div>
          <motion.div
            className='w-full h-1 bg-lime-600 rounded-sm'
            animate={{
              rotate: openBars ? -45 : 0,
              y: openBars ? -8 : 0,
            }}
            transition={{
              duration: 0.8,
            }}
          ></motion.div>
        </button>

      <Link to='/' className='hover:cursor-pointer'>
        <img className='w-65' src={blackMagicLogo} alt='store-logo' />
      </Link>

      <div className='flex flex-col items-center'>

        <button
          onClick={() => navigate(`${month.toLowerCase()}-menu`)}
          className='hover:cursor-pointer text-gray-950 hover:border-b-lime-400 hover:text-lime-400 border-2 border-transparent p-1 fontCinzel font-bold transition-colors duration-300 '
        >
          {month.toUpperCase()} MENU
        </button>
        <button
          onClick={() => navigate('subscribe')}
          className='hover:cursor-pointer text-gray-950 hover:border-b-lime-400 hover:text-lime-400 border-2 border-transparent p-1 fontCinzel font-bold transition-colors duration-300 '
        >
          SUBSCRIBE
        </button>
        <button
          onClick={() => navigate('event')}
          className='hover:cursor-pointer text-gray-950 hover:border-b-lime-400 hover:text-lime-400 border-2 border-transparent p-1 fontCinzel font-bold transition-colors duration-300 '
        >
          4TH OF JULY
        </button>

      </div>
    </div>
  );
}

export default DrawerMenu;
