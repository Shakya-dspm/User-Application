const USERS = 'peopleos.users'
const SESSION = 'peopleos.session'
const RESET = 'peopleos.passwordReset'

const starterUsers = [
  ['Ava Mitchell', 'admin@example.com', 'Admin@123', 'Admin'],
  ['Noah Williams', 'noah@example.com', 'Demo@123', 'Member'],
  ['Olivia Chen', 'olivia@example.com', 'Demo@123', 'Member'],
  ['Ethan Brooks', 'ethan@example.com', 'Demo@123', 'Member'],
  ['Sofia Patel', 'sofia@example.com', 'Demo@123', 'Member'],
  ['Liam Carter', 'liam@example.com', 'Demo@123', 'Member'],
  ['Mia Thompson', 'mia@example.com', 'Demo@123', 'Member'],
  ['Lucas Rivera', 'lucas@example.com', 'Demo@123', 'Member'],
]

function read(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback }
  catch { localStorage.removeItem(key); return fallback }
}
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); return value }
export function getUsers() { const users = read(USERS, []); return Array.isArray(users) ? users : [] }
export function saveUsers(users) { return write(USERS, users) }
export function initializeStorage(force = false) {
  let users = getUsers()
  if (force || !users.some(u => u.email === 'admin@example.com')) {
    const samples = starterUsers.map(([name, email, password, role], i) => ({ id: `USR-${String(i + 1).padStart(4, '0')}`, name, email, password, role, status: 'Active', createdAt: new Date(Date.now() - (i * 86400000 * 3)).toISOString() }))
    const custom = force ? [] : users.filter(u => !starterUsers.some(s => s[1] === u.email))
    saveUsers([...samples, ...custom])
  }
  return getUsers()
}
function token() { return `${crypto.randomUUID()}.${btoa(`${Date.now()}`)}` }
export function createSession(user) {
  const session = { userId: user.id, accessToken: token(), refreshToken: token(), expiresAt: Date.now() + 15 * 60 * 1000 }
  write(SESSION, session); return session
}
export function getSession() { return read(SESSION, null) }
export function getCurrentUser() {
  let session = getSession(); if (!session) return null
  if (session.expiresAt <= Date.now()) { if (!session.refreshToken) { logout(); return null } session = { ...session, accessToken: token(), expiresAt: Date.now() + 15 * 60 * 1000 }; write(SESSION, session) }
  return getUsers().find(u => u.id === session.userId) || null
}
export function logout() { localStorage.removeItem(SESSION) }
export function registerUser({ name, email, password }) {
  const users = getUsers(); if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) throw Error('An account with this email already exists.')
  const user = { id: `USR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, name, email: email.toLowerCase(), password, role: 'Member', status: 'Active', createdAt: new Date().toISOString() }
  saveUsers([user, ...users]); return user
}
export function requestReset(email) {
  const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) throw Error('No account was found with that email address.')
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  write(RESET, { userId: user.id, otp, expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0, verified: false })
  return otp
}
export function verifyReset(otp) {
  const reset = read(RESET, null)
  if (!reset) throw Error('Request a new code to continue.')
  if (reset.expiresAt < Date.now()) { localStorage.removeItem(RESET); throw Error('That code has expired. Request a new one.') }
  if (reset.attempts >= 5) { localStorage.removeItem(RESET); throw Error('Too many attempts. Request a new code.') }
  if (reset.otp !== otp) { write(RESET, { ...reset, attempts: reset.attempts + 1 }); throw Error('That code is not correct.') }
  write(RESET, { ...reset, verified: true }); return true
}
export function resetPassword(password) {
  const reset = read(RESET, null); if (!reset?.verified || reset.expiresAt < Date.now()) throw Error('Verify a valid code first.')
  saveUsers(getUsers().map(u => u.id === reset.userId ? { ...u, password } : u)); localStorage.removeItem(RESET)
}
