export const headers = () => {
  // return authorization header with jwt token
  const userStr = window.localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : {}
  const oHeaders = { 'Content-Type': 'application/json; charset=utf-8' }
  if (user && user.token) {
    return Object.assign({ 'Authorization': 'Bearer ' + user.token }, oHeaders)
  } else {
    return oHeaders
  }
}
