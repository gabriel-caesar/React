import { useEffect, useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineRestaurantMenu, MdCardGiftcard } from 'react-icons/md';
import { GiClockwork } from 'react-icons/gi';
import { useOutletContext } from 'react-router-dom';
import SwipeIn from '../reusable_components/SwipeIn';
import pastriesPhoto from '../assets/beautiful-pastries.jpg';
import piePhoto from '../assets/fruit-pie.jpg';
import logoWhite from '../assets/blackMagic-white-logo.png';
import '../css/general.css';

function General() {
  const [openCircle, setOpenCircle] = useState('');
  const [message, setMessage] = useState('');

  const { openBars } = useOutletContext();

  useEffect(() => {
    // keep track of the timeout id
    let id;

    // conditions for which circle being clicked
    if (openCircle === 'days') {
      id = setTimeout(() => {
        setMessage(`Well for starters, I am one person. I am working on getting
               a team put together to open at least 5 days, but for now we
                stay Thursday-sunday.`);
      }, 400);
    } else if (openCircle === 'menu') {
      id = setTimeout(() => {
        setMessage(`Everyday there's usually something new depending on the ingredients I buy for the week. 
              Keep it fun and fresh. 
              There will always be doughnuts, cinnies, scones, focaccia, bread, quiche, and cookies for now.`);
      }, 400);
    } else if (openCircle === 'gf') {
      id = setTimeout(() => {
        setMessage(
          `Nah, but we are planning to add it for the near future and make your event presents amazing!`
        );
      }, 400);
    }

    // clear timeout
    return () => clearTimeout(id);
  }, [openCircle]);

  return (
    <div
      className={`bg-gray-950 w-full h-auto flex flex-col justify-center items-center relative ${openBars ? 'overflow-hidden' : 'overflow-x-hidden overflow-y-auto'}`}
    >
      <div
        id='hours-andPhotos-container'
        className='flex justify-between items-center w-full'
      >
        <img
          id='filled-donut-photo'
          src={pastriesPhoto}
          alt='filled-donut-photo'
          className='w-120 rounded-md shadow-2xl  whiteShadow'
        />

        <div
          id='hours-container'
          className='text-gray-100 backgroundImage border-2 p-10 w-2/6 rounded-md outline-2 outline-offset-4 relative'
        >
          <h1 className='text-lime-400 fontUncial text-4xl w-full text-center border-b-1 mb-8'>
            hours
          </h1>
          <span
            id='clock-icon'
            className='text-9xl opacity-20'
          >
            <GiClockwork />
          </span>
          <ul id='day-hours' className='w-full fontCinzel'>
            <li className='flex justify-between items-center w-full font-bold'>
              <p id='day'>Monday</p>
              <p id='status'>Closed</p>
            </li>
            <li className='flex justify-between items-center w-full font-bold'>
              <p id='day'>Tuesday</p>
              <p id='status'>Closed</p>
            </li>
            <li className='flex justify-between items-center w-full font-bold'>
              <p id='day'>Wednesday</p>
              <p id='status'>Closed</p>
            </li>
            <li className='flex justify-between items-center w-full font-bold'>
              <p id='day'>Thursday</p>
              <p id='status'>8am until Sell out</p>
            </li>
            <li className='flex justify-between items-center w-full font-bold'>
              <p id='day'>Friday</p>
              <p id='status'>8am until Sell out</p>
            </li>
            <li className='flex justify-between items-center w-full font-bold'>
              <p id='day'>Saturday</p>

              <p id='status'>8am until Sell out</p>
            </li>
            <li className='flex justify-between items-center w-full font-bold'>
              <p id='day'>Sunday</p>

              <p id='status'>8am until Sell out</p>
            </li>
          </ul>
        </div>
        <img
          src={piePhoto}
          alt='croissant-photo'
          className='w-120 rounded-md shadow-2xl  whiteShadow'
        />
      </div>

      <div
        id='frequentQuestions'
        className='flex justify-around items-center w-full mt-30'
      >
        <span className='flex flex-col justify-center items-center'>
          <h1 className='text-lime-400 fontCinzel font-bold mb-6'>
            Why are you not open 7 days?
          </h1>
          <button
            onClick={() => {
              setMessage(''); // clear the message for a new one
              openCircle === 'days' ? setOpenCircle('') : setOpenCircle('days');
            }}
            className={`hover:cursor-pointer transition-all duration-300 border-2 bg-gray-100 text-gray-950 w-20 h-20 flex justify-center items-center fontCinzel font-bold
              ${
                openCircle === 'days'
                  ? 'rounded-md w-100 h-35 p-10 text-md shadowlime border-transparent'
                  : 'text-4xl rounded-full hover:bg-gray-950 hover:text-gray-100'
              }`}
          >
            {openCircle === 'days' ? message : <FaCalendarAlt />}
          </button>
        </span>

        <span className='flex flex-col justify-center items-center'>
          <h1 className='text-lime-400 fontCinzel font-bold mb-6'>
            What is your menu?
          </h1>
          <button
            onClick={() => {
              setMessage(''); // clear the message for a new one
              openCircle === 'menu' ? setOpenCircle('') : setOpenCircle('menu');
            }}
            className={`hover:cursor-pointer transition-all duration-300 border-2 bg-gray-100 text-gray-950 w-20 h-20 flex justify-center items-center fontCinzel font-bold
              ${
                openCircle === 'menu'
                  ? 'rounded-md w-100 h-50 p-10 text-md shadowlime border-transparent'
                  : 'text-4xl rounded-full hover:bg-gray-950 hover:text-gray-100'
              }`}
          >
            {openCircle === 'menu' ? message : <MdOutlineRestaurantMenu />}
          </button>
        </span>

        <span className='flex flex-col justify-center items-center'>
          <h1 className='text-lime-400 fontCinzel font-bold mb-6'>
            Do you have GF options?
          </h1>
          <button
            onClick={() => {
              setMessage(''); // clear the message for a new one
              openCircle === 'gf' ? setOpenCircle('') : setOpenCircle('gf');
            }}
            className={`hover:cursor-pointer transition-all duration-300 border-2 bg-gray-100 text-gray-950 w-20 h-20 flex justify-center items-center fontCinzel font-bold
              ${
                openCircle === 'gf'
                  ? 'rounded-md w-100 h-30 p-10 text-md shadowlime border-transparent'
                  : 'text-4xl rounded-full hover:bg-gray-950 hover:text-gray-100'
              }`}
          >
            {openCircle === 'gf' ? message : <MdCardGiftcard />}
          </button>
        </span>
      </div>

      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 1440 320'
        height='100px'
        width='100%'
        preserveAspectRatio='none'
        className='my-20'
      >
        <path
          fill='#F3F4F6'
          fill-opacity='1'
          d='M0,128L60,112C120,96,240,64,360,48C480,32,600,32,720,64C840,96,960,160,1080,170.7C1200,181,1320,139,1380,117.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
        ></path>
      </svg>

      <SwipeIn direction={150}>
        <h1 className='text-lime-400 text-5xl fontBold fontUncial border-b-2 mb-8 text-center w-full'>
          be kind, be patient
        </h1>
      </SwipeIn>

      <SwipeIn direction={-150}>
        <div className='text-gray-100 mb-70 text-lg flex flex-col justify-center items-center text-center fontCinzel w-3/4 mx-auto relative'>
          <p className='mb-5'>
            Before arriving to our bakehouse please be mindful we are a very
            small staff learning a new space, new system, and new equipment. We
            don't always have our shit together, and we won't always have the
            pastries you came for, but we are always friendly and helpful.
            <span className='text-lime-400'>
              {' '}
              We are in our soft opening phase until we are comfortable with the
              quality of pastry we are making.
            </span>{' '}
            So there are lots of trials and errors. I ask not to judge to
            harshly - I am my own worst critic so chances are I already know
            what could be better. I will announce our grand opening as soon as
            we think we are ready!
          </p>

          <p className='mb-5 text-center'>
            If you donated via{' '}
            <span className='text-lime-400'>kickstarter</span>, rewards will be
            active and ready to be used after the grand opening.
          </p>

          <p className='text-center'>
            Love youz to death,
            <br /> <span className='text-lime-400'>xx Deanne.</span>
          </p>
          <img
              src={logoWhite}
              alt='logo'
              id='white-logo'
              className='opacity-10 w-100 absolute swordposition'
            />
        </div>
      </SwipeIn>
    </div>
  );
}


export default General;
