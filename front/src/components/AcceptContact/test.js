/* global describe it expect jest */
import React from 'react'
import {SignUpValidate, __RewireAPI__ as S} from './index'
import {shallow} from 'enzyme'

describe('The SignUpValidate Component', () => {
  describe('The Renderer', () => {
    beforeAll(() => {
      S.__set__('validateService', Promise.resolve(true))
    })
    afterAll(() => {
      __rewire_reset_all__
    })
    it(`renders requested message if validation state is 'REQUESTED'`, () => {
      const wrapper = shallow(<SignUpValidate />)
      wrapper.instance().setState({validation: 'REQUESTED'})
      expect(wrapper.find('#requestedMessage')).toHaveLength(1)
    })

    it(`doesn't render requested message if validation state is not 'REQUESTED'`, () => {
      const wrapper = shallow(<SignUpValidate />)
      wrapper.instance().setState({validation: 'SUCCESSFUL'})
      expect(wrapper.find('#requestedMessage')).toHaveLength(0)
    })

    it(`renders the validated message if validation state is 'SUCCESSFUL'`, () => {
      const wrapper = shallow(<SignUpValidate />)
      wrapper.instance().setState({validation: 'SUCCESSFUL'})
      expect(wrapper.find('#validatedMessage')).toHaveLength(1)
    })

    it(`doesn't render the validated message if validation state is not 'SUCCESSFUL'`, () => {
      const wrapper = shallow(<SignUpValidate />)
      wrapper.instance().setState({validation: 'REQUESTED'})
      expect(wrapper.find('#validatedMessage')).toHaveLength(0)
    })

    it(`renders the not validated message if validation state is 'FAILED'`, () => {
      const wrapper = shallow(<SignUpValidate />)
      wrapper.instance().setState({validation: 'FAILED'})
      expect(wrapper.find('#notValidatedMessage')).toHaveLength(1)
    })

    it(`doesn't render the not validated message if validation state is not 'FAILED'`, () => {
      const wrapper = shallow(<SignUpValidate />)
      wrapper.instance().setState({validation: 'REQUESTED'})
      expect(wrapper.find('#notValidatedMessage')).toHaveLength(0)
    })
  })

  describe('componentDidMount', () => {
    it(`calls validationRequest`, () => {
      const validationRequest = jest.spyOn(SignUpValidate.prototype, 'validationRequest')
        .mockImplementation(() => Promise.resolve(true))
      const wrapper = shallow(<SignUpValidate />)
      expect(validationRequest).toHaveBeenCalled()
    })
  })

  describe('validationRequest', () => {
    afterEach(() => {
      __rewire_reset_all__
    })
    it(`calls validate service and sets validation to 'SUCCESSFUL' if it was`, async () => {
      S.__set__('validateService', jest.fn(() => Promise.resolve(true)))
      const validateService = S.__get__('validateService')
      const wrapper = shallow(<SignUpValidate />)
      expect(validateService).toHaveBeenCalled()
      await wrapper.instance().validationRequest()
      expect(wrapper.instance().state.validation).toBe('SUCCESSFUL')
    })
    
    it(`calls validate service and sets validation to 'FAILED' if it resolves so`, async () => {
      S.__set__('validateService', jest.fn(() => Promise.resolve(false)))
      const validateService = S.__get__('validateService')
      const wrapper = shallow(<SignUpValidate />)
      expect(validateService).toHaveBeenCalled()
      await wrapper.instance().validationRequest()
      expect(wrapper.instance().state.validation).toBe('FAILED')
    })
    
    it(`calls validate service and sets validation to 'FAILED' if it throws an error`, async () => {
      S.__set__('validateService', jest.fn(() => Promise.reject({error: 'error'})))
      const validateService = S.__get__('validateService')
      const wrapper = shallow(<SignUpValidate />)
      expect(validateService).toHaveBeenCalled()
      await wrapper.instance().validationRequest()
      expect(wrapper.instance().state.validation).toBe('FAILED')
    })
  })
})