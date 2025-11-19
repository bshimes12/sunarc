import React from 'react';
import SolarCalculator from './components/SolarCalculator';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Solar Noon & Solstice</h1>
        <p>Compare today's sun height with the Summer Solstice.</p>
      </header>
      <main>
        <SolarCalculator />
      </main>
    </div>
  );
}

export default App;
