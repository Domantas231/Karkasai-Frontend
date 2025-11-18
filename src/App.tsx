import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Navbar } from './shared/navmenu/Navbar';
import { Footer } from './shared/footer/Footer';

import About from './about/About';
import Groups from './groups/Groups';
import NewGroup from './newGroup/newGroup';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="flex-shrink-0">
        <Routes>
          <Route path="/" element={<About />}/>
          <Route path="/groups" element={<Groups />}/>
          <Route path="/new-group" element={<NewGroup />}/>
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App;