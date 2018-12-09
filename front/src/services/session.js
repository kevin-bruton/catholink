import { auth, validate } from './request'

export {
  login,
  logout,
  validateSession
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

async function validateSession () {
  const userToken = window.localStorage.getItem('user')
  const validated = await validate(userToken)
  return validated
}

function logout () {
  window.localStorage.removeItem('user')
}
