/* global describe it expect jest */
import React from 'react'
import { Login } from '@components/Login'
import { shallow } from 'enzyme'
import { login as loginStatus } from '@status'
import { userService } from '@services'
import * as status from '@status/constants'

describe('The Login Component', () => {
  it('Renders the login form', () => {
    const component = shallow(<Login location="{ from: { pathname: '/' }" />)
    expect(component.find('#pageTitle')).toHaveLength(1)
    expect(component.find('#loginForm input[name="username"]')).toHaveLength(1)
    expect(component.find('#loginForm input[name="password"]')).toHaveLength(1)
    expect(component.find('#loginBtn')).toHaveLength(1)
  })

  it(`Calls loginRequest when login form is submitted and username and password aren't empty`, () => {
    const component = shallow(<Login location="{ from: { pathname: '/' }" />)
    component.instance().loginRequest = jest.fn()
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    expect(component.instance().loginRequest).toBeCalled()
  })

  it(`Doesn't call loginRequest if username is not supplied`, () => {
    const component = shallow(<Login location="{ from: { pathname: '/' }" />)
    component.instance().loginRequest = jest.fn()
    component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    expect(component.instance().loginRequest).not.toBeCalled()
  })

  it(`Doesn't call loginRequest if password is not supplied`, () => {
    const component = shallow(<Login location="{ from: { pathname: '/' }" />)
    component.instance().loginRequest = jest.fn()
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    expect(component.instance().loginRequest).not.toBeCalled()
  })

  it(`When submitted, sets login status to REQUESTED, and handleSubmit and loginRequest are called`, () => {
    const mockedHandleSubmit = jest.spyOn(Login.prototype, 'handleSubmit')
    const mockedLoginRequest = jest.spyOn(Login.prototype, 'loginRequest')
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    const loginState = component.instance().state.login
    expect(loginState).toEqual(loginStatus.REQUESTED)
    expect(mockedHandleSubmit).toBeCalled()
    expect(mockedLoginRequest).toBeCalled()
  })

  /* Implementation of userService is mocked here */
  it(`Sets login status to successful when loginRequest is successful`, async () => {
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    userService.login = jest.fn().mockImplementation(() => Promise.resolve({ username: 'kevin' }))
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
    component.find('#loginForm').simulate('submit')
    expect(await userService.login).toBeCalled()
    expect(component.instance().state.login).toEqual(loginStatus.SUCCESSFUL)
  })

  /* Implementation of userService is mocked here */
  it(`Sets login status to failure when loginRequest fails`, async () => {
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    userService.login = jest.fn().mockImplementation(() => Promise.reject(new Error('Incorrect credentials')))
    component.instance().handleChange({target: {name: 'username', value: 'kevin'}})
    component.instance().handleChange({target: {name: 'password', value: 'wrong'}})
    component.find('#loginForm').simulate('submit')
    expect(await userService.login).toBeCalled()
    expect(component.instance().state.login).toEqual(loginStatus.FAILED)
  })

  it(`loginUpdated calls logout if the new state is LOGOUT`, () => {
    userService.logout = jest.fn().mockImplementation(() => {})
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    component.instance().loginUpdated(status.login.LOGOUT)
    expect(userService.logout).toBeCalled()
  })

  it(`Renders username required message when submitted without username`, () => {
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    component.setState({login: status.login.REQUESTED, username: null, password: 'pass'})
    expect(component.find('#usernameReqMess')).toHaveLength(1)
  })

  it(`Renders password required message when submitted without password`, () => {
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    component.setState({login: status.login.REQUESTED, username: 'user', password: null})
    expect(component.find('#passReqMess')).toHaveLength(1)
  })

  it(`preventDefault called when handling submit`, () => {
    const component = shallow(<Login location="{from: {pathname: '/'}}" />)
    const e = {}
    e.preventDefault = jest.fn()
    component.instance().handleSubmit(e)
    expect(e.preventDefault).toBeCalled()
  })
})
