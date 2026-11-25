export function validatePassword(password) { return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password); }
export async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.randomUUID) throw new Error('Web Crypto is unavailable. Open this app on localhost or HTTPS to use password features.');
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,'0')).join('');
}
export async function passwordMatches(user,password) { return user.passwordHash === await hashPassword(password,user.salt); }
