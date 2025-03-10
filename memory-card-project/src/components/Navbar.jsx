import pokeBallImage from '../assets/pokeball.png';

export default function Navbar() {
  return (
    <nav className='flex justify-between p-4 items-center border-b-2 bg-gray-300'>
      <h1 className='text-3xl text-red-600'>Memory Card Game</h1>
      <img className='w-15' src={pokeBallImage} alt='pokeball' />
    </nav>
  );
}
