/* global describe it expect jest beforeAll afterAll */
import React from 'react'
import { Home, __RewireAPI__ as R } from '@components/Home'
import { shallow } from 'enzyme'
// import * as services from '@services/request'

describe('The Home Component', () => {
  beforeAll(() => R.__Rewire__('post', () => Promise.resolve()))
  afterAll(() => R.__ResetDependency__('post'))
  it('Renders the date, gospel title and gospel text elements', async () => {
    const wrapper = shallow(<Home />)
    expect(wrapper.find('#date')).toHaveLength(1)
    expect(wrapper.find('#gospelTitle')).toHaveLength(1)
    expect(wrapper.find('#gospelText')).toHaveLength(1)
    await wrapper.instance().getGospel()
  })

  describe(`componentDidMount`, () => {
    it('Tries to get gospel if gospel is undefined', async () => {
      const gospel = {title: 'Gospel', text: 'Gospel text'}
      R.__Rewire__('status', {
        getState: jest.fn().mockReturnValue(undefined),
        type: { GOSPEL: 'GOSPEL' },
        update: jest.fn()
      })
      const getGospelSpy = jest.spyOn(Home.prototype, 'getGospel')
        .mockImplementation(() => Promise.resolve(gospel))
      await shallow(<Home />)
      expect(getGospelSpy).toHaveBeenCalled()
      expect(getGospelSpy()).resolves.toEqual(gospel)
    })

    it(`Doesn't try to get gospel if gospel is defined`, async () => {
      const gospel = {title: 'Gospel', text: 'Gospel text'}
      R.__Rewire__('status', {
        getState: jest.fn().mockReturnValue(gospel),
        type: { GOSPEL: 'GOSPEL' },
        update: jest.fn()
      })
      const getGospelSpy = jest.spyOn(Home.prototype, 'getGospel')
        .mockImplementation(() => Promise.resolve(gospel))
      await shallow(<Home />)
      expect(getGospelSpy).not.toHaveBeenCalled()
    })

    it(`Calls getStatus to get the gospel`, async () => {
      R.__Rewire__('status',
        {update: jest.fn(), getState: jest.fn(), type: { GOSPEL: 'GOSPEL' }}
      )
      const status = R.__get__('status')
      await shallow(<Home />)
      expect(status.getState).toBeCalled()
      R.__ResetDependency__('status')
    })

    it(`Calls update status with the gospel if gospel is undefined`, async () => {
      R.__Rewire__('status',
        {
          update: jest.fn(),
          getState: jest.fn().mockReturnValue(undefined),
          type: { GOSPEL: 'GOSPEL' }
        }
      )
      const status = R.__get__('status')
      const gospel = {title: 'Gospel', text: 'Gospel text'}
      jest.spyOn(Home.prototype, 'getGospel')
        .mockImplementation(() => Promise.resolve(gospel))
      await shallow(<Home />)
      expect(status.update).toBeCalledWith(status.type.GOSPEL, gospel)
      R.__ResetDependency__('status')
    })
  })

  describe(`getGospel`, () => {
    it(`Makes a post request to get the gospel with users language and the date`, async () => {
      R.__Rewire__('post', jest.fn().mockResolvedValue('OK'))
      const post = R.__get__('post')
      const date = (new Date()).toLocaleString('en-AU').slice(0, 10).split('/').reverse().join('-')
      const lang = 'en'
      await Home.prototype.getGospel()
      expect(post).toBeCalledWith('gospel', {lang, date})
      R.__ResetDependency__('post')
    })

    it(`Returns the gospel if post request is successful`, async () => {
      const gospel = {title: 'Gospel', text: 'Gospel text'}
      R.__Rewire__('post', jest.fn().mockResolvedValue(gospel))
      const gospelReturned = await Home.prototype.getGospel()
      expect(gospelReturned).toEqual(gospel)
      R.__ResetDependency__('post')
    })

    it(`Returns the gospel with dummy values if post request isn't successful`, async () => {
      const gospel = {title: `Couldn't get Gospel`, text: `Couldn't get Gospel`}
      R.__Rewire__('post', jest.fn().mockRejectedValue('NOK'))
      const gospelReturned = await Home.prototype.getGospel()
      expect(gospelReturned).toEqual(gospel)
      R.__ResetDependency__('post')
    })
  })
})
