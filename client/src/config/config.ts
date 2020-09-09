<<<<<<< HEAD
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
=======
export const config =
  process.env.NODE_ENV === 'development'
    ? {
        SERVER_URL: 'http://localhost:5000',
        CLIENT_URL: 'http://localhost:3000',
      }
    : {
        SERVER_URL: 'https://picmoji.herokuapp.com',
        CLIENT_URL: 'https://picmoji.herokuapp.com',
      }

export default config
>>>>>>> parent of 4134c1e... update app urls
