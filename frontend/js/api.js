// api.js — All API calls to the CineVerse backend
const BASE_URL = 'https://backend-m287.onrender.com';
const TMDB_IMG = 'https://image.tmdb.org/t/p';

const api = {
  _getToken() { return localStorage.getItem('cv_token'); },
  _headers() {
    const h = { 'Content-Type': 'application/json' };
    const t = this._getToken();
    if (t) h['Authorization'] = `Bearer ${t}`;
    return h;
  },
  async _req(method, path, body) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method, headers: this._headers(),
        ...(body ? { body: JSON.stringify(body) } : {})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      console.error(`API ${method} ${path}:`, err.message);
      throw err;
    }
  },
  get: (path) => api._req('GET', path),
  post: (path, body) => api._req('POST', path, body),
  patch: (path, body) => api._req('PATCH', path, body),
  delete: (path) => api._req('DELETE', path),

  // Auth
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    guest: (data) => api.post('/auth/guest', data),
    me: () => api.get('/auth/me'),
    updateGenres: (genres) => api.patch('/auth/genres', { genres })
  },

  // Movies
  movies: {
    trending: () => api.get('/movies/trending'),
    popular: (page = 1) => api.get(`/movies/popular?page=${page}`),
    topRated: (page = 1) => api.get(`/movies/top-rated?page=${page}`),
    upcoming: (page = 1) => api.get(`/movies/upcoming?page=${page}`),
    search: (q, page = 1) => api.get(`/movies/search?q=${encodeURIComponent(q)}&page=${page}`),
    discover: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return api.get(`/movies/discover?${qs}`);
    },
    genres: () => api.get('/movies/genres'),
    details: (id) => api.get(`/movies/${id}`)
  },

  // Watchlist
  watchlist: {
    get: () => api.get('/watchlist'),
    getUser: (userId) => api.get(`/watchlist/user/${userId}`),
    check: (movieId) => api.get(`/watchlist/check/${movieId}`),
    add: (data) => api.post('/watchlist/add', data),
    remove: (movieId) => api.delete(`/watchlist/remove/${movieId}`),
    markWatched: (movieId) => api.patch(`/watchlist/watched/${movieId}`)
  },

  // Reviews
  reviews: {
    getByMovie: (movieId) => api.get(`/reviews/movie/${movieId}`),
    getByUser: (userId) => api.get(`/reviews/user/${userId}`),
    getMy: (movieId) => api.get(`/reviews/my/${movieId}`),
    create: (data) => api.post('/reviews', data),
    delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
    like: (reviewId) => api.post(`/reviews/${reviewId}/like`)
  },

  // Friends
  friends: {
    list: () => api.get('/friends'),
    requests: () => api.get('/friends/requests'),
    sendRequest: (userId) => api.post(`/friends/request/${userId}`),
    accept: (userId) => api.post(`/friends/accept/${userId}`),
    decline: (userId) => api.post(`/friends/decline/${userId}`),
    remove: (userId) => api.delete(`/friends/remove/${userId}`),
    search: (q) => api.get(`/friends/search?q=${encodeURIComponent(q)}`)
  },

  // Activity
  activity: {
    feed: () => api.get('/activity/feed'),
    user: (userId) => api.get(`/activity/user/${userId}`)
  },

  // Notifications
  notifications: {
    get: () => api.get('/notifications'),
    readAll: () => api.patch('/notifications/read-all'),
    read: (id) => api.patch(`/notifications/${id}/read`),
    delete: (id) => api.delete(`/notifications/${id}`)
  },

  // Users
  users: {
    get: (id) => api.get(`/users/${id}`),
    updateProfile: (data) => api.patch('/users/profile', data)
  }
};

// TMDB image helper
function imgUrl(path, size = 'w500') {
  if (!path) return '';
  return `${TMDB_IMG}/${size}${path}`;
}

function backdropUrl(path) { return imgUrl(path, 'w1280'); }

function ratingClass(r) {
  if (r >= 7) return 'rating-high';
  if (r >= 5) return 'rating-mid';
  return 'rating-low';
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = diff / 1000, m = s / 60, h = m / 60, d = h / 24;
  if (d >= 30) return new Date(dateStr).toLocaleDateString();
  if (d >= 1) return `${Math.floor(d)}d ago`;
  if (h >= 1) return `${Math.floor(h)}h ago`;
  if (m >= 1) return `${Math.floor(m)}m ago`;
  return 'just now';
}
