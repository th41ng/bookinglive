import axios from 'axios'

import { readStoredToken, clearStoredToken } from '../utils/storage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: false,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

const initialToken = readStoredToken()
if (initialToken) {
  setAuthToken(initialToken)
}

api.interceptors.request.use((config) => {
  const token = readStoredToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearStoredToken()
      setAuthToken(null)
    }
    return Promise.reject(error)
  }
)

export default api
