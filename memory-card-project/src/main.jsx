import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';  // Import HashRouter
import './index.css';
import App from './components/App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>  {/* Wrap your App with HashRouter */}
      <App />
    </Router>
  </StrictMode>,
);