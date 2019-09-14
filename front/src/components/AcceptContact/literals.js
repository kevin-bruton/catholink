import { getLangLiterals } from '@helpers/get-lang-literals'

export const literals = getLangLiterals({
  newContactHeading: {
    en: newContactsName => `${newContactsName} is your new contact`,
    es: newContactsName => `${newContactsName} es tu nuevo contacto`
  },
  acceptedContactLine1: {
    en: `Congratulations! You have a new contact.`,
    es: `¡Enhorabuena! Tienes un nuevo contacto.`
  },
  acceptedContactLine2: {
    en: newContactsName => `You can now send and receive messages from ${newContactsName}.`,
    es: newContactsName => `Ahora puedes enviar y recibir mensajes de ${newContactsName}.`
  },
  acceptedContactLine3: {
    en: gender => `You can also access information ${gender === 'male' ? 'he' : 'she'} reserves only for ${gender === 'male' ? 'his' : 'her'} contacts.`,
    es: gender => `Ya puedes acceder a información que ${gender === 'male' ? 'el' : 'ella'} reserva sólo para sus contactos.`
  },
  acceptedContactLine4: {
    en: gender => `If you like, you can have a look at ${gender === 'male' ? 'his' : 'her'} profile:`,
    es: gender => `Si quieres, puedes consultar su perfil:`
  },
  viewInvitersProfile: {
    en: newContactsName => `See ${newContactsName}'s profile`,
    es: newContactsName => `Consultar el perfil de ${newContactsName}`
  },
  failedHeading: {
    en: newContactsName => `There was a problem while trying to accept ${newContactsName} as a contact.`,
    es: newContactsName => `Hubo un problema al intentar acceptar ${newContactsName} como contacto.`
  },
  failedLine1: {
    en: newContactsName => `There was a problem and we couldn't add ${newContactsName} as a contact.`,
    es: newContactsName => `Hubo un problema y no pudimos agregar a ${newContactsName} como un nuevo contacto tuyo.`
  },
  failedLine2: {
    en: `Please try again later.`,
    es: `Intenta de nuevo más tarde.`
  },
  accepting: {
    en: 'Accepting contact...',
    es: 'Aceptando el nuevo contacto...'
  }
})
