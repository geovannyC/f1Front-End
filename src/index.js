import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Home from "./main/home/home";
import { Test } from "./main/testpage/test";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Test />
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
