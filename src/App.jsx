import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import Portugal from './pages/Portugal'
import Italy from './pages/Italy'
import Iceland from './pages/Iceland'
import Spain from './pages/Spain'
import WorkWithMe from './pages/WorkWithMe'
import LakeComoSample from './pages/sample-itinerary/LakeComo'
import ItalySample from './pages/sample-itinerary/Italy'
import TripPortal from './pages/TripPortal'
import AdvisorLogin from './advisor/AdvisorLogin'
import AdvisorDashboard from './advisor/AdvisorDashboard'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/portugal" element={<Portugal />} />
        <Route path="/destinations/italy" element={<Italy />} />
        <Route path="/destinations/iceland" element={<Iceland />} />
        <Route path="/destinations/spain" element={<Spain />} />        <Route path="/work-with-me" element={<WorkWithMe />} />
        <Route path="/sample-itinerary" element={<Navigate to="/sample-itinerary/lake-como" replace />} />
        <Route path="/sample-itinerary/lake-como" element={<LakeComoSample />} />
        <Route path="/sample-itinerary/italy" element={<ItalySample />} />
        <Route path="/trip/:slug" element={<TripPortal />} />
        <Route path="/advisor" element={<AdvisorLogin />} />
        <Route path="/advisor/reset-password" element={<AdvisorLogin />} />
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
