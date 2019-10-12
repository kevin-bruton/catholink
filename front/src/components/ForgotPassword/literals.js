import { getLangLiterals } from '@helpers/get-lang-literals'

export const literals = getLangLiterals({
  requestEmailHeading: {
    en: `Send email to reset password`,
    es: `Enviar correo electrónico para reestablecer la contraseña`
  },
  requestEmailLine1: {
    en: `In order to reset your password, we must send you an email to establish the identity of your account.`,
    es: `Para poder reestablecer tu contraseña, tenemos que enviarte un correo electrónico para identificar tu cuenta.`
  },
  requestEmailLine2: {
    en: `Please enter your email address below:`,
    es: `Ingrese tu dirección de correo electrónico:`
  },
  sendEmailBtn: {
    en: `Send email`,
    es: `Enviar correo`
  },
  emailRequested: {
    en: `Sending email...`,
    es: `Enviando correo electrónico...`
  },
  emailSentHeading: {
    en: `We have sent you the email`,
    es: `Te hemos enviado el correo`
  },
  emailSentLine1: {
    en: `Please look for the email we've sent you. Give it a few minutes, but then if you can't find it in your inbox, try looking in spam.`,
    es: `Busca el correo electrónico que te hemos enviado. Dale unos minutos, y si no lo encuentras en tu bandeja de entrada, mira en el spam.`
  },
  sendEmailFailedHeading: {
    en: `We couldn't send the email`,
    es: `No pudimos enviar el correo`
  },
  sendEmailFailedLine1: {
    en: `There was an error while trying to send the email.`,
    es: `Ha habido un error al intentar enviar el correo`
  },
  sendEmailFailedLine2: {
    en: `Please check that the email you entered is correct and try again in a few minutes`,
    es: `Asegúrate de que la dirección es la correcta e intenta otra vez en unos minutos`
  },
  goToLogin: {
    en: `Go to login`,
    es: `Ir al login`
  },
  askPwdHeader: {
    en: `Enter the new password`,
    es: `Ingrese la nueva contraseña`
  },
  askPwdLine1: {
    en: `We have received the confirmation of your email address.`,
    es: `Hemos recibido la confirmación de tu dirección de correo electrónico.`
  },
  askPwdLine2: {
    en: `Now we need you to provide us with your new password:`,
    es: `Ahora, ingresa tu nueva contraseña:`
  },
  newPasswordPlaceholder: {
    en: `New password`,
    es: `Nueva contraseña`
  },
  saveNewPassword: {
    en: `Save`,
    es: `Guardar`
  },
  savingNewPassword: {
    en: `Saving new password`,
    es: `Guardando nueva contraseña`
  },
  setNewPasswordSuccessfulHeading: {
    en: `You have successfully changed your password`,
    es: `Se ha realizado el cambio de contraseña con éxito`
  },
  setNewPasswordSuccessfulLine1: {
    en: `You can now log in with your new password.`,
    es: `Ahora puedes iniciar sesión con tu nueva contraseña.`
  },
  setNewPasswordFailedHeading: {
    en: `The was a problem while trying to set your new password`,
    es: `Ha habido un problema al intentar cambiar tu contraseña`
  },
  setNewPasswordFailedLine1: {
    en: `Sorry for the inconvenience. Please try again later.`,
    es: `Perdona por las inconveniencias. Intente de nuevo más tarde.`
  },
  sendNewPasswordFailedOutdated: {
    en: `You must start the reset password process again as more than 15 minutes has passed since you started it.`,
    es: `Deberías empezar el proceso de resetear la contraseña otra vez, ya que han pasado más de 15 minutos desde que lo empezaste.`
  }
})
