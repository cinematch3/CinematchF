// ui.js — Reusable rendering functions

const ui = {
  // Toast notifications
  toast(msg, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  },

  success(msg) { this.toast(msg, 'success'); },
  error(msg) { this.toast(msg, 'error'); },
  info(msg) { this.toast(msg, 'info'); },

  // Spinner HTML
  spinner() {
    return `<div style="display:flex;justify-content:center;padding:60px"><div class="spinner"></div></div>`;
  },

  // Movie card HTML
  movieCard(movie, size = '160px') {
    const poster = imgUrl(movie.poster_path || movie.posterPath);
    const title = movie.title || movie.movieTitle || 'Unknown';
    const rating = movie.vote_average || movie.voteAverage || 0;
    const id = movie.id || movie.movieId;
    const rClass = ratingClass(rating);
    return `
      <div class="movie-card" style="width:${size}" onclick="window.location.href='../pages/movie.html?id=${id}'">
        ${poster
          ? `<img src="${poster}" alt="${title}" loading="lazy">`
          : `<div class="movie-card-placeholder">${title}</div>`
        }
        <div class="movie-card-overlay">
          <div style="font-size:13px;font-weight:700;margin-bottom:4px">${title}</div>
          ${rating ? `<div class="rating-ring ${rClass}" style="width:36px;height:36px;font-size:12px">${rating.toFixed(1)}</div>` : ''}
        </div>
      </div>`;
  },

  // Activity item
  activityItem(a) {
    const user = a.user || {};
    const icon = { watchlist_add: '🎬', watchlist_watched: '✅', review_add: '⭐', friend_add: '👥', rating_add: '⭐' }[a.type] || '📌';
    const texts = {
      watchlist_add: `added <strong>${a.movieTitle}</strong> to watchlist`,
      watchlist_watched: `marked <strong>${a.movieTitle}</strong> as watched`,
      review_add: `rated <strong>${a.movieTitle}</strong> ${a.rating}/10`,
      friend_add: `became friends with ${a.targetUser?.username || 'someone'}`,
      rating_add: `rated <strong>${a.movieTitle}</strong> ${a.rating}/10`
    };
    return `
      <div class="activity-item">
        <div style="font-size:22px;margin-top:2px">${icon}</div>
        <div style="flex:1">
          <div style="font-size:14px">
            <a href="../pages/profile.html?id=${user._id}" style="font-weight:700">${user.username}</a>
            ${texts[a.type] || a.type}
          </div>
          <div class="text-dim text-sm" style="margin-top:4px">${timeAgo(a.createdAt)}</div>
        </div>
        ${a.moviePoster ? `<img src="${imgUrl(a.moviePoster, 'w92')}" style="width:40px;border-radius:8px;object-fit:cover">` : ''}
      </div>`;
  },

  // Notification item
  notifItem(n) {
    return `
      <div class="activity-item" style="${n.read ? '' : 'background:rgba(229,9,20,0.05);border-radius:12px;padding:12px'}"
           onclick="markNotifRead('${n._id}', '${n.link || ''}')">
        <div style="font-size:20px">${{ friend_request: '🤝', friend_accepted: '🎉', review_like: '❤️', new_review: '💬' }[n.type] || '🔔'}</div>
        <div style="flex:1">
          <div style="font-size:14px">${n.message}</div>
          <div class="text-dim text-sm" style="margin-top:4px">${timeAgo(n.createdAt)}</div>
        </div>
        ${!n.read ? '<div class="notif-dot" style="position:relative;margin-top:6px"></div>' : ''}
      </div>`;
  },

  // Friend card
  friendCard(user, actions = '') {
    return `
      <div class="surface" style="padding:20px;display:flex;align-items:center;gap:16px">
        <a href="../pages/profile.html?id=${user._id}" style="flex:1;display:flex;align-items:center;gap:16px">
          ${auth.renderAvatar(user, 'avatar-md')}
          <div>
            <div style="font-weight:700">${user.username}</div>
            ${user.bio ? `<div class="text-dim text-sm truncate" style="max-width:200px">${user.bio}</div>` : ''}
          </div>
        </a>
        ${actions}
      </div>`;
  },

  // Modal helpers
  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  },
  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  },

  // Empty state
  empty(msg = 'Nothing here yet') {
    return `<div style="text-align:center;padding:60px;color:var(--text-muted);font-size:14px">${msg}</div>`;
  },

  // Render skeleton cards
  skeletonCards(n = 5) {
    return Array(n).fill(0).map(() =>
      `<div class="skeleton" style="width:160px;aspect-ratio:2/3;border-radius:20px"></div>`
    ).join('');
  }
};

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});
