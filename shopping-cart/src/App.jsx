import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const App = () => {

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );

  useEffect(() => { // everytime cart changes (e.g. user buy more things), useEffect udpates localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  
  }, [cart])

  return (
    <>
      <Navbar cart={cart} />
      <Outlet context={[ cart, setCart]}/>
      <Footer />
    </>
  )
}

export default App;