import { getLangLiterals } from '@helpers/get-lang-literals'

export const literals = getLangLiterals({
  username: {
    en: 'Username',
    es: 'Usuario'
  },
  password: {
    en: 'Password',
    es: 'Contraseña'
  },
  usernameRequired: {
    en: 'Please enter username',
    es: 'Es necesario ingresar nombre de usuario'
  },
  passwordRequired: {
    en: 'Please enter password',
    es: 'Es necesario ingresar la contraseña'
  },
  incorrectCredentials: {
    en: 'Incorrect credentials provided!',
    es: 'Las credenciales no son correctas!'
  }
})
