import { usersLanguage } from '@helpers/get-users-language'

export const getLangLiterals = literals => {
  const langLiterals = {}
  Object.keys(literals).map(literal => (langLiterals[literal] = literals[literal][usersLanguage]))
  return langLiterals
}
