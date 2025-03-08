import { useState } from 'react';
import Button from './Buttons';
import Dropdown from './Dropdown';

export default function CreateAccount({ state, setter }) {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="relative">
      <Button
        className="text-black-200 bg-gray-200 rounded-sm px-4 h-12 mr-6 hover:opacity-70 cursor-pointer duration-75 ease-in"
        text="Create an account"
        onClick={() => {
          setHidden(!hidden);
        }}
      />

      {hidden && <Dropdown state={state} setter={setter}/>}
    </div>
  );
}
