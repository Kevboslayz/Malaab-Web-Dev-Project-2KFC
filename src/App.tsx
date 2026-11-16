import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GamesProvider } from './context/GamesContext'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Auth from './pages/Auth'
import Playing from './pages/Playing'
import CreateGame from './pages/CreateGame'
import Organising from './pages/Organising'
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
            <Route path="/create" element={<CreateGame />} />
            <Route path="/signin" element={<Auth mode="signin" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/my-games" element={<Navigate to="/my-games/playing" replace />} />
            <Route path="/my-games/organising" element={<Organising />} />
            <Route path="/my-games/playing" element={<Playing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </GamesProvider>
    </AuthProvider>
  )
}
