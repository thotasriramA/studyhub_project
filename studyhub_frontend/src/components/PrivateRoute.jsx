import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center pt-20 text-insta-gray">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
