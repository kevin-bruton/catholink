/* global describe it expect */
import * as cookie from './cookie'
import { usersLanguage } from './usersLanguage'
import { getLangLiterals } from './get-lang-literals'

describe(`Cookie helper`, () => {
  it(`Can set and get cookies`, () => {
    const cookieName = 'tester'
    const cookieValue = 'tester-value'

    cookie.set(cookieName, cookieValue)
    const valueGot = cookie.get('tester')
    expect(valueGot).toEqual(cookieValue)
  })
})

describe(`Get user's language`, () => {
  it(`Returns 'en' as the default language if the user's language isn't set in the cookie`, () => {
    const defaultLang = 'en'
    expect(usersLanguage()).toEqual(defaultLang)
  })

  it(`Returns the user's language set in the cookie (in two characters - without the region)`, () => {
    const language = 'es'
    const languageAndRegion = 'es-ES'
    cookie.set('language', languageAndRegion)
    expect(usersLanguage()).toEqual(language)
  })
})

describe(`Get language literals`, () => {
  it(`Given a literals object it returns the literals corresponding to the users language`, () => {
    const literalsObject = {
      email: {
        en: 'Email',
        es: 'Correo electrónico'
      },
      password: {
        en: 'Password',
        es: 'Contraseña'
      },
      emailRequired: {
        en: 'Please enter your email',
        es: 'Es necesario ingresar tu dirección de correo electrónico'
      },
      passwordRequired: {
        en: 'Please enter password',
        es: 'Es necesario ingresar la contraseña'
      },
      incorrectCredentials: {
        en: 'Incorrect credentials provided!',
        es: 'Las credenciales no son correctas!'
      }
    }
    cookie.set('language', 'en')
    const expectedLanguageLiterals = {
      email: 'Email',
      password: 'Password',
      emailRequired: 'Please enter your email',
      passwordRequired: 'Please enter password',
      incorrectCredentials: 'Incorrect credentials provided!'
    }
    const languageLiterals = getLangLiterals(literalsObject)
    expect(languageLiterals).toEqual(expectedLanguageLiterals)
  })
})
