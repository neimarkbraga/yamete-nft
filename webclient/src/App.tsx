import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalsProvider } from './context/Globals';

import Home from './views/home';
import Profile from './views/profile';

function App() {

  return (
    <GlobalsProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Emi" element={<Profile id={0} />} />
            <Route path="/Hana" element={<Profile id={1} />} />
            <Route path="/Mana" element={<Profile id={2} />} />
            <Route path="/Miku" element={<Profile id={3} />} />
            <Route path="/Yui" element={<Profile id={4} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GlobalsProvider>
  );
}

export default App;
