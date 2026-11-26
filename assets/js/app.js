import { createUser, findUsers, getSession, login, logout, requestPasswordOtp, resetPassword, updatePassword } from './api.js';

const app = document.querySelector('#app');
const page = document.body.dataset.page;
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const date = value => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)) : '—';
const brand = '<a class="brand" href="index.html"><span class="brand-mark"><i class="bi bi-people-fill"></i></span>User<span>Desk</span></a>';
const user = () => getSession()?.user;

function authLayout(title, subtitle, content, footer = '') {
  app.innerHTML = `<section class="auth-shell"><div class="auth-visual"><div class="visual-top">${brand}<span class="online"><i></i> Connected to User App API</span></div><div class="visual-copy"><div class="visual-kicker">USER MANAGEMENT, SIMPLIFIED</div><h1>Your people,<br>all in <em>one place.</em></h1><p>Browse and manage user accounts from the connected project API.</p></div><div class="visual-bottom">UserDesk <span>Powered by FreeProjectAPI</span></div></div><div class="auth-side"><div class="auth-mobile-brand">${brand}</div><div class="auth-card"><div class="eyebrow">USER APP</div><h2>${title}</h2><p class="muted">${subtitle}</p><div id="form-error" class="form-alert" role="alert" hidden></div>${content}${footer}</div><div class="auth-legal">Data is loaded from the User App service.</div></div></section>`;
}

function showError(error) {
  const target = document.querySelector('#form-error');
  if (target) { target.textContent = error.message || String(error); target.hidden = false; }
}

function renderLogin() {
  authLayout('Sign in', 'Use your User App account to continue.', `<form id="login-form" class="app-form"><div class="mb-3"><label class="form-label" for="emailId">Email address</label><input class="form-control" id="emailId" type="email" autocomplete="email" required></div><div class="mb-2"><label class="form-label" for="password">Password</label><input class="form-control" id="password" type="password" autocomplete="current-password" required></div><div class="form-between"><span></span><a href="forgot-password.html">Forgot password?</a></div><button class="btn btn-primary w-100 submit-btn">Sign in <i class="bi bi-arrow-right"></i></button></form>`, '<div class="auth-switch">Need an account? <a href="register.html">Create one</a></div>');
  document.querySelector('#login-form').onsubmit = async event => {
    event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); button.disabled = true;
    try { await login(form.querySelector('#emailId').value.trim(), form.querySelector('#password').value); location.href = 'dashboard.html'; }
    catch (error) { showError(error); }
    finally { button.disabled = false; }
  };
}

function renderRegister() {
  authLayout('Create account', 'Create a user through the connected API.', `<form id="register-form" class="app-form"><div class="mb-3"><label class="form-label" for="fullName">Full name</label><input class="form-control" id="fullName" autocomplete="name" required></div><div class="mb-3"><label class="form-label" for="emailId">Email address</label><input class="form-control" id="emailId" type="email" autocomplete="email" required></div><div class="mb-4"><label class="form-label" for="password">Password</label><input class="form-control" id="password" type="password" autocomplete="new-password" required></div><button class="btn btn-primary w-100 submit-btn">Create account <i class="bi bi-arrow-right"></i></button></form>`, '<div class="auth-switch">Already registered? <a href="index.html">Sign in</a></div>');
  document.querySelector('#register-form').onsubmit = async event => {
    event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('button'); button.disabled = true;
    const fields = { userId: 0, fullName: form.querySelector('#fullName').value.trim(), emailId: form.querySelector('#emailId').value.trim(), password: form.querySelector('#password').value };
    try { await createUser(fields); location.href = 'index.html'; }
    catch (error) { showError(error); }
    finally { button.disabled = false; }
  };
}

function renderForgot() {
  authLayout('Reset your password', 'We will send a one time code to the email on your account.', `<form id="forgot-form" class="app-form"><div class="mb-4"><label class="form-label" for="email">Email address</label><input class="form-control" id="email" type="email" autocomplete="email" required></div><button class="btn btn-primary w-100 submit-btn">Send reset code <i class="bi bi-arrow-right"></i></button></form>`, '<div class="auth-switch"><a href="index.html"><i class="bi bi-arrow-left"></i> Back to sign in</a></div>');
  document.querySelector('#forgot-form').onsubmit = async event => {
    event.preventDefault(); const email = event.currentTarget.querySelector('#email').value.trim(); const button = event.currentTarget.querySelector('button'); button.disabled = true;
    try {
      await requestPasswordOtp(email);
      sessionStorage.setItem('peopledesk.resetEmail', email);
      authLayout('Enter your code', `Enter the code sent to ${esc(email)} and choose a new password.`, `<form id="reset-form" class="app-form"><div class="mb-3"><label class="form-label" for="otp">One time code</label><input class="form-control" id="otp" inputmode="numeric" autocomplete="one-time-code" required></div><div class="mb-4"><label class="form-label" for="newPassword">New password</label><input class="form-control" id="newPassword" type="password" autocomplete="new-password" required></div><button class="btn btn-primary w-100 submit-btn">Reset password <i class="bi bi-arrow-right"></i></button></form>`, '<div class="auth-switch"><a href="forgot-password.html">Request another code</a></div>');
      document.querySelector('#reset-form').onsubmit = async resetEvent => {
        resetEvent.preventDefault(); const form = resetEvent.currentTarget; const submit = form.querySelector('button'); submit.disabled = true;
        try { await resetPassword(email, form.querySelector('#otp').value.trim(), form.querySelector('#newPassword').value); sessionStorage.removeItem('peopledesk.resetEmail'); location.href = 'index.html'; }
        catch (error) { showError(error); submit.disabled = false; }
      };
    } catch (error) { showError(error); button.disabled = false; }
  };
}

function shell(active, title, subtitle, content) {
  const current = user();
  app.innerHTML = `<div class="app-shell"><aside class="sidebar"><div class="sidebar-brand">${brand}<button class="mobile-close" id="nav-close" aria-label="Close menu"><i class="bi bi-x-lg"></i></button></div><div class="workspace-label">USER APP</div><nav class="side-nav"><a class="${active === 'dashboard' ? 'active' : ''}" href="dashboard.html"><i class="bi bi-grid-1x2"></i> Overview</a><a class="${active === 'users' ? 'active' : ''}" href="users.html"><i class="bi bi-people"></i> Users</a></nav><div class="sidebar-bottom"><div class="workspace-label">ACCOUNT</div><nav class="side-nav"><a class="${active === 'profile' ? 'active' : ''}" href="change-password.html"><i class="bi bi-shield-lock"></i> Security</a></nav><div class="side-user"><span class="avatar">${esc((current?.fullName || 'U').slice(0, 1).toUpperCase())}</span><span><strong>${esc(current?.fullName || current?.userName || 'Signed in')}</strong><small>${esc(current?.emailId)}</small></span><button id="logout" aria-label="Sign out"><i class="bi bi-box-arrow-right"></i></button></div></div></aside><div class="main-panel"><header class="topbar"><button class="menu-toggle" id="menu-toggle" aria-label="Open navigation"><i class="bi bi-list"></i></button><div class="breadcrumb-label">User App <i class="bi bi-chevron-right"></i> <strong>${esc(title)}</strong></div><div class="topbar-right"><span class="date-label"><i class="bi bi-calendar3"></i> ${date(new Date())}</span></div></header><section class="page-content"><div class="page-heading"><div><div class="eyebrow">CONNECTED API DATA</div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>${active === 'users' ? '<a class="btn btn-primary add-user" href="register.html"><i class="bi bi-plus-lg"></i> Add user</a>' : ''}</div>${content}<footer class="page-footer">UserDesk <span>FreeProjectAPI User App</span></footer></section></div><div class="sidebar-scrim" id="sidebar-scrim"></div></div>`;
  document.querySelector('#logout').onclick = () => { logout(); location.href = 'index.html'; };
  document.querySelector('#menu-toggle').onclick = () => document.body.classList.add('nav-open');
  document.querySelector('#nav-close').onclick = document.querySelector('#sidebar-scrim').onclick = () => document.body.classList.remove('nav-open');
}

function requireSession() {
  if (!user()) { location.replace('index.html'); return false; }
  return true;
}

async function renderDashboard() {
  shell('dashboard', `Welcome, ${user().fullName || user().userName || 'back'}`, 'A live overview of user records from the User App API.', '<div id="dashboard-content"><div class="panel"><p>Loading user records…</p></div></div>');
  try {
    const result = await findUsers({ page: 1, pageSize: 8 });
    document.querySelector('#dashboard-content').innerHTML = `<div class="stats-grid"><article class="stat-card"><span class="stat-icon lilac"><i class="bi bi-people"></i></span><span class="stat-label">TOTAL API RECORDS</span><strong>${result.total.toLocaleString()}</strong><small>Reported by searchUsers</small></article><article class="stat-card"><span class="stat-icon mint"><i class="bi bi-person-badge"></i></span><span class="stat-label">CURRENT ACCOUNT</span><strong>${esc(user().role || 'User')}</strong><small>${esc(user().projectName || 'Project not provided')}</small></article><article class="stat-card"><span class="stat-icon peach"><i class="bi bi-cloud-check"></i></span><span class="stat-label">API STATUS</span><strong>Online</strong><small>Latest request succeeded</small></article></div><section class="panel recent-panel"><div class="panel-heading"><div><div class="eyebrow">API RESULTS</div><h3>Recently listed users</h3></div><a href="users.html">Browse users <i class="bi bi-arrow-right"></i></a></div><div class="recent-list">${result.users.slice(0, 5).map(row => `<div class="recent-row"><span class="avatar">${esc((row.fullName || row.userName || '?').slice(0, 1).toUpperCase())}</span><span><strong>${esc(row.fullName || row.userName || 'Unnamed user')}</strong><small>${esc(row.emailId || 'No email')}</small></span><small class="recent-date">${esc(row.projectName || '')}</small></div>`).join('')}</div></section><p class="field-hint">The API includes credential fields in its raw response. This interface drops those fields before rendering user records.</p>`;
  } catch (error) { document.querySelector('#dashboard-content').innerHTML = `<div class="form-alert" role="alert">${esc(error.message)}</div>`; }
}

function renderUserRows(rows) {
  if (!rows.length) return '<tr><td colspan="5"><div class="empty-state"><span><i class="bi bi-person-x"></i></span><strong>No users found</strong><p>Try a different search.</p></div></td></tr>';
  return rows.map(row => `<tr><td><div class="person-cell"><span class="avatar">${esc((row.fullName || row.userName || '?').slice(0, 1).toUpperCase())}</span><span><strong>${esc(row.fullName || 'Unnamed user')}</strong><small>${esc(row.userName)}</small></span></div></td><td>${esc(row.emailId || '—')}</td><td>${esc(row.role || '—')}</td><td>${esc(row.projectName || '—')}</td><td>${date(row.createdDate)}</td></tr>`).join('');
}

function renderUsers() {
  shell('users', 'Users', 'Search and browse user records returned by the API.', `<section class="panel table-panel"><div class="table-tools"><label class="search-box"><i class="bi bi-search"></i><input id="search" type="search" placeholder="Search users…" aria-label="Search users"></label><label class="page-size-label">Page size <select id="page-size"><option>20</option><option>10</option><option>50</option></select></label></div><div id="users-error" class="form-alert" role="alert" hidden></div><div class="table-responsive"><table class="table user-table"><thead><tr><th>NAME</th><th>EMAIL</th><th>ROLE</th><th>PROJECT</th><th>CREATED</th></tr></thead><tbody id="user-rows"><tr><td colspan="5">Loading users…</td></tr></tbody></table></div><div class="table-pagination"><span id="page-info"></span><div><button id="prev" aria-label="Previous page"><i class="bi bi-chevron-left"></i></button><span id="page-number"></span><button id="next" aria-label="Next page"><i class="bi bi-chevron-right"></i></button></div></div></section><p class="field-hint">Credential and refresh-token fields are discarded by the client mapper and never shown in the page.</p>`);
  let pageNumber = 1; let timer;
  const draw = async () => {
    const query = document.querySelector('#search').value; const size = Number(document.querySelector('#page-size').value); const rows = document.querySelector('#user-rows');
    rows.innerHTML = '<tr><td colspan="5">Loading users…</td></tr>'; document.querySelector('#users-error').hidden = true;
    try {
      const result = await findUsers({ query, page: pageNumber, pageSize: size }); pageNumber = result.page;
      rows.innerHTML = renderUserRows(result.users);
      const pages = Math.max(1, Math.ceil(result.total / result.pageSize));
      document.querySelector('#page-info').textContent = `${result.total.toLocaleString()} matching records`;
      document.querySelector('#page-number').textContent = `${pageNumber} / ${pages}`;
      document.querySelector('#prev').disabled = pageNumber <= 1; document.querySelector('#next').disabled = pageNumber >= pages;
    } catch (error) { rows.innerHTML = ''; const box = document.querySelector('#users-error'); box.textContent = error.message; box.hidden = false; }
  };
  document.querySelector('#search').oninput = () => { clearTimeout(timer); timer = setTimeout(() => { pageNumber = 1; draw(); }, 300); };
  document.querySelector('#page-size').onchange = () => { pageNumber = 1; draw(); };
  document.querySelector('#prev').onclick = () => { pageNumber -= 1; draw(); };
  document.querySelector('#next').onclick = () => { pageNumber += 1; draw(); };
  draw();
}

function renderPassword() {
  const current = user();
  shell('profile', 'Account security', 'Update the password for the signed-in API account.', `<section class="panel password-panel"><div id="form-error" class="form-alert" role="alert" hidden></div><form id="password-form" class="app-form"><div class="mb-3"><label class="form-label" for="oldPassword">Current password</label><input class="form-control" id="oldPassword" type="password" autocomplete="current-password" required></div><div class="mb-4"><label class="form-label" for="newPassword">New password</label><input class="form-control" id="newPassword" type="password" autocomplete="new-password" required></div><button class="btn btn-primary submit-btn">Update password</button></form></section>`);
  document.querySelector('#password-form').onsubmit = async event => {
    event.preventDefault(); const form = event.currentTarget;
    try { await updatePassword(current.userId, form.querySelector('#oldPassword').value, form.querySelector('#newPassword').value); logout(); location.href = 'index.html'; }
    catch (error) { showError(error); }
  };
}

if (page === '404') {
  app.innerHTML = `<section class="not-found">${brand}<span>404</span><h1>Page not found</h1><p>This page is not part of the User App API workflow.</p><a class="btn btn-primary" href="index.html">Sign in</a></section>`;
} else if (page === 'login') {
  if (user()) location.replace('dashboard.html'); else renderLogin();
} else if (page === 'register') renderRegister();
else if (page === 'forgot') renderForgot();
else if (!requireSession()) { /* redirect to sign in */ }
else if (page === 'dashboard') renderDashboard();
else if (page === 'users') renderUsers();
else if (page === 'profile') { location.replace('dashboard.html'); }
else if (page === 'password') renderPassword();
else { location.replace('dashboard.html'); }
