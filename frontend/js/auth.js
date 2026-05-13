// auth.js — Session management, login/logout
const auth = {
  TOKEN_KEY: 'cv_token',
  USER_KEY: 'cv_user',

  getToken() { return localStorage.getItem(this.TOKEN_KEY); },
  getUser() {
    try { return JSON.parse(localStorage.getItem(this.USER_KEY)); }
    catch { return null; }
  },
  isLoggedIn() { return !!this.getToken(); },

  setSession(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  logout() {
    this.clearSession();
    window.location.href = '../index.html';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '../pages/auth.html?redirect=' + encodeURIComponent(window.location.href);
      return false;
    }
    return true;
  },

  async refreshUser() {
    try {
      const data = await api.auth.me();
      if (data.user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch {
      this.clearSession();
    }
    return null;
  },

  getUserInitials(user) {
    if (!user) return '?';
    return (user.username || '?').slice(0, 2).toUpperCase();
  },

  renderAvatar(user, size = 'avatar-sm') {
    if (user?.avatar) {
      return `<img src="${user.avatar}" class="avatar ${size}" alt="${user.username}">`;
    }
    return `<div class="avatar ${size}" style="background:var(--surface2)">${this.getUserInitials(user)}</div>`;
  }
};

// Run on every protected page: populate nav user info
function initNavUser() {
  const user = auth.getUser();
  const navUserEl = document.getElementById('nav-user');
  const navLoginEl = document.getElementById('nav-login');
  if (user) {
    if (navUserEl) {
      navUserEl.classList.remove('hidden');
      navUserEl.innerHTML = auth.renderAvatar(user, 'avatar-sm');
      navUserEl.onclick = () => window.location.href = '../pages/profile.html';
    }
    if (navLoginEl) navLoginEl.classList.add('hidden');
  } else {
    if (navUserEl) navUserEl.classList.add('hidden');
    if (navLoginEl) navLoginEl.classList.remove('hidden');
  }
}

// Notification badge
async function initNotifBadge() {
  if (!auth.isLoggedIn()) return;
  const el = document.getElementById('notif-badge');
  if (!el) return;
  try {
    const { unreadCount } = await api.notifications.get();
    if (unreadCount > 0) el.style.display = 'block';
    else el.style.display = 'none';
  } catch {}
}
