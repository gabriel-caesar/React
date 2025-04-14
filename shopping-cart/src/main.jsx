import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ErrorPage from './routes/ErrorPage';
import HomePage from './routes/HomePage';
import CartPage from './routes/CartPage';
import Checkout from './routes/Checkout'
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
        element: <CartPage />
      },
      {
        path: 'boxcart/checkout',
        element: <Checkout />
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
