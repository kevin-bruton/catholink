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
      }
    }
  }[lang]
}
