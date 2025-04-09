import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import Buggs from './components/Buggs.jsx';
import BuggsDesc from './components/BuggsDesc.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'buggs',
    element: <Buggs />,
    children: [{ path: 'buggsDesc', element: <BuggsDesc /> }],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
