import React from 'react';
import ReactDOM from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import App from './App';
import './index.css';
import { preloadPhaseAssets } from './utils/preload';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

ScrollTrigger.defaults({
  scroller: document.body,
  invalidateOnRefresh: true,
});

preloadPhaseAssets();

document.fonts?.ready.then(() => {
  document.body.classList.add('fonts-loaded');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
