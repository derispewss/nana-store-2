import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import './input.css';

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;