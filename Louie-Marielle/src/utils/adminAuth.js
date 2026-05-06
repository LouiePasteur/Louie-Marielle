const TOKEN_COOKIE_NAME = 'admin_token'
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000

function encodeBase64(value) {
  return btoa(unescape(encodeURIComponent(value)))
}

function decodeBase64(value) {
  return decodeURIComponent(escape(atob(value)))
}

function getCookie(name) {
  const escapedName = name.replace(/([.*+?^${}()|[\]\\])/g, '\\$1')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name, value, expiresAtMs) {
  const expires = new Date(expiresAtMs).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function clearCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

function createSignature(payloadBase64) {
  const raw = `${payloadBase64}.${getExpectedUsername()}.${getExpectedPassword()}`
  return encodeBase64(raw)
}

function getExpectedUsername() {
  return (typeof __ADMIN_USERNAME__ !== 'undefined' ? __ADMIN_USERNAME__ : '').trim()
}

function getExpectedPassword() {
  return (typeof __ADMIN_PASSWORD__ !== 'undefined' ? __ADMIN_PASSWORD__ : '').trim()
}

export function validateCredentials(username, password) {
  return username === getExpectedUsername() && password === getExpectedPassword()
}

export function createAndStoreToken(username) {
  const expiresAt = Date.now() + TOKEN_LIFETIME_MS
  const payload = { username, exp: expiresAt }
  const payloadBase64 = encodeBase64(JSON.stringify(payload))
  const signature = createSignature(payloadBase64)
  const token = `${payloadBase64}.${signature}`
  setCookie(TOKEN_COOKIE_NAME, token, expiresAt)
}

export function clearAuthToken() {
  clearCookie(TOKEN_COOKIE_NAME)
}

export function hasValidAuthToken() {
  const token = getCookie(TOKEN_COOKIE_NAME)
  if (!token) return false

  const parts = token.split('.')
  if (parts.length !== 2) {
    clearAuthToken()
    return false
  }

  const [payloadBase64, signature] = parts

  if (signature !== createSignature(payloadBase64)) {
    clearAuthToken()
    return false
  }

  try {
    const payload = JSON.parse(decodeBase64(payloadBase64))
    if (!payload.exp || Date.now() > payload.exp) {
      clearAuthToken()
      return false
    }
    return true
  } catch (error) {
    clearAuthToken()
    return false
  }
}
