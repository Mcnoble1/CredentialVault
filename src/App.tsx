import React from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;