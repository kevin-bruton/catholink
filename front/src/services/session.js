import { auth, get } from './request'
import {statusType, setStatus} from '@status'

export {
  login,
  logout,
  validateSession
}

async function login (email, password) {
  const resp = await auth({ email, password })
  if (resp.token) {
    window.localStorage.setItem('user', resp.user)
    window.localStorage.setItem('token', resp.token)
    setStatus(statusType.USER, JSON.parse(atob(resp.user)))
    return resp
  } else {
    return Promise.reject(new Error('Login failure'))
  }
}

async function validateSession () {
  let validated = false
  try {
    await get('validate')
    validated = true
    setStatus(statusType.USER, JSON.parse(atob(window.localStorage.getItem('user'))))
  } catch (err) {
  }
  return validated
}

function logout () {
  window.localStorage.removeItem('user')
  window.localStorage.removeItem('token')
}
