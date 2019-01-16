/* global describe it expect jest */
import { headers } from './headers'

describe(`Header construction for all http requests`, () => {
  it(`If there is no token in localStorage it only includes the Content-Type header`, () => {
    const baseHeaders = { 'Content-Type': 'application/json; charset=utf-8' }
    const userItem = window.localStorage.getItem('user')
    const tokenItem = window.localStorage.getItem('token')
    expect(userItem).toBeFalsy()
    expect(tokenItem).toBeFalsy()
    expect(headers()).toEqual(baseHeaders)
  })

  it(`If there is a token in localStorage, it includes it in the Authorization header`, () => {
    const tokenName = 'token'
    const tokenValue = '123456'
    window.localStorage.setItem(tokenName, tokenValue)
    const expectedHeaders = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${tokenValue}`
    }
    expect(headers()).toEqual(expectedHeaders)
  })
})