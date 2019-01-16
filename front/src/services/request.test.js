/* global describe it expect jest */
import {__RewireAPI__ as R, get, post, auth, signUp, signUpValidate} from './request'

describe(`HTTP Requests`, () => {
  it(`'call' makes a http request and returns the data`, async () => {
    const data = {info: 'info'}
    R.__Rewire__('axios', () => Promise.resolve({status: 200, data}))
    const call = R.__get__('call')
    const resp = await call()
    expect(resp).toEqual(data)
    R.__ResetDependency__('axios')
  })

  it(`'call' returns a promise rejection with error if status isn't OK`, async () => {
    const error = new Error()
    error.response = {status: 403}
    R.__Rewire__('axios', () => Promise.reject(error))
    const call = R.__get__('call')
    let resp
    try {
      resp = await call()
    } catch (err) {
      resp = err.response
    }
    expect(resp.status).toEqual(403)
    R.__ResetDependency__('axios')
  })

  it(`'get' calls the function 'call' with the method and endpoint parameters`, async () => {
    R.__Rewire__('call', jest.fn())
    const call = R.__get__('call')
    const endpoint = 'my/url'
    const apiUrl = R.__get__('apiUrl')
    await get(endpoint)
    expect(call).toHaveBeenCalledWith('get', `${apiUrl}/${endpoint}`)
    R.__ResetDependency__('call')
  })

  it(`'post' calls the function 'call' with the method, endpoint and data parameters`, async () => {
    R.__Rewire__('call', jest.fn())
    const call = R.__get__('call')
    const endpoint = 'my/url'
    const apiUrl = R.__get__('apiUrl')
    const data = {info: 'info'}
    await post(endpoint, data)
    expect(call).toHaveBeenCalledWith('post', `${apiUrl}/${endpoint}`, data)
    R.__ResetDependency__('call')
  })

  it(`'auth' calls the function 'call' with the method, auth URL and data parameter`, async () => {
    R.__Rewire__('call', jest.fn())
    const call = R.__get__('call')
    const authUrl = R.__get__('authUrl')
    const data = {info: 'info'}
    await auth(data)
    expect(call).toHaveBeenCalledWith('post', authUrl, data)
    R.__ResetDependency__('call')
  })

  it(`'signUp' calls 'call' with the method, the sign up init url and data`, async () => {
    R.__set__('call', jest.fn())
    const call = R.__get__('call')
    const method = 'post'
    const signUpInitUrl = R.__get__('signUpUrl') + '/init'
    const data = {info: 'info'}
    await signUp(data)
    expect(call).toHaveBeenCalledWith(method, signUpInitUrl, data)
  })

  it(`'signUpValidate' calls 'call' with method and sign up validate URL. Returns true or false on success or failure`, async () => {
    R.__set__('call', jest.fn(() => Promise.resolve({})))
    const call = R.__get__('call')
    const method = 'get'
    const validationId = '1234'
    const signUpValidateUrl = R.__get__('signUpUrl') + '/validate?validationid=' + validationId
    const resp = await signUpValidate(validationId)
    expect(call).toHaveBeenCalledWith(method, signUpValidateUrl)
    expect(resp).toBe(true)
  })
})