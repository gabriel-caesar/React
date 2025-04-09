import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Buggs = () => {
  const [buggsProfile, setBuggsProfile] = useState({
    name: 'Buggs Bunny',
    height: `4 feet`,
    photo: 'https://webportal-cdn.pepedev.com/CharacterData/bugs_bunny.png',
    race: 'Rabbit',
  });

  return (
    <>
      <div className='bg-gray-900 h-screen flex flex-col justify-center items-center text-white'>
        <h1>Click to view more: </h1>
        <Outlet context={{ buggsProfile, setBuggsProfile }} />
        <Link to='/'>Back Home</Link>
      </div>
    </>
  );
};

export default Buggs;
