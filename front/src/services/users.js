import { auth } from './request'

export const userService = {
  login,
  logout
}

async function login (username, password) {
  const user = await auth({ username, password })
  if (user.token) {
    window.localStorage.setItem('user', JSON.stringify(user))
    return user
  } else {
    return Promise.reject(new Error('Login failure'))
  }
}

function logout () {
  // remove user from local storage to log user out
  window.localStorage.removeItem('user')
}
