import { getLangLiterals } from '@helpers/get-lang-literals'

export const literals = getLangLiterals({
  firstName: {
    en: 'First name',
    es: 'Nombre'
  },
  surname: {
    en: 'Surname',
    es: 'Apellidos'
  },
  email: {
    en: 'Email',
    es: 'Correo electrónico'
  },
  password: {
    en: 'Password',
    es: 'Contraseña'
  },
  passwordRepeat: {
    en: 'Repeat password',
    es: 'Repetir contraseña'
  },
  firstNameRequired: {
    en: 'Please enter your first name',
    es: 'Ingresa tu nombre'
  },
  surnameRequired: {
    en: 'Please enter your surname',
    es: 'Ingresa tus apellidos'
  },
  emailRequired: {
    en: 'Please enter your email',
    es: 'Ingresa tu dirección de correo electrónico'
  },
  passwordRequired: {
    en: 'Please enter your password',
    es: 'Ingresa tu contraseña'
  },
  passwordRepeatRequired: {
    en: 'Please enter your password again',
    es: 'Ingresa tu contraseña otra vez'
  },
  samePasswordsRequired: {
    en: `The passwords you've entered don't coincide`,
    es: 'Las contraseñas que has ingresado no coinciden'
  },
  signUp: {
    en: 'Send',
    es: 'Enviar'
  }
})
