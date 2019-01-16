/* global describe it expect jest */
import React from 'react'
import {SignUp, __RewireAPI__ as R} from '@components/SignUp'
import {shallow} from 'enzyme'

describe('The SignUp Component', () => {
  describe('Renderer', () => {
    it('renders the sign up form', () => {
      const signUp = shallow(<SignUp />)
      expect(signUp.find('#SignUpPage')).toHaveLength(1)
      expect(signUp.find('#pageTitle')).toHaveLength(1)
      expect(signUp.find('#signUpForm')).toHaveLength(1)
      expect(signUp.find('#firstName')).toHaveLength(1)
      expect(signUp.find('#surname')).toHaveLength(1)
      expect(signUp.find('#email')).toHaveLength(1)
      expect(signUp.find('#password')).toHaveLength(1)
      expect(signUp.find('#passwordRepeat')).toHaveLength(1)
      expect(signUp.find('#signUpBtn')).toHaveLength(1)
    })

    it(`doesn't render result modal if form not submitted`, () => {
      const signUp = shallow(<SignUp />)
      signUp.setState({signUpRequest: 'NOT_SENT'})
      expect(signUp.find('#signUpResultModal.is-active')).toHaveLength(0)
    })

    it('renders result modal when the form is submitted', () => {
      const signUp = shallow(<SignUp />)
      signUp.setState({signUpRequest: 'SUCCESSFUL'})
      expect(signUp.find('#signUpResultModal.is-active')).toHaveLength(1)
    })
  })

  describe('handleChange', () => {
    it('sets the state of input field when there are changes', () => {
      const firstName = 'Rocker'
      const signUp = shallow(<SignUp />)
      signUp.instance().handleChange({target: {firstName}})
      expect(signUp.instance().state.firstName).toEqual(firstName)
    })
  })

  describe('handleBlur', () => {
    it('sets an error in the state if a required field is empty', () => {
      const wrapper = shallow(<SignUp />)
      wrapper.instance().handleBlur({target: {firstName: ''}})
      expect(wrapper.instance().state.error.firstNameEmpty).toEqual(true)
      wrapper.instance().handleBlur({target: {surname: ''}})
      expect(wrapper.instance().state.error.surnameEmpty).toEqual(true)
      wrapper.instance().handleBlur({target: {email: ''}})
      expect(wrapper.instance().state.error.emailEmpty).toEqual(true)
      wrapper.instance().handleBlur({target: {password: ''}})
      expect(wrapper.instance().state.error.passwordEmpty).toEqual(true)
      wrapper.instance().handleBlur({target: {passwordRepeat: ''}})
      expect(wrapper.instance().state.error.passwordRepeatEmpty).toEqual(true)
    })

    it(`sets an error in the state if the passwords don't match`, () => {
      const wrapper = shallow(<SignUp />)
      wrapper.instance().setState({password: '12', repeatPassword: '34'})
      wrapper.instance().handleBlur({target: {password: '12'}})
      expect(wrapper.instance().state.error.passwordsNotEqual).toEqual(true)
    })
  })

  describe('handleSubmit', () => {
    it(`if inputValidated returns true, it calls signUpRequest`, () => {
      jest.spyOn(SignUp.prototype, 'inputValidated').mockReturnValue(true)
      const signUpRequest = jest.spyOn(SignUp.prototype, 'signUpRequest').mockResolvedValue(true)
      const wrapper = shallow(<SignUp />)
      wrapper.instance().handleSubmit()
      expect(signUpRequest).toBeCalled()
    })

    it(`if inputValidated returns false, it doen't call signUpRequest`, () => {
      jest.spyOn(SignUp.prototype, 'inputValidated').mockReturnValue(false)
      const signUpRequest = jest.spyOn(SignUp.prototype, 'signUpRequest').mockResolvedValue(true)
      const wrapper = shallow(<SignUp />)
      wrapper.instance().handleSubmit()
      expect(signUpRequest).not.toBeCalled()
    })
  })

  describe('inputValidated', () => {
    it('sets the errors in the state for the required fields without a value', () => {
      const wrapper = shallow(<SignUp />)
      wrapper.instance().setState({firstName: 'Joe', surname: '', email: 'blah'})
      wrapper.instance().inputValidated()
      expect(wrapper.instance().state.error.firstNameEmpty).toBe(false)
      expect(wrapper.instance().state.error.surnameEmpty).toBe(true)
      expect(wrapper.instance().state.error.emailEmpty).toBe(false)
      expect(wrapper.instance().state.error.passwordEmpty).toBe(true)
      expect(wrapper.instance().state.error.passwordRepeatEmpty).toBe(true)
    })

    it(`sets the error in the state when the passwords don't match`, () => {
      const wrapper = shallow(<SignUp />)
      wrapper.instance().setState({password: 'Joe', passwordRepeat: 'Jack'})
      wrapper.instance().inputValidated()
      expect(wrapper.instance().state.error.passwordsNotEqual).toBe(true)
    })

    it('returns true if there are no errors in the fields of the component', () => {
      const wrapper = shallow(<SignUp />)
      wrapper.instance().setState({
        firstName: 'Joe', surname: 'Blow', email: 'joe@mail.com', password: 'secret', passwordRepeat: 'secret'
      })
      expect(wrapper.instance().inputValidated()).toBe(true)
    })
  })

  describe('signUpRequest', () => {
    it(`calls the signUpService and sets signUpRequest state to 'SUCCESSFUL' if all OK`, async () => {
      R.__Rewire__('signUpService', () => Promise.resolve())
      const wrapper = shallow(<SignUp />)
      await wrapper.instance().signUpRequest()
      expect(wrapper.instance().state.signUpRequest).toBe('SUCCESSFUL')
    })

    it(`calls the signUpService and sets signUpRequest state to 'FAILED' if it throws an error`, async () => {
      R.__Rewire__('signUpService', () => Promise.reject())
      const wrapper = shallow(<SignUp />)
      await wrapper.instance().signUpRequest()
      expect(wrapper.instance().state.signUpRequest).toBe('FAILED')
    })
  })
})