export const config =
  process.env.NODE_ENV === 'development'
    ? {
        SERVER_URL: 'http://localhost:5000',
        CLIENT_URL: 'http://localhost:3000',
      }
    : {
        SERVER_URL: 'https://mojiparty.herokuapp.com',
        CLIENT_URL: 'https://mojiparty.herokuapp.com',
      }

export default config
