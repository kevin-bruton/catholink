/* global describe it expect jest */
import React from 'react'
import { Home } from '@components/Home'
import { shallow } from 'enzyme'
import * as services from '@services/request'

describe('The Home Component', () => {
  it('Renders the date, gospel title and gospel text elements', () => {
    const wrapper = shallow(<Home />)
    expect(wrapper.find('#date')).toHaveLength(1)
    expect(wrapper.find('#gospelTitle')).toHaveLength(1)
    expect(wrapper.find('#gospelText')).toHaveLength(1)
  })

  it('Tries to get gospel when component is mounted', () => {
    const getGospelSpy = jest.spyOn(Home.prototype, 'getGospel')
    shallow(<Home />)
    expect(getGospelSpy).toHaveBeenCalled()
    getGospelSpy.mockRestore()
  })

  it('Makes post call to get gospel', async () => {
    const mockedPost = jest.spyOn(services, 'post')
    mockedPost.mockImplementation(() => console.log('mock implemented'))
    const component = shallow(<Home />)
    expect.assertions(1);
    expect(mockedPost).toBeCalled()
    mockedPost.mockRestore()
  })
})
