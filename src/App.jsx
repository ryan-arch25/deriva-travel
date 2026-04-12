import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import Portugal from './pages/Portugal'
import Italy from './pages/Italy'
import Iceland from './pages/Iceland'
import Spain from './pages/Spain'
import WorkWithMe from './pages/WorkWithMe'
import AdvisorLogin from './advisor/AdvisorLogin'
import AdvisorDashboard from './advisor/AdvisorDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/portugal" element={<Portugal />} />
        <Route path="/destinations/italy" element={<Italy />} />
        <Route path="/destinations/iceland" element={<Iceland />} />
        <Route path="/destinations/spain" element={<Spain />} />        <Route path="/work-with-me" element={<WorkWithMe />} />
        <Route path="/advisor" element={<AdvisorLogin />} />
        <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
        <Route path="/advisor/playbook" element={<AdvisorDashboard />} />
        <Route path="/advisor/clients" element={<AdvisorDashboard />} />
        <Route path="/advisor/clients/:id" element={<AdvisorDashboard />} />
        <Route path="/advisor/affiliates" element={<AdvisorDashboard />} />
        <Route path="/advisor/research" element={<AdvisorDashboard />} />
        <Route path="/advisor/content" element={<AdvisorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
