import { findUserByEmail, getUsers } from './storage.js';
import { passwordMatches } from './password.js';
import { createSession,getSession,renewSession,clearSession } from './token.js';
export async function login(email,password) { const user=findUserByEmail(email); if(!user || !(await passwordMatches(user,password))) throw new Error('The email or password you entered is incorrect.'); if(user.status!=='Active') throw new Error('This account is inactive.'); createSession(user); return user; }
export function currentUser() { let session=getSession(); if(!session) return null; if(session.refreshExpiresAt<Date.now()) { clearSession(); return null; } if(session.accessExpiresAt<Date.now()) session=renewSession(); return session ? (getUsers().find(user=>user.id===session.userId)||null) : null; }
export function requireAuth() { const user=currentUser(); if(!user) { location.replace('index.html'); return null; } return user; }
export function logout() { clearSession(); location.replace('index.html'); }
