import axios from 'axios'
import { headers } from './headers'
import {backendHost} from './config'

export {
  get,
  post,
  auth,
  validate
}

const apiUrl = `${backendHost}/api`
const authUrl = `${backendHost}/auth`
const validateUrl = `${backendHost}/auth/validate`

async function get (endpoint) {
  return call('get', `${apiUrl}/${endpoint}`)
}

async function post (endpoint, data) {
  return call('post', `${apiUrl}/${endpoint}`, data)
}

async function auth (data) {
  return call('post', authUrl, data)
}

async function validate (userToken) {
  return call('post', validateUrl, userToken)
}

async function call (method, url, data) {
  const resp = await axios({ method, url, headers: headers(), data })
  return resp.data
}
