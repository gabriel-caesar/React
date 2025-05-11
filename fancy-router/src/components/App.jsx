import { createContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { profiles } from '../profiles';

export const UsingProf = createContext({
  animals: [],
  favorite: () => {},
})

const App = () => {
  const navigate = useNavigate();

  const [animals, setAnimals] = useState(profiles);

  function favorite(counter, setter) {
    setter(counter + 1);
  }

  return (
    <UsingProf.Provider value={{ animals: profiles, favorite: favorite }}>
      <div className='bg-gray-900 h-screen flex flex-col justify-center items-center'>
        <h1 className='text-4xl text-white font-bold'>Fancy Router</h1>
        <p className='my-8 text-xl text-gray-400 underline'>
          Check these profiles out:
        </p>
        <div className='flex'>
          <button
            onClick={() => navigate('/profiles')}
            className='bg-gray-600 shadow rounded-md hover:cursor-pointer transition-colors hover:bg-blue-800 text-white p-2 font-bold text-xl mb-10'
          >
            Expand
          </button>
        </div>
        <Outlet />
      </div>
    </UsingProf.Provider>
  );
};

export default App;
