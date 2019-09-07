const generateCode = (codeLength) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890123456789'
  return Array(codeLength).join().split(',').map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
}

const standardize = str => {
  const translate = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ñ': 'N'
  }
  return str.split('').map(ch => translate[ch]||ch).join('')
}

const removeSpaces = str => str.replace(/\s+/g, '#')

module.exports = {
  generateCode,
  standardize,
  removeSpaces
}
