import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { action as logInAction } from './routes/Login';
import SignUp from './routes/SignUp';
import Login from './routes/Login';
import App from './App';
import ErrorPage from './routes/ErrorPage';
import HomePage from './routes/HomePage';
import CartPage from './routes/CartPage';
import Checkout from './routes/Checkout';
import RegisterProfile from './routes/RegisterProfile';
import Account from './routes/Account';
import ThankYou from './routes/ThankYou';
import './main.css';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'boxcart',
        element: <CartPage />,
        children: [
          {
            path: 'checkout',
            element: <Checkout />,
          },
        ],
      },
      {
        path: 'login',
        element: <Login />,
        action: logInAction,
      },
      {
        path: 'signup',
        element: <SignUp />,
        children: [
          {
            path: 'fill-profile',
            element: <RegisterProfile />,
          },
        ],
      },
      {
        path: 'account',
        element: <Account />
      },
      {
        path: 'thankyou',
        element: <ThankYou />
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
