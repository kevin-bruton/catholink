module.exports = function getLiterals (lang) {
  return {
    es: {
      signUpEmail: {
        subject: 'Bienvenido a Catholink',
        greeting: `Hola`,
        line1: `Enhorabuena por querer formar parte de Catholink, la red social para católicos.`,
        line2: `Sólo te queda un paso. Hacer click en el siguiente enlace para validar tu correo electrónico:`,
        validate: `Validar`,
        bye: `¡Hasta pronto!`,
        signature: `El equipo de Catholink`
      },
      contactEmail: {
        subject: inviterName => `${inviterName} quiere contactar contigo`,
        greeting: inviteeName => `Hola ${inviteeName},`,
        line1: inviterName => `${inviterName} pide que le aceptas como contacto.`,
        line2: `¿Deseas aceptarle como contacto?`,
        acceptBtnText: `Aceptar`
      },
      contactAcceptedEmail: {
        subject: inviteeName => `${inviteeName} es tu nuevo contacto`,
        greeting: inviterName => `Hola ${inviterName},`,
        line1: inviteeName => `${inviteeName} ha aceptado tu invitación para ser contactos.`,
        line2: () => `Puedes ver los los detalles de su perfil que tiene reservado para sus contactos y mandarle mensajes.`,
        bye: `¡Disfruta!`,
        signature: `El equipo de Catholink`
      },
      resetPasswordLinkEmail: {
        subject: 'Solicitud para resetear tu contraseña',
        greeting: firstName => `Hola ${firstName},`,
        line1: `Has recibido este correo para resetear tu contraseña, tal como has solicitado.`,
        line2: `Si no has solicitado el reseteo de tu contraseña y sospechas que otro podía haberlo hecho en tu lugar, infórmanos, respondiendo a este correo.`,
        line3: `Selecciona el enlace abajo para resetear tu contraseña. El enlace será válido durante 15 minutos:`,
        linkText: `Establezca una nueva contraseña`,
        bye: `Un saluodo,`,
        signature: `El equipo de Catholink`
      }
    },
    en: {
      signUpEmail: {
        subject: 'Welcome to Catholink',
        greeting: `Hello`,
        line1: `Congratulations for wanting to take part in Catholink, the social network for Catholics.`,
        line2: `You've only got one step left. Click on the following link to validate your email address:`,
        validate: `Validate`,
        bye: `See you soon!`,
        signature: `The Catholink Team`
      },
      contactEmail: {
        subject: inviterName => `${inviterName} wants to add you as a contact`,
        greeting: inviteeName => `Hello ${inviteeName},`,
        line1: (inviterName, inviterGender) => `${inviterName} is asking you to accept ${inviterGender === 'male' ? 'him' : 'her'} as a contact.`,
        line2: `Would you like to do so?`,
        acceptBtnText: `Accept`
      },
      contactAcceptedEmail: {
        subject: inviteeName => `${inviteeName} is your new contact`,
        greeting: inviterName => `Hello ${inviterName},`,
        line1: inviteeName => `${inviteeName} has accepted your invitation to be mutual contacts.`,
        line2: inviteeGender => `You can see the details of ${inviteeGender === 'male' ? 'his' : 'her'} profile which are reserved only for contacts and send him/her messages.`,
        bye: `¡Enjoy!`,
        signature: `The Catholink Team`
      },
      resetPasswordLinkEmail: {
        subject: 'Request to reset your password',
        greeting: firstName => `Dear ${firstName},`,
        line1: `You have received this email for you to reset your password as you have indicated.`,
        line2: `If you have not asked to reset your email and you suspect that someone else has on your behalf, please let us know, responding to this email.`,
        line3: `Please select the following link in order to reset your password. The link will be valid for 15 minutes:`,
        linkText: `Set new password`,
        bye: `Yours sincerely,`,
        signature: `The Catholink Team`
      }
    }
  }[lang]
}
