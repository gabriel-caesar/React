import { useContext } from 'react';
import { gameboardContext } from './Gameboard';
import { globalContext } from '../App';
import { Expand } from 'lucide-react';

export default function GameLog() {

  const { gameTurn, playerPassedTurn } = useContext(gameboardContext);
  const { battlePrep, player, appTheme } = useContext(globalContext);

  return (
    <nav
      className={`absolute top-83.5 right-155 radialGradient rounded-sm w-80 flex justify-center items-center border-2 ${appTheme === 'vile' ? 'border-gray-400' : 'border-black'} z-3 overflow-hidden`}
      id='game-log-container'
      aria-label='game-log-container'
    >
      <h1 className='fontUncial text-center'>
        {battlePrep
          ? 'The battle horn is blown...'
          : !playerPassedTurn
            ? `${player.name}'s turn`
            : `Bot's turn`}
      </h1>
      <span
        className={`absolute bg-gray-900 text-amber-400 right-0 hover:cursor-pointer hover:bg-amber-400 hover:text-gray-900 transition-all border-r-transparent rounded-tr-sm rounded-br-sm border-l-2 border-gray-900`}
        id='expand-game-log'
        aria-label='expand-game-log'
      >
        <Expand />
      </span>
      <span
        className={`absolute bg-gray-900 text-amber-400 left-0 border-l-transparent rounded-tr-sm rounded-bl-sm border-r-2 border-gray-900 w-5 text-center text-lg bottom-0 font-bold height-full fontUncial`}
        id='game-turn-number'
        aria-label='game-turn-number'
      >
        {gameTurn}
      </span>
    </nav>
  );
}
