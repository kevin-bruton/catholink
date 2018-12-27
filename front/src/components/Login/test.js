/* global describe it expect jest */
import React from 'react'
import { Login, __RewireAPI__ as R } from '@components/Login'
import { shallow } from 'enzyme'
import {loginStatus} from '@status/constants'

describe('The Login Component', () => {
  describe(`Renderer`, () => {
    it('Renders the login form', () => {
      const component = shallow(<Login location="{ from: { pathname: '/' }" />)
      expect(component.find('#pageTitle')).toHaveLength(1)
      expect(component.find('#loginForm input[name="email"]')).toHaveLength(1)
      expect(component.find('#loginForm input[name="password"]')).toHaveLength(1)
      expect(component.find('#loginBtn')).toHaveLength(1)
      expect(component.find('#signUpBtn')).toHaveLength(1)
    })

    it(`Renders email required message when submitted without email`, () => {
      const component = shallow(<Login location="{from: {pathname: '/'}}" />)
      component.setState({login: loginStatus.REQUESTED, email: null, password: 'pass'})
      expect(component.find('#emailReqMess')).toHaveLength(1)
    })

    it(`Renders password required message when submitted without password`, () => {
      const component = shallow(<Login location="{from: {pathname: '/'}}" />)
      component.setState({login: loginStatus.REQUESTED, email: 'user', password: null})
      expect(component.find('#passReqMess')).toHaveLength(1)
    })
  })

  describe(`Constructor`, () => {
    it(`Subscribes to status login changes`, () => {
      R.__Rewire__('subscribeStatus', jest.fn())
      const subscribeStatus = R.__get__('subscribeStatus')
      shallow(<Login location="{from:{pathname:'/'}" />)
      expect(subscribeStatus).toBeCalled()
      R.__ResetDependency__('status')
    })

    it(`Calls the service to log the user out`, () => {
      R.__Rewire__('session', { logout: jest.fn() })
      const session = R.__get__('session')
      shallow(<Login location="{from:{pathname:'/'}" />)
      expect(session.logout).toBeCalled()
      R.__ResetDependency__('session')
    })

    it(`Sets the login status to logged out`, () => {
      const wrapper = shallow(<Login location="{from:{pathname:'/'}" />)
      const state = wrapper.instance().state
      expect(state.login).toEqual(loginStatus.LOGOUT)
      R.__ResetDependency__('status')
    })
  })

  describe(`handleSubmit`, () => {
    it(`Calls loginRequest when login form is submitted and email and password aren't empty`, () => {
      const component = shallow(<Login location="{ from: { pathname: '/' }" />)
      component.instance().loginRequest = jest.fn().mockResolvedValue()
      component.instance().handleChange({target: {name: 'email', value: 'kevin'}})
      component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
      component.find('#loginForm').simulate('submit')
      expect(component.instance().loginRequest).toBeCalled()
    })

    it(`Doesn't call loginRequest if email is not supplied`, () => {
      const component = shallow(<Login location="{ from: { pathname: '/' }" />)
      component.instance().loginRequest = jest.fn().mockResolvedValue()
      component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
      component.find('#loginForm').simulate('submit')
      expect(component.instance().loginRequest).not.toBeCalled()
    })

    it(`Doesn't call loginRequest if password is not supplied`, () => {
      const component = shallow(<Login location="{ from: { pathname: '/' }" />)
      component.instance().loginRequest = jest.fn().mockResolvedValue()
      component.instance().handleChange({target: {name: 'email', value: 'kevin'}})
      component.find('#loginForm').simulate('submit')
      expect(component.instance().loginRequest).not.toBeCalled()
    })

    it(`When submitted, sets login status to REQUESTED, and handleSubmit and loginRequest are called`, () => {
      const mockedHandleSubmit = jest.spyOn(Login.prototype, 'handleSubmit')
      const mockedLoginRequest = jest.spyOn(Login.prototype, 'loginRequest').mockResolvedValue()
      const component = shallow(<Login location="{from: {pathname: '/'}}" />)
      component.instance().handleChange({target: {name: 'email', value: 'kevin'}})
      component.instance().handleChange({target: {name: 'password', value: 'kevin'}})
      component.find('#loginForm').simulate('submit')
      const loginState = component.instance().state.login
      expect(loginState).toEqual(loginStatus.REQUESTED)
      expect(mockedHandleSubmit).toBeCalled()
      expect(mockedLoginRequest).toBeCalled()
    })

    it(`preventDefault is called when handling submit`, () => {
      const component = shallow(<Login location="{from: {pathname: '/'}}" />)
      const e = {}
      e.preventDefault = jest.fn()
      component.instance().handleSubmit(e)
      expect(e.preventDefault).toBeCalled()
    })
  })

  describe(`loginRequest`, () => {
    it(`Sets login status to successful when loginRequest is successful`, async () => {
      const component = shallow(<Login location="{from: {pathname: '/'}}" />)
      R.__Rewire__('session', {login: jest.fn().mockResolvedValue({ email: 'kevin' })})
      const session = R.__get__('session')
      await component.instance().loginRequest('tester', 'secret')
      expect(await session.login).toBeCalled()
      expect(component.instance().state.login).toEqual(loginStatus.SUCCESSFUL)
      R.__ResetDependency__('session')
    })

    it(`Sets login status to failure when loginRequest fails`, async () => {
      const component = shallow(<Login location="{from: {pathname: '/'}}" />)
      R.__Rewire__('session', {login: jest.fn().mockRejectedValue(new Error('Incorrect credentials'))})
      const session = R.__get__('session')
      await component.instance().loginRequest('tester', 'secret')
      expect(await session.login).toBeCalled()
      expect(component.instance().state.login).toEqual(loginStatus.FAILED)
      R.__ResetDependency__('session')
    })
  })

  describe(`loginUpdated`, () => {
    it(`Calls service to logout if the new state is LOGOUT`, () => {
      R.__Rewire__('session', {logout: jest.fn().mockReturnValue(), update: jest.fn()})
      const session = R.__get__('session')
      const component = shallow(<Login location="{from: {pathname: '/'}}" />)
      component.instance().loginUpdated(loginStatus.LOGOUT)
      expect(session.logout).toBeCalled()
      R.__ResetDependency__('session')
    })
  })
})
