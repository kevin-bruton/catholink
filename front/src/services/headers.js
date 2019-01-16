export const headers = () => {
  const token = window.localStorage.getItem('token')
  const baseHeaders = { 'Content-Type': 'application/json; charset=utf-8' }
  return token
    ? Object.assign({ 'Authorization': 'Bearer ' + token }, baseHeaders)
    : baseHeaders
}
