/* global describe it expect jest */
import React from 'react'
import { Login } from '@components/Login'
import { shallow } from 'enzyme'

describe('The Login Component', () => {
  it('renders the login form', () => {
    const wrapper = shallow(<Login location="{ from: { pathname: '/' }"/>)
    expect(wrapper.find('#pageTitle')).toHaveLength(1)
    expect(wrapper.find('#loginForm input[name="username"]')).toHaveLength(1)
    expect(wrapper.find('#loginForm input[name="password"]')).toHaveLength(1)
    expect(wrapper.find('#loginBtn')).toHaveLength(1)
  })
})
