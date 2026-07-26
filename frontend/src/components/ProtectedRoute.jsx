import { Navigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { LoadingScreen } from './UI'

export function ProtectedRoute({ children, role, requireProfile = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireProfile && !user.profile_complete) {
    return <Navigate to="/complete-profile" replace />
  }

  if (role && user.role !== role && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
