module.exports = {
  getLiterals
}

function getLiterals (lang) {
  (lang === 'es') || (lang = 'en')
  return {
    es: {
      greeting: `Hola`,
      line1: `Enhorabuena por querer formar parte de Catholink, la red social para católicos.`,
      line2: `Sólo te queda un paso. Hacer click en el siguiente enlace para validar tu correo electrónico:`,
      validate: `Validar`,
      bye: `¡Hasta pronto!`,
      signature: `El equipo de Catholink`
    },
    en: {
      greeting: `Hello`,
      line1: `Congratulations for wanting to take part in Catholink, the social network for Catholics.`,
      line2: `You've only got one step left. Click on the following link to validate your email address:`,
      validate: `Validate`,
      bye: `See you soon!`,
      signature: `The Catholink Team`
    }
  }[lang]
}
