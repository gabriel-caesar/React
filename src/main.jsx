import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { format } from 'date-fns';
import './css/index.css'
import App from './App.jsx'
import General from './routes/General.jsx'
import MonthlyMenu from './routes/MonthlyMenu.jsx'

// this dynamically updates the date for the menu
const date = new Date();
const month = format(date, 'LLLL');

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <General />,
        index: true,
      },
      {
        path: `${month.toLowerCase()}-menu`,
        element: <MonthlyMenu />,
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
