import { useState } from 'react';
import reactiveLogo from '../assets/reactive-no-bg.png';
import Button from './Buttons';
import CreateAccount from './CreateAccount';
import moneyDollar from '../assets/hand-with-money.svg';
import Login from './Login';
import '../App.css';

export default function App() {
  const [newUser, setNewUser] = useState({ username: '', password: '' });

  return (
    <div>
      <nav className="flex bg-green-900 justify-between items-center">
        <div className="flex relative w-100">
          <img
            src={reactiveLogo}
            alt="logo-image"
            className="w-28 box-border"
          />
          <p className="text-gray-200 absolute top-17 left-23 font-extrabold text-2xl">
            eactive Banking{' '}
          </p>
        </div>
        <CreateAccount state={newUser} setter={setNewUser} />
      </nav>

      <div className="flex justify-around items-center mt-16">
        <div className="flex items-center justify-center">
          <img
            src={moneyDollar}
            alt="hand full of dollar bills"
            className="w-80"
          />

          <h1 className="text-6xl w-100">
            New <span className="text-green-900 underline">Reactive</span>{' '}
            checking customers earn{' '}
            <span className="font-bold text-green-900">$300</span>
          </h1>
        </div>
        <Login user={newUser} />
      </div>
      <footer></footer>
    </div>
  );
}
