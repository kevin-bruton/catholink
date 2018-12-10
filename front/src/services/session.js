import { auth, get } from './request'

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
  let validated = false
  try {
    await get('validate')
    validated = true
  } catch (err) {
  }
  return validated
}

function logout () {
  window.localStorage.removeItem('user')
}
