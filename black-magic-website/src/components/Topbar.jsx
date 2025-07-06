import blackMagicLogo from '../assets/blackmagic-logo.png';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../css/topbar.css';
import { useContext } from 'react';
import { globalContext } from '../App';

function Topbar() {

  const { setOpenBars, openBars, month } = useContext(globalContext);

  const navigate = useNavigate();

  return (
    <>
      <nav
        id='topbar-2'
        className='justify-between items-center w-full px-10 hidden'
      >
        <button
          className='text-3xl w-12 text-gray-950 border-2 border-transparent hover:cursor-pointer hover:border-gray-950 rounded-md transition-all duration-300 flex flex-col justify-center items-center p-2'
          onClick={() => setOpenBars(!openBars)}
        >
          <motion.div
            className='w-full h-1 bg-gray-950 rounded-sm'
            animate={{
              rotate: openBars ? 45 : 0,
              y: openBars ? 8 : 0,
            }}
            transition={{
              duration: 0.5,
            }}
          ></motion.div>
          <motion.div
            className='w-full h-1 bg-gray-950 my-1 rounded-sm'
            animate={{
              opacity: openBars ? 0 : 100,
            }}
            transition={{
              duration: 0.5,
            }}
          ></motion.div>
          <motion.div
            className='w-full h-1 bg-gray-950 rounded-sm'
            animate={{
              rotate: openBars ? -45 : 0,
              y: openBars ? -8 : 0,
            }}
            transition={{
              duration: 0.5,
            }}
          ></motion.div>
        </button>

        <Link to='/' className='hover:cursor-pointer'>
          <img className='w-28' src={blackMagicLogo} alt='store-logo' />
        </Link>

        <div
          id='social-media-container'
          className='flex justify-between items-center w-20'
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
            className='text-3xl border-2 border-transparent hover:border-b-lime-400 hover:text-lime-400 transition-colors pb-1 duration-300'
          >
            <FaTiktok />
          </a>
        </div>
        <svg
          className='absolute top-40 z-1 left-0'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1440 320'
        >
          <path
            style={{
              filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.5))',
            }}
            fill='#F3F4F6'
            fill-opacity='1'
            d='M0,96L48,106.7C96,117,192,139,288,133.3C384,128,480,96,576,90.7C672,85,768,107,864,106.7C960,107,1056,85,1152,90.7C1248,96,1344,128,1392,144L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
          ></path>
        </svg>
      </nav>
      <nav
        id='topbar-1'
        className='w-full justify-around flex items-center bg-gray-100 pt-2 relative z-2 mb-10'
      >
        <div
          id='buttons-container'
          className='flex justify-between items-center w-160'
        >
          <Link to='/' className='hover:cursor-pointer'>
            <img className='w-28' src={blackMagicLogo} alt='store-logo' />
          </Link>
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

        <div
          id='social-media-container'
          className='flex justify-between items-center w-60'
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
            className='text-3xl border-2 border-transparent hover:border-b-lime-400 hover:text-lime-400 transition-colors pb-1 duration-300'
          >
            <FaTiktok />
          </a>

          <a
            href='http://blackmagicbakehouse.cloveronline.com/'
            target='_blank'
            className='hover:cursor-pointer text-gray-100 bg-gray-950 hover:bg-gray-100 hover:border-gray-950 hover:text-gray-950 border-2 border-transparent p-1 fontCinzel font-bold transition-colors duration-300 text-center'
          >
            ORDER ONLINE
          </a>
        </div>
        <svg
          className='absolute top-40'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1440 320'
        >
          <path
            style={{
              filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.5))',
            }}
            fill='#F3F4F6'
            fill-opacity='1'
            d='M0,96L48,106.7C96,117,192,139,288,133.3C384,128,480,96,576,90.7C672,85,768,107,864,106.7C960,107,1056,85,1152,90.7C1248,96,1344,128,1392,144L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
          ></path>
        </svg>
      </nav>
    </>
  );
}

export default Topbar;
