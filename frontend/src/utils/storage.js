let cachedToken = null

export function readStoredToken() {
  if (cachedToken) {
    return cachedToken
  }

  const token = localStorage.getItem('qs_token')
  if (!token) {
    return null
  }

  cachedToken = token.trim()
  return cachedToken && cachedToken.split('.').length === 3 ? cachedToken : null
}

export function writeStoredToken(token) {
  if (token) {
    cachedToken = token.trim()
    localStorage.setItem('qs_token', cachedToken)
  } else {
    cachedToken = null
    localStorage.removeItem('qs_token')
  }
}

export function clearStoredToken() {
  cachedToken = null
  localStorage.removeItem('qs_token')
}
