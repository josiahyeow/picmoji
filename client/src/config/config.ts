export const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://picmoji.herokuapp.com'
