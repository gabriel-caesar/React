import { useState } from 'react';
import Button from './Buttons';

export default function Dropdown({ state, setter }) {
  const [check, setCheck] = useState(false);

  if (check) {
    return (
      <div className="flex flex-col items-center justify-center absolute border-6 border-green-700 border-solid right-20 rounded-lg bg-gray-200 p-4 w-70 text-center">
        <h1 className="text-2xl">
          Welcome to Reactive,{' '}
          <span className="font-bold text-green-700 text-3xl">
            {state.username}
          </span>
          !
        </h1>
        <h5 className="text-lg mt-8">
          Now you can <span className="text-green-700 text-2xl">Log In</span>{' '}
          into your account down below!
        </h5>
      </div>
    );
  } else {
    return (
      <div
        id="DROPDOWN"
        className="flex flex-col items-center justify-center absolute border-6 border-green-700 border-solid right-20 rounded-lg bg-gray-200 p-4"
      >
        <label className="flex flex-col text-lg">
          New Username
          <input
            className="bg-green-800 border-b-2 text-gray-100 focus-within:outline-none px-2 w-70"
            type="text"
            onChange={(e) => {
              setter({ ...state, username: e.target.value });
            }}  
            required
          />
        </label>

        <label className="flex flex-col relative text-lg">
          New Password
          <input
            className="bg-green-800 border-b-2 text-gray-100 focus-within:outline-none pl-2 pr-16 w-70"
            type="password"
            onChange={(e) => {
              setter({ ...state, password: e.target.value });
            }}
            required
          />
          <Button
            text="Show"
            className="absolute top-7 left-55 text-gray-200"
          />
        </label>

        <Button
          text="Create"
          className="bg-green-900 text-gray-200 font-bold text-lg rounded-sm mt-8 px-10"
          onClick={() => {
            if (state.username !== '' && state.password !== '') {
              console.log(state);
              return setCheck(true);
            }
            return check;
          }}
        />
      </div>
    );
  }
}
