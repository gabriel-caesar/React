import Topbar from './components/Topbar';
import DrawerMenu from './components/DrawerMenu';
import Footer from './components/Footer';
import { format } from 'date-fns';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useState, useEffect } from 'react';

export const globalContext = createContext(null);

function App() {
  const [openBars, setOpenBars] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [windowSize, setWindowSize] = useState(null);

  // this dynamically updates the date for the menu
  const date = new Date();
  const month = format(date, 'LLLL');

  const location = useLocation();

  // keeping track with the up to date window size
  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    // Set initial value immediately
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`bg-gray-100 flex flex-col justify-start items-center h-screen ${openBars && 'overflow-hidden'} relative`}
    >
      <globalContext.Provider
        value={{
          openBars,
          setOpenBars,
          month,
          isAdmin,
          setIsAdmin,
        }}
      >
        <Topbar />
        <DrawerMenu />
        <h1 className='fontCinzel font-bold text-lg z-2'>Ridgewood NJ</h1>
        <AnimatePresence mode='wait'>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className='w-full'
          >
            <Outlet
              context={{ openBars, setOpenBars, month, isAdmin, setIsAdmin }}
            />
          </motion.div>
        </AnimatePresence>
        <Footer />
      </globalContext.Provider>
    </div>
  );
}

export default App;
