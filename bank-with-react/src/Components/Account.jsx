import { useState } from 'react';
import Button from './Buttons';

export default function Account({ props }) {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [thisUser, setThisUser] = useState(props);

  return (
    <div className="flex flex-col bg-green-900 text-gray-200 rounded-sm px-6 py-4 mr-10">
      <h1 className="text-2xl text-center">
        Good day,{' '}
        <span className="text-green-400 underline text-3xl">
          {thisUser.username}
        </span>
      </h1>

      <h1 className="text-2xl my-6">
        Your Balance is:{' '}
        <span
          className={
            thisUser.balance < 100
              ? 'text-red-500 inline-block align-middle'
              : 'text-green-400 inline-block align-middle'
          }
        >
          ${thisUser.balance}
        </span>
      </h1>

      <div>
        <h3>Add or Withdraw: </h3>
        <input
          type="number"
          className="bg-green-800 border-b-2 text-gray-100 focus-within:outline-none px-2 w-70 rounded-t-sm"
          onChange={(e) => setCurrentBalance(e.target.value)}
        />
      </div>

      <div className="flex justify-center items-center">
        <Button
          className="bg-gray-200 text-green-900 font-bold text-lg rounded-sm mt-4 mr-4 px-4"
          text="Deposit"
          onClick={() => {
            const a = parseInt(currentBalance);
            const b = parseInt(thisUser.balance);

            if (a + b > 1000000) {
              return thisUser;
            }
            return setThisUser({
              ...thisUser,
              balance: a + b,
            });
          }}
        />
        <Button
          className="bg-gray-200 text-green-900 font-bold text-lg rounded-sm mt-4 px-4"
          text="Withdraw"
          onClick={() => {
            const a = parseInt(currentBalance);
            const b = parseInt(thisUser.balance);

            if (b - a < 0) {
              return setThisUser({ ...thisUser, balance: 0 });
            }

            return setThisUser({
              ...thisUser,
              balance: b - a,
            });
          }}
        />
      </div>
    </div>
  );
}
