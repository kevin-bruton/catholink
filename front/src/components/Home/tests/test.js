/* global describe it expect jest */
import React from 'react'
import { Home } from '@components/Home'
import { shallow } from 'enzyme'

describe('The Home Component', () => {
  it('Renders the date', () => {
    const wrapper = shallow(<Home />)
    expect(wrapper.find('#date')).toHaveLength(1)
  })

  it('Renders the gospel title', () => {
    const wrapper = shallow(<Home />)
    expect(wrapper.find('#gospelTitle')).toHaveLength(1)
  })

  it('Renders the gospel text', () => {
    const wrapper = shallow(<Home />)
    expect(wrapper.find('#gospelText')).toHaveLength(1)
  })

  it('Gets the gospel', () => {
    const getGospelSpy = jest.spyOn(Home.prototype, 'getGospel')
    shallow(<Home />)
    expect(getGospelSpy).toHaveBeenCalled()
    getGospelSpy.mockRestore()
  })
})
