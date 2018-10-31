/* global describe it expect jest */
import React from 'react'
import { headers } from './headers'

describe(`Header construction for all http requests`, () => {
  it(`If there is no token in localStorage it only includes the Content-Type header`, () => {
    const baseHeaders = { 'Content-Type': 'application/json; charset=utf-8' }
    const userItem = window.localStorage.getItem('user')
    expect(userItem).toBeUndefined()
    expect(headers()).toEqual(baseHeaders)
  })

  it(`If there is a token in localStorage, it includes it in the Authorization header`, () => {
    const tokenName = 'user', tokenValue = '123456'
    window.localStorage.setItem(tokenName, `{"user":"tester","token":"${tokenValue}"}`)
    const expectedHeaders = {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${tokenValue}`
    }
    expect(headers()).toEqual(expectedHeaders)
  })
})

describe(`HTTP Requests`, () => {
  it(``, () => {
    // axios = jest.fn().mockImplementation(config => {
    //   Promise.resolve({status: 200, data: 'hi'})
    // })
  })
})
