import axios from 'axios'
import { headers } from './headers'

export {
  get,
  post,
  auth,
  signUp,
  signUpValidate,
  inviteContact,
  acceptContact
}

const backendHost = process.env.REACT_APP_API_MODE === 'VCR'
  ? 'http://localhost:5500'
  : process.env.REACT_APP_API_MODE === 'DEV'
    ? 'http://localhost:5000'
    : window.location.origin
const apiUrl = `${backendHost}/api`
const authUrl = `${backendHost}/auth`
const signUpUrl = `${backendHost}/signup`
const acceptContactUrl = `${backendHost}/accept-contact`

async function get (endpoint) {
  return call('get', `${apiUrl}/${endpoint}`)
}

async function post (endpoint, data) {
  return call('post', `${apiUrl}/${endpoint}`, data)
}

async function auth (data) {
  return call('post', authUrl, data)
}

async function signUp (data) {
  try {
    const resp = await call('post', `${signUpUrl}/init`, data)
    return !resp.error
  } catch (err) {
    return false
  }
}

async function signUpValidate (validationId) {
  try {
    const resp = await call('get', `${signUpUrl}/validate?code=${validationId}`)
    return !resp.error
  } catch (err) {
    return false
  }
}

async function acceptContact (code) {
  try {
    const inviter = await call('get', `${acceptContactUrl}/${code}`)
    return inviter
  } catch (err) {
    return false
  }
}

async function inviteContact (inviter, invitee, message) {
  try {
    await call('post', `${apiUrl}/contact/invite/`, {invitee, inviter, message})
    return true
  } catch (err) {
    return false
  }
}

async function call (method, url, data) {
  const resp = await axios({ method, url, headers: headers(), data })
  return resp.data
}
