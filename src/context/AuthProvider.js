import { createContext, useState, useEffect } from 'react'
import useLogout from '../hooks/useLogout'
const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const logout = useLogout()
  const [auth, setAuth] = useState({})
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem('persist')) || false
  )
  useEffect(() => {
    if (!persist) {
      logout()
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist))
  }, [persist])

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
