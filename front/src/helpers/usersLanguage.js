import { get as getCookie } from '@helpers/cookie'
import supportedLangs from '@helpers/supported-langs'

let usersLanguage = getCookie('language').substr(0, 2)

supportedLangs.includes(usersLanguage) || (usersLanguage = 'en')

export { usersLanguage }
