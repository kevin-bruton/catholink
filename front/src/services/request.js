import axios from 'axios'
import { headers } from './headers'
import {backendHost} from './config'

export {
  get,
  post,
  auth
}

const apiUrl = `${backendHost}/api`
const authUrl = `${backendHost}/auth`

async function get (endpoint) {
  return call('get', `${apiUrl}/${endpoint}`)
}

async function post (endpoint, data) {
  return call('post', `${apiUrl}/${endpoint}`, data)
}

async function auth (data) {
  return call('post', authUrl, data)
}

async function call (method, url, data) {
  try {
    const resp = await axios({ method, url, headers, data })
    if (resp.status !== 200) {
      const error = data || resp.statusText
      return Promise.reject(error)
    }
    return resp.data
  } catch (err) {
    return Promise.reject(err)
  }
}
