import { usersLanguage } from '@helpers/usersLanguage'

export const getLangLiterals = literals => {
  const langLiterals = {}
  Object.keys(literals).map(literal => (langLiterals[literal] = literals[literal][usersLanguage]))
  return langLiterals
}
