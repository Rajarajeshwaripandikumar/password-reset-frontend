// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css'; // only import once
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Tailwind / global CSS - import BEFORE rendering

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
