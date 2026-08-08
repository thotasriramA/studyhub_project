import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './context/AuthContext'
import CommunityPage from './pages/CommunityPage'
import Communities from './pages/Communities'
import CreatePost from './pages/CreatePost'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Signup from './pages/Signup'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-insta-gray">Loading...</div>
  }

  return (
    <>
      {user && <Navbar />}
      <main className={user ? 'pt-20' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/communities"
            element={
              <PrivateRoute>
                <Communities />
              </PrivateRoute>
            }
          />
          <Route
            path="/community/:slug"
            element={
              <PrivateRoute>
                <CommunityPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </>
  )
}
