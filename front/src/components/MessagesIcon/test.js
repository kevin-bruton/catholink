/* global describe it expect */
import React from 'react'
import {MessagesIcon, __RewireAPI__ as P} from '@components/MessagesIcon'
import {shallow} from 'enzyme'

describe('The MessagesIcon Component', () => {
  describe('The Renderer', () => {
    it(`renders the profile button`, () => {
      P.__set__('getStatus', () => ({firstName: 'Joe', surname: 'Blow', email: 'joe'}))
      const wrapper = shallow(<MessagesIcon />)
      expect(wrapper.find('#MessagesIcon')).toHaveLength(1)
      expect(wrapper.find('#MessagesIcon > span.button')).toHaveLength(1)
      expect(wrapper.find('#MessagesIcon span.icon')).toHaveLength(1)
    })

    it(`renders the profile menu when showProfileMenu state is true`, () => {
      const wrapper = shallow(<MessagesIcon />)
      wrapper.instance().setState({showProfileMenu: true},
        () => expect(wrapper.find('#profileMenu').prop('hidden')).toBe(false))
    })

    it(`doesn't render the profile menu when showProfileMenu state is false`, () => {
      const wrapper = shallow(<MessagesIcon />)
      wrapper.instance().setState({showProfileMenu: false},
        () => expect(wrapper.find('#profileMenu').prop('hidden')).toBe(true))
    })
  })

  describe(`Constructor`, () => {
    it(`sets user state to the status value`, () => {
      const user = {firstName: 'Joe'}
      P.__set__('getStatus', () => user)
      const wrapper = shallow(<MessagesIcon />)
      expect(wrapper.instance().state.user).toEqual(user)
    })
  })

  describe('toggleShowProfileMenu', () => {
    it(`toggles state to show or hide the profile menu`, () => {
      const wrapper = shallow(<MessagesIcon />)
      expect(wrapper.instance().state.showProfileMenu).toBe(false)
      wrapper.instance().toggleShowProfileMenu()
      expect(wrapper.instance().state.showProfileMenu).toBe(true)
      wrapper.instance().toggleShowProfileMenu()
      expect(wrapper.instance().state.showProfileMenu).toBe(false)
    })

    it.skip(`adds a click event listener to close menu if profile menu shows`, () => {
    })

    it.skip(`removes the click event listener when profile menu is hidden`, () => {
    })
  })

  describe('componentWillUnmount', () => {
    it(`removes click event listener if it still exists`, () => {
      const wrapper = shallow(<MessagesIcon />)
      wrapper.unmount()
      // cannot test the existence or not of the event listener
    })
  })

  describe('clickEv', () => {
    it.skip(`if user clicks the profile button, the profile menu is toggled`, () => {
    })
  })
})