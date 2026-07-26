import { GoogleOAuthProvider } from '@react-oauth/google'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { fetchMe, loginWithGoogleCredential, updateMe } from '../services/auth'
import { setAuthToken } from '../services/api'
import { disconnectSocket } from '../services/socket'
import { readStoredToken, writeStoredToken } from '../utils/storage'

const AuthContext = createContext(null)
export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || ''

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(readStoredToken())

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const me = await fetchMe(token)
        setUser(me)
      } catch (error) {
        console.error('Khởi tạo xác thực thất bại:', error)
        const status = error?.response?.status
        if (status === 401) {
          writeStoredToken(null)
          setAuthToken(null)
          setToken(null)
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [token])

  async function loginWithGoogle(credential) {
    try {
      const result = await loginWithGoogleCredential(credential)
      if (!result?.access_token) {
        throw new Error('Phản hồi đăng nhập Google không có access token.')
      }

      writeStoredToken(result.access_token)
      setAuthToken(result.access_token)
      setToken(result.access_token)
      setUser(result.user)

      try {
        const me = await fetchMe(result.access_token)
        setUser(me)
      } catch (error) {
        console.error('Đồng bộ /auth/me sau đăng nhập thất bại:', error)
      }

      return result
    } catch (error) {
      console.error('Đăng nhập Google thất bại:', error)
      throw error
    }
  }

  async function refreshUser() {
    if (!token) return null
    try {
      const me = await fetchMe(token)
      setUser(me)
      return me
    } catch (error) {
      console.error('Làm mới người dùng thất bại:', error)
      throw error
    }
  }

  async function saveProfile(payload) {
    const updated = await updateMe(payload, token)
    setUser(updated)
    return updated
  }

  function logout() {
    writeStoredToken(null)
    setAuthToken(null)
    disconnectSocket()
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      loginWithGoogle,
      refreshUser,
      saveProfile,
      logout,
      setUser,
    }),
    [loading, token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthShell({ children }) {
  if (!googleClientId) {
    return children
  }

  return <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
