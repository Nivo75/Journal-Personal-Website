import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/layout/Nav'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import AdventuresPage from './pages/AdventuresPage'
import StatsPage from './pages/StatsPage'
import GalleryPage from './pages/GalleryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/adventures" element={<AdventuresPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </BrowserRouter>
  )
}
