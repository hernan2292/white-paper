import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Technology from './components/Technology';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Services />
      <Features />
      <Pricing />
      <Technology />
      <Footer />
    </div>
  );
}

export default App;
