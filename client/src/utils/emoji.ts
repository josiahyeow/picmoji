import e from 'react-easy-emoji'

function emoji(input) {
  return e(input, {
    baseUrl: 'https://twemoji.maxcdn.com/v/latest/svg',
    ext: '.svg',
    size: '',
  })
}

export default emoji
