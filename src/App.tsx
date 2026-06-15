import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <BrowserRouter>
      <Header onSettingsClick={() => setShowSettings(true)} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home showSettings={showSettings} setShowSettings={setShowSettings} />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
