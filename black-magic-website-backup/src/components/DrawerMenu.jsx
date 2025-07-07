import { useContext } from 'react';
import { globalContext } from '../App';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import blackMagicLogo from '../assets/blackmagic-logo.png';
import '../css/topbar.css';

function DrawerMenu() {
  const { month, openBars, setOpenBars } = useContext(globalContext);

  const navigate = useNavigate();

  return (
    <div
      id='drawer-nav'
      className={`h-full flex flex-col justify-start absolute transition-all duration-500 bg-gray-300 z-4 p-4
        ${openBars ? (window.innerWidth <= 420 ? `left-0 w-75 items-end` : 'w-90 left-0 items-start') : '-left-120'}`}
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

      <Link
        to='/'
        className='hover:cursor-pointer w-full flex justify-center items-center border-b-2 border-gray-500 pb-6'
      >
        <img className='w-55' src={blackMagicLogo} alt='store-logo' />
      </Link>

      <div id='page-btns-container' className='flex flex-col items-center mt-6'>
        <button
          onClick={() => navigate(`${month.toLowerCase()}-menu`)}
          className='hover:cursor-pointer text-gray-950 hover:border-b-lime-600 hover:text-lime-600 border-2 border-transparent p-1 fontCinzel font-light transition-colors duration-300 mb-4 text-lg'
        >
          {month.toUpperCase()} MENU
        </button>
        <button
          onClick={() => navigate('subscribe')}
          className='hover:cursor-pointer text-gray-950 hover:border-b-lime-600 hover:text-lime-600 border-2 border-transparent p-1 fontCinzel font-light transition-colors duration-300 mb-4 text-lg'
        >
          SUBSCRIBE
        </button>
        <button
          onClick={() => navigate('event')}
          className='hover:cursor-pointer text-gray-950 hover:border-b-lime-600 hover:text-lime-600 border-2 border-transparent p-1 fontCinzel font-light transition-colors duration-300 mb-4 text-lg'
        >
          4TH OF JULY
        </button>
        <button
          onClick={() => navigate('contact')}
          className='hover:cursor-pointer text-gray-950 hover:border-b-lime-600 hover:text-lime-600 border-2 border-transparent p-1 fontCinzel font-light transition-colors duration-300 mb-4 text-lg'
        >
          CONTACT US
        </button>
        <a
          href='http://blackmagicbakehouse.cloveronline.com/'
          target='_blank'
          className='hover:cursor-pointer text-gray-100 bg-gray-950 hover:bg-gray-100 hover:border-gray-950 hover:text-gray-950 border-2 border-transparent p-4 fontCinzel font-bold transition-colors duration-300 text-center rounded-md'
        >
          ORDER ONLINE
        </a>

        <div
          id='social-media-container'
          className='flex items-start w-full mt-10'
        >
          <a
            href='https://www.instagram.com/blackmagicbakehouse/?hl=en'
            target='_blank'
            className='text-3xl border-2 border-transparent hover:border-b-lime-400 hover:text-lime-400 transition-colors pb-1 duration-300'
          >
            <FaInstagram />
          </a>
          <a
            href='https://www.tiktok.com/discover/blackmagic-bakehouse-ridgewood'
            target='_blank'
            className='text-3xl ml-6 border-2 border-transparent hover:border-b-lime-400 hover:text-lime-400 transition-colors pb-1 duration-300'
          >
            <FaTiktok />
          </a>
        </div>
      </div>
    </div>
  );
}

export default DrawerMenu;
