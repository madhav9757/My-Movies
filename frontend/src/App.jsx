import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Header from './components/header/header';
import Footer from './components/footer/footer';
import './App.css';

function App() {
  return (
    <div className="main-container">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;