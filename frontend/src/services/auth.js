import api from './api'

function getAuthHeaders(token) {
  if (!token) {
    return {}
  }

  return { Authorization: `Bearer ${token}` }
}

export async function loginWithGoogleCredential(credential) {
  const { data } = await api.post('/auth/google', { credential })
  return data
}

export async function fetchMe(token) {
  const { data } = await api.get('/auth/me', { headers: getAuthHeaders(token) })
  return data.user
}

export async function updateMe(payload, token) {
  const { data } = await api.put('/me', payload, { headers: getAuthHeaders(token) })
  return data.user
}
