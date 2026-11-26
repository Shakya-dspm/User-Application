const BASE_URL = 'https://api.freeprojectapi.com/api/UserApp';
const SESSION_KEY = 'peopledesk.apiSession';

export function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { sessionStorage.removeItem(SESSION_KEY); return null; }
}

function saveSession(value) {
  let data = value?.data;
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch { /* Keep the response message as the fallback. */ } }
  const source = data && typeof data === 'object' ? { ...value, ...data } : value;
  const token = source?.token || source?.accessToken || source?.jwtToken || source?.access_token;
  const user = source?.user || source?.customer || source?.profile || source;
  const session = { user: safeUser(user), token: typeof token === 'string' ? token : '' };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function safeUser(user = {}) {
  return {
    userId: user.userId ?? user.customerId ?? user.id ?? '',
    userName: user.userName ?? user.username ?? '',
    fullName: user.fullName ?? user.name ?? user.userName ?? '',
    emailId: user.emailId ?? user.email ?? '',
    role: user.role ?? '',
    projectName: user.projectName ?? '',
    createdDate: user.createdDate ?? user.createdAt ?? ''
  };
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getSession()?.token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  let response;
  try {
    response = await fetch(`${BASE_URL}/${path}`, {
      method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
  } catch {
    throw new Error('Could not reach the User App API. Check your connection and try again.');
  }
  const text = await response.text();
  let result;
  try { result = text ? JSON.parse(text) : null; }
  catch { result = text; }
  if (!response.ok) {
    const message = typeof result === 'string' ? result : result?.message || result?.title;
    throw new Error(message || `The API request failed (${response.status}).`);
  }
  if (result && typeof result === 'object' && result.result === false) {
    throw new Error(result.message || 'The API could not complete the request.');
  }
  return result;
}

export async function login(emailId, password) {
  const result = await request('login', { method: 'POST', body: { emailId, password } });
  return saveSession(result);
}

export async function createUser(fields) {
  const result = await request('CreateNewUser', { method: 'POST', body: fields });
  return result;
}

export function requestPasswordOtp(emailId) {
  return request(`send-reset-otp?emailId=${encodeURIComponent(emailId)}`, { method: 'POST' });
}

export function resetPassword(email, otp, newPassword) {
  return request('verify-otp-reset-password', {
    method: 'POST', body: { email, otp, newPassword }
  });
}

export async function findUsers({ query = '', page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams({ pageNumber: String(page), pageSize: String(pageSize) });
  if (query.trim()) params.set('searchText', query.trim());
  const result = await request(`searchUsers?${params}`);
  const rows = Array.isArray(result) ? result : result?.data;
  return {
    users: Array.isArray(rows) ? rows.map(safeUser) : [],
    total: Number(result?.totalRecords ?? result?.totalCount ?? result?.total ?? rows?.length ?? 0),
    page: Number(result?.pageNumber ?? page),
    pageSize: Number(result?.pageSize ?? pageSize)
  };
}

export function logout() { sessionStorage.removeItem(SESSION_KEY); }

export async function updatePassword(customerId, oldPassword, newPassword) {
  return request(`update-password/${encodeURIComponent(customerId)}`, {
    method: 'PUT', body: { existingPassword: oldPassword, newPassword }, auth: true
  });
}
