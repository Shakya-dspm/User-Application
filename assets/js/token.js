import { ACCESS_TTL, REFRESH_TTL, KEYS } from './config.js';
const token = () => `${crypto.randomUUID()}.${crypto.randomUUID()}`;
export function createSession(user) { const now=Date.now(); const session={ userId:user.id, accessToken:token(), refreshToken:token(), accessExpiresAt:now+ACCESS_TTL, refreshExpiresAt:now+REFRESH_TTL }; localStorage.setItem(KEYS.session,JSON.stringify(session)); return session; }
export function getSession() { try { return JSON.parse(localStorage.getItem(KEYS.session)||'null'); } catch { clearSession(); return null; } }
export function clearSession() { localStorage.removeItem(KEYS.session); }
export function renewSession() { const session=getSession(); if(!session || session.refreshExpiresAt<Date.now()) { clearSession(); return null; } session.accessToken=token(); session.accessExpiresAt=Date.now()+ACCESS_TTL; localStorage.setItem(KEYS.session,JSON.stringify(session)); return session; }
