/* global describe it expect jest */
import btoa from 'btoa'
import { __RewireAPI__ as RS, login, validateSession, logout } from './session'

describe(`Session`, () => {
  describe(`login`, () => {
    const [email, password, token, user] = ['tester', 'secret', '1234', btoa(JSON.stringify({email: 'dummy@m.com'}))]
    it(`Makes auth request to obtain user, sending email and password`, async () => {
      RS.__Rewire__('auth', jest.fn().mockResolvedValue({user, token}))
      const auth = RS.__get__('auth')
      await login(email, password)
      expect(auth).toBeCalledWith({email, password})
      RS.__ResetDependency__('auth')
    })
 
    it(`auth call sets the user and the token item in localStorage`, async () => {
      RS.__Rewire__('auth', jest.fn().mockResolvedValue({user, token}))
      await login(email, password)
      expect(window.localStorage.getItem('user')).toEqual(user)
      expect(window.localStorage.getItem('token')).toEqual(token)
      RS.__ResetDependency__('auth')
    })

    it('returns user info when it receives it from the auth call', async () => {
      RS.__Rewire__('auth', jest.fn().mockResolvedValue({user, token}))
      const returned = await login(email, password)
      expect(returned.user).toEqual(user)
    })

    it(`When user info is not returned from the auth call, it rejects with an error`, async () => {
      RS.__Rewire__('auth', jest.fn().mockResolvedValue({}))
      let error = false
      try {
        await login(email, password)
      } catch (err) {
        error = true
      }
      expect(error).toEqual(true)
    })
  })

  describe('validateSession', () => {
    it(`returns true when get validate endpoint succeeds`, async () => {
      RS.__set__('get', () => Promise.resolve())
      const resp = await validateSession()
      expect(resp).toBe(true)
    })

    it(`returns false when get validate returns error`, async () => {
      RS.__set__('get', () => Promise.reject())
      const resp = await validateSession()
      expect(resp).toBe(false)
    })
  })

  describe(`logout`, () => {
    it(`Removes the user item from localStorage`, () => {
      window.localStorage.setItem('user', 'myValue')
      expect(window.localStorage.getItem('user')).toEqual('myValue')
      logout()
      expect(window.localStorage.getItem('user')).toBeFalsy()
    })
  })
})
