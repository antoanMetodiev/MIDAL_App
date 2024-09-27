
// src/config.js
export const CLIENT_ID = 'a4e7c32ff83f4a38a6da6b5a0e69950a';
export const REDIRECT_URI = 'http://localhost:5173/songs-and-podcasts';
// export const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=user-read-private user-read-email`;
export const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=user-read-private user-read-email`;