import React from 'react';
import {
  BrowserRouter as Router, 
  Routes,
  Route
} from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './components/pages/Home';
import About from './components/pages/About';
import FAQ from './components/pages/FAQ';
import NotFound from './components/pages/NotFound';
import MarketPlace from './components/pages/MarketPlace';

import './App.css';
import SingleProperty from './components/pages/SingleProperty';

import { EthPriceProvider } from './context/EthPriceContext';

function App() {
  return (
    <div className="App">
      <Router>
        <EthPriceProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/marketplace" element={<MarketPlace />} />
              <Route path="/property/:id" element={<SingleProperty />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </EthPriceProvider>
      </Router>
    </div>
  );
}

export default App;
