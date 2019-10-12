module.exports = {
  generateCode,
  standardize,
  removeSpaces
}

function generateCode (codeLength) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789'
  return Array(codeLength).join().split(',').map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
}

function standardize (str) {
  const translate = {
    // eslint-disable-next-line object-property-newline
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ñ': 'N'
  }
  return str.split('').map(ch => translate[ch] || ch).join('')
}

function removeSpaces (str) {
  str.replace(/\s+/g, '#')
}
