import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<div>마이그레이션 완료되었습니다!</div>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
