import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UsingProf } from './App';

const Profiles = () => {
  const { animals, favorite } = useContext(UsingProf);

  return (
    <>
      <div className='flex justify-center items-center'>
        {animals.map((profile) => {
          const [counter, setCounter] = useState(0);  // Local state for each profile

          return (
            <div
              key={profile.id}  // Use a unique id for the key
              className='bg-gray-900 h-auto flex justify-center items-center text-white mr-10'
            >
              <div>
                <img src={profile.photo} className='w-30' />
                <h1>{profile.name}</h1>
                <h2>{profile.height}</h2>
                <h2>{profile.race}</h2>
                <button
                  onClick={() => {
                    if (counter === profile.id) { // Only update if the profile.id matches
                      favorite(counter, setCounter);
                    }
                  }}
                  className='rounded-sm bg-red-500 hover:cursor-pointer hover:bg-white hover:text-black transition-colors px-2 flex'
                >
                  <p className='mr-2'>{counter}</p>
                  {'<3'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Link
        to='/'
        className='bg-gray-600 shadow rounded-md hover:cursor-pointer transition-colors hover:bg-blue-800 text-white p-2 font-bold text-xl mt-10'
      >
        Collapse
      </Link>
    </>
  );
};


export default Profiles;
