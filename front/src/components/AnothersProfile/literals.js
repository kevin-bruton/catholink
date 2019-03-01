import { getLangLiterals } from '@helpers/get-lang-literals'

export const literals = getLangLiterals({
  profileOf: {
    en: fullName => `${fullName}'s Profile`,
    es: fullName => `Perfil de ${fullName}`
  },
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
  address1: {
    en: 'Address line 1',
    es: 'Dirección línea 1'
  },
  address2: {
    en: 'Address line 2',
    es: 'Dirección línea 2'
  },
  joinDate: {
    en: 'Joined on',
    es: 'Miembro desde'
  },
  telephone: {
    en: 'Telephone number',
    es: 'Número de teléfono'
  },
  mobile: {
    en: 'Mobile number',
    es: 'Número móvil'
  },
  workPlace: {
    en: 'Work place',
    es: 'Lugar de trabajo'
  }
})
