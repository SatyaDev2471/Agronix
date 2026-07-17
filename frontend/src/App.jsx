import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Weather from './pages/Weather/Weather';
import MarketIntelligence from './pages/Market/MarketIntelligence';
import AIAssistant from './pages/AIAssistant/AIAssistant';
import History from './pages/History';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="weather" element={<Weather />} />
        <Route path="market" element={<MarketIntelligence />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="history" element={<History />} />
      </Route>
    </Routes>
  );
}

export default App;
