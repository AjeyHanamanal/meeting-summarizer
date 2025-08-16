import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import { SummaryProvider } from './context/SummaryContext';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SummaryProvider>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </SummaryProvider>
    </div>
  );
}

export default App;
