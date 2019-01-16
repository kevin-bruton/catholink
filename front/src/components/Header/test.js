/* global describe it expect */
import React from 'react'
import { Header, __RewireAPI__ as H } from '@components/Header'
import { shallow } from 'enzyme'

describe('The Header Component', () => {
  describe('Renderer', () => {
    it('renders the header', () => {
      const component = shallow(<Header />)
      expect(component.find('header')).toHaveLength(1)
      expect(component.find('header > .columns > .column img')).toHaveLength(1)
      expect(component.find('header > .columns > .column > h1')).toHaveLength(1)
    })

    it(`renders the profile button if login status is successful`, () => {
      const wrapper = shallow(<Header />)
      wrapper.instance().setState({login: 'SUCCESSFUL'})
      expect(wrapper.find('ProfileBtn')).toHaveLength(1)
    })

    it(`doesn't render the profile button if login status isn't successful`, () => {
      const wrapper = shallow(<Header />)
      wrapper.instance().setState({login: 'FAILED'})
      expect(wrapper.find('ProfileBtn')).toHaveLength(0)
    })
  })

  describe('componentDidMount', () => {
    it(`sets the state based on the status, then subscribes to login status`, () => {
      H.__set__('getStatus', () => 'LOGGED_IN')
      const wrapper = shallow(<Header />)
      expect(wrapper.instance().state.login).toBe('LOGGED_IN')
    })
  })

  describe('componentWillUnmount', () => {
    it('calls unsubscribeStatus login', () => {
      H.__set__('unsubscribeStatus', jest.fn())
      const unsubscribeStatus = H.__get__('unsubscribeStatus')
      const wrapper = shallow(<Header />)
      wrapper.instance().componentWillUnmount()
      expect(unsubscribeStatus).toHaveBeenCalled()
    })
  })

  describe('loginStatusChange', () => {
    it(`sets the login state based on the new value passed in`, () => {
      const newValue = 'NEW_VALUE'
      const wrapper = shallow(<Header />)
      wrapper.instance().loginStatusChange(newValue)
      expect(wrapper.instance().state.login).toBe(newValue)
    })
  })
})
