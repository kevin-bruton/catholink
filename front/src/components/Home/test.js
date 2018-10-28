/* global describe it expect jest */
import React from 'react'
import { Home } from '@components/Home'
import { shallow } from 'enzyme'
import * as services from '@services/request'
import * as status from '@status/manager'

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

  it('Makes post call to get gospel when mounted and gospel is undefined', () => {
    const mockedPost = jest.spyOn(services, 'post')
      .mockImplementation(() => {})
    jest.spyOn(status, 'getState')
      .mockImplementation(() => undefined)
    shallow(<Home />)
    expect.assertions(1)
    expect(mockedPost).toBeCalled()
    mockedPost.mockRestore()
  })

  it(`Doesn't make post call to get gospel when mounted and gospel is defined`, () => {
    const mockedPost = jest.spyOn(services, 'post')
      .mockImplementation(() => {})
    jest.spyOn(status, 'getState')
      .mockImplementation(() => ({ title: 'title', text: 'text' }))
    shallow(<Home />)
    expect.assertions(1)
    expect(mockedPost).not.toBeCalled()
    mockedPost.mockRestore()
  })

  it('getGospel gets the gospel', async () => {
    expect.assertions(2)
    const spiedGetGospel = jest.spyOn(Home.prototype, 'getGospel')
    const gospel = await spiedGetGospel()
    expect(gospel.title).toBeTruthy()
    expect(gospel.text).toBeTruthy()
  })

  it('getGospel sets default title and text when post rejects', async () => {
    jest.spyOn(services, 'post')
      .mockImplementation(() => Promise.reject(new Error()))
    const gospel = await Home.prototype.getGospel()
    expect(gospel.title).toEqual(`Couldn't get Gospel`)
    expect(gospel.text).toEqual(`Couldn't get Gospel`)
  })
})
