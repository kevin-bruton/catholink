/* global describe it expect jest */
import { headers } from './headers'
import {__RewireAPI__ as R, get, post, auth} from './request'
import { __RewireAPI__ as RS, login, logout } from './session'

describe(`Header construction for all http requests`, () => {
  it(`If there is no token in localStorage it only includes the Content-Type header`, () => {
    const baseHeaders = { 'Content-Type': 'application/json; charset=utf-8' }
    const userItem = window.localStorage.getItem('user')
    expect(userItem).toBeUndefined()
    expect(headers()).toEqual(baseHeaders)
  })

  it(`If there is a token in localStorage, it includes it in the Authorization header`, () => {
    const tokenName = 'user'
    const tokenValue = '123456'
    window.localStorage.setItem(tokenName, `{"user":"tester","token":"${tokenValue}"}`)
    const expectedHeaders = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${tokenValue}`
    }
    expect(headers()).toEqual(expectedHeaders)
  })
})

describe(`HTTP Requests`, () => {
  it(`Call makes a http request and returns the data`, async () => {
    const data = {info: 'info'}
    R.__Rewire__('axios', () => Promise.resolve({status: 200, data}))
    const call = R.__get__('call')
    const resp = await call()
    expect(resp).toEqual(data)
    R.__ResetDependency__('axios')
  })

  it(`Call returns a promise rejection with error if status isn't OK`, async () => {
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
})
describe(`Session`, () => {
  describe(`login`, () => {
    const [username, password] = ['tester', 'secret']
    it(`Makes auth request to obtain user, sending username and password`, async () => {
      RS.__Rewire__('auth', jest.fn().mockResolvedValue({user: 'tester', token: '123456'}))
      const auth = RS.__get__('auth')
      login(username, password)
      expect(auth).toBeCalledWith({username, password})
      RS.__ResetDependency__('auth')
    })

    it(`When a token is returned from auth call, it sets the user item with the token in localStorage`, () => {
      const userInfo = {user: 'tester', token: '123456'}
      RS.__Rewire__('auth', jest.fn().mockResolvedValue(userInfo))
      login(username, password)
      expect(window.localStorage.getItem('user')).toEqual(JSON.stringify(userInfo))
      RS.__ResetDependency__('auth')
    })

    it('When user info is returned from auth call, it returns it', async () => {
      const userInfo = {user: 'tester', token: '123456'}
      RS.__Rewire__('auth', jest.fn().mockResolvedValue(userInfo))
      const returned = await login(username, password)
      expect(returned).toEqual(userInfo)
    })

    it(`When user info is not returned from the auth call, it rejects with an error`, async () => {
      RS.__Rewire__('auth', jest.fn().mockResolvedValue({}))
      let error = false
      try {
        await login(username, password)
      } catch (err) {
        error = true
      }
      expect(error).toEqual(true)
    })
  })

  describe(`logout`, () => {
    it(`Removes the user item from localStorage`, () => {
      window.localStorage.setItem('user', 'myValue')
      expect(window.localStorage.getItem('user')).toEqual('myValue')
      logout()
      expect(window.localStorage.getItem('user')).toEqual(undefined)
    })
  })
})
