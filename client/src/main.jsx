import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Global styles (create this for your dark theme/custom GSAP tweaks)
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);