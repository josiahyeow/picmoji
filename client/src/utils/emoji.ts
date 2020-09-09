import e from 'react-easy-emoji'

function emoji(input) {
  return e(input, {
    baseUrl: 'https://twemoji.maxcdn.com/2/svg/',
    ext: '.svg',
    size: '',
  })
}

export default emoji
