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
  },
  emailSent1: {
    en: `For your security, we've sent you an email to verify your account.`,
    es: `Por tu seguridad, te hemos enviado un correo electróncio para verifcar tu cuenta.`
  },
  emailSent2: {
    en: `Please revise your Inbox and if you don't find it there, your Spam.`,
    es: `Revise tu bandeja de entrada y si no lo encuentras allí, tu Spam.`
  },
  emailSent3: {
    en: `After verifying your account, you'll be able to log into your new account!`,
    es: `Después de verificar la cuenta, podrás iniciar sesión en tu nueva cuenta!`
  },
  emailNotSent1: {
    en: `We need to send you an email in order to verify your account.`,
    es: `Necesitamos enviarte un correo electrónico para poder verificar tu cuenta.`
  },
  emailNotSent2: {
    en: `However, there has been an error while trying to send it.`,
    es: `Sin embargo, ha habido un error en el envío.`
  },
  emailNotSent3: {
    en: `Please try again at another time.`,
    es: `Intente otra vez más adelante.`
  }
})
