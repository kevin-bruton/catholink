import axios from 'axios'
import { headers } from './headers'
import {backendHost} from './config'

export {
  get,
  post,
  auth,
  signUp,
  signUpValidate
}

const apiUrl = `${backendHost}/api`
const authUrl = `${backendHost}/auth`
const signUpUrl = `${backendHost}/signup`

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

async function call (method, url, data) {
  const resp = await axios({ method, url, headers: headers(), data })
  return resp.data
}
