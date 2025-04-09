import { useOutletContext } from 'react-router-dom';

const BuggsDesc = () => {

  const { buggsProfile } = useOutletContext();
  const { name, height, photo, race } = buggsProfile;

  return (
    <div>
      <img src={photo} className='w-60'/>
      <h1>{name}</h1>
      <h2>{height}</h2>
      <h2>{race}</h2>
    </div>
  )
}

export default BuggsDesc;