import { get as getCookie } from '@helpers/cookie'
import supportedLangs from '@helpers/supported-langs'

export { usersLanguage }

function usersLanguage () {
  const defaultLang = 'en'
  
  let usersLang = getCookie('language').substr(0, 2)
  
  supportedLangs.includes(usersLang) || (usersLang = defaultLang)
  
  return usersLang
}
