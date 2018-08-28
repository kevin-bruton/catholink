import { get as getCookie } from '@helpers/cookie'
import supportedLangs from '@helpers/lang-config'

let lang = getCookie('language').substr(0, 2)

supportedLangs.includes(lang) || (lang = 'en')

export default lang
