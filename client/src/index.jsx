import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import store from './Redux/Store/Store.js';
import { Provider } from 'react-redux';
import axios from 'axios';

axios.defaults.baseURL =  'http://localhost:3001'
// process.env.REACT_APP_API ||
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter outer>
      <App />
    </BrowserRouter>
  </Provider>
); 