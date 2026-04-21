import React from 'react';
import ReactDOM from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App';
import './index.css';

// Register GSAP plugins globally — must happen before any component uses them
gsap.registerPlugin(ScrollTrigger);

// Font load detection — removes body opacity gate once fonts are ready
document.fonts.ready.then(() => {
  document.body.classList.add('fonts-loaded');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);