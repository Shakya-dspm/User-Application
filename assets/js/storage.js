import { KEYS, DEMO_USERS } from './config.js';
import { hashPassword } from './password.js';

function read(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { localStorage.removeItem(key); return fallback; }
}
export const getUsers = () => {
  const data = read(KEYS.users, []);
  return Array.isArray(data) ? data.filter(user => user && typeof user.id === 'string' && typeof user.name === 'string' && typeof user.email === 'string') : [];
};
export const saveUsers = users => localStorage.setItem(KEYS.users, JSON.stringify(users));
export const findUserByEmail = email => getUsers().find(user => user.email.toLowerCase() === email.trim().toLowerCase());
export async function initializeUsers(force = false) {
  const storedUsers = getUsers();
  if (!force && storedUsers.length) return;
  Object.values(KEYS).forEach(key => { if (key !== KEYS.users) localStorage.removeItem(key); });
  const now = Date.now();
  const users = await Promise.all(DEMO_USERS.map(async ([name,email,password,role], i) => ({
    id: `usr_${crypto.randomUUID()}`, name, email, salt: crypto.randomUUID(), passwordHash: '', createdAt: new Date(now - (DEMO_USERS.length - i) * 86400000).toISOString(), status: 'Active', role
  })));
  await Promise.all(users.map(async (user, i) => { user.passwordHash = await hashPassword(DEMO_USERS[i][2], user.salt); }));
  saveUsers(users);
}
export async function createUser(name,email,password) {
  if (findUserByEmail(email)) throw new Error('An account with this email already exists.');
  const salt = crypto.randomUUID();
  const user = { id: `usr_${crypto.randomUUID()}`, name: name.trim(), email: email.trim().toLowerCase(), salt, passwordHash: await hashPassword(password,salt), createdAt: new Date().toISOString(), status:'Active', role:'Member' };
  saveUsers([...getUsers(), user]); return user;
}
export function updateUser(updated) { saveUsers(getUsers().map(user => user.id === updated.id ? updated : user)); }
