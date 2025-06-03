import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/reusable_components/Loading';
import Login from './routes/Login';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useReducer, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function reducer(state, action) {
  switch (action.type) {
    case 'update-user':
      return action.payload;
    default:
      return state;
  }
}

const App = () => {
  // current user from auth
  const [authUser, setAuthUser] = useState(null);

  // current user from BoxCart
  const [userObject, dispatch] = useReducer(reducer, null);

  // flag to signal that the route is changing to 'checkout'
  const [goToCheckout, setGoToCheckout] = useState(false);

  // flag to signal if the user is not logged
  const [isUserLogged, setIsUserLogged] = useState(false);

  // bridge to tell 'signup' if 'fill-profile' is ready to be rendered
  const [bridge, setBridge] = useState(false);

  // fetches the custom user object
  const fetchUser = async () => {
    const userBeingFetched = await getDoc(doc(db, 'users', authUser.uid));
    const thisUser = userBeingFetched.data();
    setIsUserLogged(true);
    return dispatch({ type: 'update-user', payload: thisUser }); // updates the user object
  };

  // sets current user to a state when auth finishes fetching for it
  // if only done like `setUser(auth.currentUser)` React wouldn't
  // know when to re-render to update the components for a valid current user
  useEffect(() => {
    const observer = onAuthStateChanged(auth, (user) => {
      setAuthUser(user); // helps react re-render
    });

    return () => observer();
  }, []);

  // when user exists (finish being fetched from firebase) then execute fetchUser()
  useEffect(() => {
    if (authUser) fetchUser();
  }, [authUser]);

  // only render the components if userObject is fetched (exists)
  // if the code is not provided with this check it will enter
  // a race condition, which crashes the website when fetching
  // for the userObject.cart if reloaded outside HomePage.jsx
  return (
    <>
      {isUserLogged ? (
        <div style={{ backgroundColor: '#e3f6f5', height: '100vh' }}>
          {userObject ? (
            <>
              <Navbar
                userObject={userObject}
                setGoToCheckout={setGoToCheckout}
                setIsUserLogged={setIsUserLogged}
                setBridge={setBridge}
              />
              <Outlet
                context={[userObject, dispatch, goToCheckout, setGoToCheckout, isUserLogged]}
              />
              <Footer />
            </>
          ) : (
            <Loading marginTop={'18rem'} />
          )}
        </div>
      ) : (
        <>  
          <Navbar
            userObject={userObject}
            setGoToCheckout={setGoToCheckout}
            setIsUserLogged={setIsUserLogged}
            setBridge={setBridge}
          />
          <Outlet context={[userObject, dispatch, bridge, setBridge]} />
          <Footer />
        </>
      )}
    </>
  );
};

export default App;
