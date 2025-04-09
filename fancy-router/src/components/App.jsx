import Buggs from './Buggs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {

  const navigate = useNavigate();

  return (
    <div className='bg-gray-900 h-screen flex flex-col justify-center items-center'>
      <h1 className='text-4xl text-white font-bold'>Fancy Router</h1>
      <p className='my-8 text-xl text-gray-400 underline'>Check these profiles out:</p>
      <div className='flex'>
        <button onClick={() => navigate('buggs/buggsDesc')} className='bg-gray-600 shadow rounded-md hover:cursor-pointer transition-colors hover:bg-blue-800 text-white p-2 font-bold text-xl'>Buggs Bunny</button>
      </div>
    </div>
  );
};

export default App;
