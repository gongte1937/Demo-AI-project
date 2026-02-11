import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Apply saved theme before first render to avoid flash
const savedTheme = (() => {
  try {
    const stored = JSON.parse(localStorage.getItem('echolater-theme') ?? '{}');
    return stored?.state?.theme ?? 'light';
  } catch {
    return 'light';
  }
})();
if (savedTheme === 'dark') document.documentElement.classList.add('dark');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
