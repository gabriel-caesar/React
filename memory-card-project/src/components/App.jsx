import { useEffect, useState } from 'react';
import '../index.css';
import Cards from './Cards';
import Navbar from './Navbar';

export default function App() {
  const [pokeDex, setPokeDex] = useState([]);
  const [points, setPoints] = useState(0);
  const [record, setRecord] = useState(0);
  const [winning, setWinning] = useState(false);
  const [volume, setVolume] = useState(0.05);

  function playSoundEffect(sound) {
    // sound fxs
    const pokemonCry = new Audio(sound);
    pokemonCry.volume = volume;
    pokemonCry.play();
  }

  // Durstenfeld shuffle
  function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  // creating an array of 20 numbers
  const array = () => {
    let arr = [];
    for (let i = 1; i < 21; i++) {
      arr.push(i);
    }
    return arr;
  };

  // fetching each pokemon based in its id (0 to 20)
  async function fetchPokemons() {
    try {
      const pokePromises = array().map((id) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then((response) =>
          response.json()
        )
      );

      const fetchedPokemons = await Promise.all(pokePromises);

      setPokeDex(fetchedPokemons);
    } catch (error) {
      new error('Error trying to fetch pokemons data');
    }
  }

  // calling functions only on mount
  useEffect(() => {
    array();

    fetchPokemons();
  }, []);

  useEffect(() => {
    if (points === 20) {
      setWinning(true);
    }
  }, [points, winning]);

  return (
    <div>
      <Navbar />

      <div className='flex justify-around items-center mt-4'>
        <div className='border-black border-4 rounded-sm px-4 py-2'>
          <h1 className='flex items-center'>
            Your points: <span className='text-red-600 text-2xl'>{points}</span>
          </h1>
        </div>
        <div className='border-black border-4 rounded-sm px-4 py-2 flex flex-col justify-center items-center'>
          <p className=''>Cries Volume</p>
          <input
            className='accent-black'
            type='range'
            onInput={(e) => setVolume(e.target.value)}
            min={0}
            max={1}
            step={0.1}
            value={volume}
          />
        </div>
        <div className='border-black border-4 rounded-sm px-4 py-2'>
          <h1 className='flex items-center'>
            Record: <span className='text-red-600 text-2xl'>{record}</span>
          </h1>
        </div>
      </div>

      <div className='flex justify-center items-center mt-7 break-words flex-wrap'>
        {winning ? (
          <div className='flex justify-center items-center h-80'>
            <h1 className='text-5xl'>
              You <span className='text-red-600'>Win</span>!
            </h1>
          </div>
        ) : (
          pokeDex.map((pokemon) => (
            <Cards
              key={pokemon.id}
              text={pokemon.name}
              photo={pokemon.sprites.front_default}
              click={() => {
                setPoints(points + 1); // adding to score points
                playSoundEffect(pokemon.cries.latest);
                // I picked the 'is_default' randomly from the pokemon data retrieval
                if (pokemon.is_default) {
                  // clicked a valid card
                  pokemon.is_default = false;
                  setPokeDex(shuffle(pokeDex)); // shuffles the deck
                } else {
                  // clicked an unvalid card
                  pokeDex.map((pokemon) => (pokemon.is_default = true)); // reset 'is_default' to true
                  setPoints(0);
                  record > points ? setRecord(record) : setRecord(points); // if there is a 'record' and is bigger than 'points', maintain it, otherwise set it to be equal to the 'points' number
                  setPokeDex(shuffle(pokeDex)); // shuffles the deck
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
