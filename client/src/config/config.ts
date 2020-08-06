export const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://emoji-game-0.herokuapp.com'
