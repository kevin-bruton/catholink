/* global describe it expect jest */
import React from 'react'
import { Login } from '@components/Login'
import { shallow } from 'enzyme'
import { login as loginStatus } from '@status'
import { userService } from '@services'

describe('The Login Component', () => {
  it('renders the login form', () => {
    const component = shallow(<Login location="{ from: { pathname: '/' }" />)
    expect(component.find('#pageTitle')).toHaveLength(1)
    expect(component.find('#loginForm input[name="username"]')).toHaveLength(1)
    expect(component.find('#loginForm input[name="password"]')).toHaveLength(1)
    expect(component.find('#loginBtn')).toHaveLength(1)
  })

  it('calls loginRequest when login form is submitted and username and password aren\'t empty', () => {
    const component = shallow(<Login location="{ from: { pathname: '/' }" />)
    component.instance().loginRequest = jest.fn()
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    expect(component.instance().loginRequest).toBeCalled()
  })

  it(`doesn't call loginRequest if username is not supplied`, () => {
    const component = shallow(<Login location="{ from: { pathname: '/' }" />)
    component.instance().loginRequest = jest.fn()
    component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    expect(component.instance().loginRequest).not.toBeCalled()
  })

  it(`doesn't call loginRequest if password is not supplied`, () => {
    const component = shallow(<Login location="{ from: { pathname: '/' }" />)
    component.instance().loginRequest = jest.fn()
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    expect(component.instance().loginRequest).not.toBeCalled()
  })

  it(`sets login status to requested with the loginRequest call`, () => {
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    const loginState = component.instance().state.login
    expect(loginState).toEqual(loginStatus.REQUESTED)
  })

  /* Implementation of userService is mocked here */
  it(`sets login status to successful when loginRequest is successful`, async () => {
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    userService.login = jest.fn().mockImplementation(() => Promise.resolve({ username: 'kevin' }))
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    expect(await userService.login).toBeCalled()
    expect(component.instance().state.login).toEqual(loginStatus.SUCCESSFUL)
  })

  /* Implementation of userService is mocked here */
  it(`sets login status to failure when loginRequest fails`, async () => {
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    userService.login = jest.fn().mockImplementation(() => Promise.reject(new Error('Incorrect credentials')))
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.instance().handleChange({target: {name: 'password', value: 'wrong'}})
    component.find('#loginForm').simulate('submit')
    expect(await userService.login).toBeCalled()
    expect(component.instance().state.login).toEqual(loginStatus.FAILED)
  })

  it.skip(`calls loginUpdated when there are changes in the login status`, () => {
  })
})
