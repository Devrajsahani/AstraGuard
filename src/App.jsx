import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import FirePage from './pages/FirePage'
import TaxPage from './pages/TaxPage'
import PortfolioPage from './pages/PortfolioPage'
import DashboardPage from './pages/DashboardPage'
import Onboard from './pages/Onboard'

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-void w-full min-w-0 overflow-x-hidden text-white font-sans selection:bg-[#45f3ff]/30 selection:text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboard" element={<Onboard />} />
          <Route path="/fire" element={<FirePage />} />
          <Route path="/tax" element={<TaxPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  )
}
