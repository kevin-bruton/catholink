import { getLangLiterals } from '@helpers/get-lang-literals'

export const literals = getLangLiterals({
  inviteSucessful: {
    en: `The invitation was sent successfully`,
    es: `La invitación fue enviada con éxito`
  },
  inviteFailed: {
    en: `There was a problem sending the invitation. Please try again later.`,
    es: `Hubo un problema enviando la invitación. Intente de nuevo más tarde.`
  },
  sendingInvite: {
    en: `Sending the contact invitation...`,
    es: `Enviando la invitación de contacto...`
  }
})
