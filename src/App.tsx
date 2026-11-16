import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GamesProvider } from './context/GamesContext'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Auth from './pages/Auth'
import Playing from './pages/Playing'
import GameDetail from './pages/GameDetail'
import Venue from './pages/Venue'

export default function App() {
  return (
    <AuthProvider>
      <GamesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Browse />} />
            <Route path="/games/:id" element={<GameDetail />} />
            <Route path="/venues/:id" element={<Venue />} />
            <Route path="/signin" element={<Auth mode="signin" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/my-games" element={<Navigate to="/my-games/playing" replace />} />
            <Route path="/my-games/playing" element={<Playing />} />
          </Routes>
        </BrowserRouter>
      </GamesProvider>
    </AuthProvider>
  )
}