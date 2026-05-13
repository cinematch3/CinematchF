// main.js — Shared page initialization and common page components

function renderNav(activePage = '') {
  const user = auth.getUser();
  return `
    <nav class="nav">
      <a href="../index.html" class="nav-logo">CINEVERSE.</a>
      <div class="nav-links">
        <a href="browse.html" class="nav-link ${activePage === 'browse' ? 'active' : ''}">Browse</a>
        <a href="friends.html" class="nav-link ${activePage === 'friends' ? 'active' : ''}">Friends</a>
      </div>
      <div class="nav-actions">
        <div style="position:relative">
          <button class="btn btn-ghost btn-icon" onclick="window.location.href='notifications.html'" title="Notifications">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <div id="notif-badge" class="notif-dot" style="display:none"></div>
        </div>
        ${user
          ? `<button onclick="window.location.href='profile.html'" style="background:none;border:none;cursor:pointer;padding:0">
               ${auth.renderAvatar(user, 'avatar-sm')}
             </button>`
          : `<button class="btn btn-primary btn-sm" onclick="window.location.href='../index.html'">Sign In</button>`
        }
      </div>
    </nav>`;
}

function renderSidebar(activePage = '') {
  const items = [
    { id: 'browse', label: 'For You', icon: homeIcon(), href: 'browse.html' },
    { id: 'browse', label: 'Trending', icon: fireIcon(), href: 'browse.html?tab=trending' },
    { id: 'watchlist', label: 'My Watchlist', icon: listIcon(), href: 'watchlist.html' },
    { id: 'friends', label: 'Friends', icon: usersIcon(), href: 'friends.html' },
    { id: 'profile', label: 'Profile', icon: userIcon(), href: 'profile.html' },
  ];
  return `
    <aside class="sidebar">
      ${items.map(i => `
        <a href="${i.href}" class="sidebar-item ${activePage === i.id ? 'active' : ''}">
          ${i.icon} ${i.label}
        </a>`).join('')}
      <div style="margin-top:auto">
        <button class="sidebar-item w-full" onclick="auth.logout()" style="border:none;background:none;color:var(--text-dim);cursor:pointer;text-align:left">
          ${logoutIcon()} Sign Out
        </button>
      </div>
    </aside>`;
}

// SVG icons
function homeIcon() { return `<svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`; }
function fireIcon() { return `<svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`; }
function listIcon() { return `<svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`; }
function usersIcon() { return `<svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`; }
function userIcon() { return `<svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`; }
function logoutIcon() { return `<svg class="sidebar-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`; }

function searchIcon() { return `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`; }
function plusIcon() { return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`; }
function checkIcon() { return `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`; }

function initPage(activePage) {
  if (!auth.requireAuth()) return;
  const navEl = document.getElementById('main-nav');
  const sidebarEl = document.getElementById('main-sidebar');
  if (navEl) navEl.innerHTML = renderNav(activePage);
  if (sidebarEl) sidebarEl.innerHTML = renderSidebar(activePage);
  initNotifBadge();
}

async function markNotifRead(id, link) {
  try { await api.notifications.read(id); } catch {}
  if (link) window.location.href = link;
}
