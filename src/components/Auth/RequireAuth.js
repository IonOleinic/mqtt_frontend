import { useLocation, Outlet, Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
function RequireAuth() {
  const { auth } = useAuth()
  const location = useLocation()
  return auth?.accessToken ? (
    <Outlet />
  ) : (
    <Navigate to={'/signin'} state={{ from: location }} replace />
  )
}

export default RequireAuth
