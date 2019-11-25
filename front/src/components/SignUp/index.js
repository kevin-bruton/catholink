import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import sharedStyles from '@sharedStyles'
import supportedLocales from '@helpers/supported-locales'

import {signUp as signUpService} from '@services/request'
import { spinner } from '../../assets/spinner'
import { literals } from './literals'

const SIGNUP = {
  NOT_SENT: 'NOT_SENT',
  REQUESTED: 'REQUESTED',
  FAILED: 'FAILED',
  SUCCESSFUL: 'SUCCESSFUL'
}

export class SignUp extends React.Component {
  constructor (props) {
    super(props)
    this.className = 'SignUpPage'
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggleLocaleDropdown = this.toggleLocaleDropdown.bind(this)

    this.state = {
      firstName: '',
      surname: '',
      gender: '',
      email: '',
      password: '',
      passwordRepeat: '',
      signUpRequest: SIGNUP.NOT_SENT,
      canSubmit: false,
      locale: {text: '-------'},
      isLocaleDropdownOpen: false,
      error: {
        firstNameEmpty: false,
        surnameEmpty: false,
        genderEmpty: false,
        localeEmpty: false,
        emailEmpty: false,
        passwordEmpty: false,
        passwordRepeatEmpty: false,
        passwordsNotEqual: false
      }
    }
  }

  handleChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  handleBlur (e) {
    const name = e.target.name
    const value = e.target.value
    const error = this.state.error
    error[name + 'Empty'] = !value
    if (name === 'passwordRepeat' || name === 'password') {
      error.passwordsNotEqual = (this.state.password !== this.state.passwordRepeat)
    }
    this.setState({error})
  }

  handleSubmit (e) {
    e && e.preventDefault()
    this.inputValidated() && this.signUpRequest()
  }

  inputValidated () {
    const { firstName, surname, gender, email, password, passwordRepeat, locale, error } = this.state
    error.firstNameEmpty = !firstName
    error.surnameEmpty = !surname
    error.genderEmpty = !gender
    error.localeEmpty = !locale.code
    error.emailEmpty = !email
    error.passwordEmpty = !password
    error.passwordRepeatEmpty = !passwordRepeat
    error.passwordsNotEqual = (password !== passwordRepeat)
    this.setState({error})
    return (!error.firstNameEmpty && !error.surnameEmpty && !error.genderEmpty && !error.localeEmpty && !error.emailEmpty && !error.passwordEmpty && !error.passwordRepeatEmpty && !error.passwordsNotEqual)
  }

  toggleLocaleDropdown () {
    this.setState({isLocaleDropdownOpen: !this.state.isLocaleDropdownOpen})
  }

  selectLocale (locale) {
    this.setState({locale, isLocaleDropdownOpen: false})
  }

  async signUpRequest () {
    const {firstName, surname, gender, locale, email, password} = this.state
    this.setState({signUpRequest: SIGNUP.REQUESTED}, async () => {
      try {
        const signedUp = await signUpService({firstName, surname, gender, locale: locale.code, email, password})
        this.setState({signUpRequest: signedUp ? SIGNUP.SUCCESSFUL : SIGNUP.FAILED})
      } catch (err) {
        this.setState({signUpRequest: SIGNUP.FAILED})
      }
    })
  }

  render () {
    const { error } = this.state
    const SIGNUP_REQUEST_MODAL =
      <div id='signUpResultModal'
          className={'modal' + ((this.state.signUpRequest === SIGNUP.SUCCESSFUL || this.state.signUpRequest === SIGNUP.FAILED) ? ' is-active' : '')}>
        <div className='modal-background' />
        <div className='modal-content'>
          <div className='box'>
            <div className='content'>
              {
                this.state.signUpRequest === SIGNUP.SUCCESSFUL &&
                  <p className='centre'>
                    {literals.emailSent1}<br />
                    {literals.emailSent2}<br />
                    {literals.emailSent3}
                  </p>
              }{
                this.state.signUpRequest === SIGNUP.FAILED &&
                  <p className='centre'>
                    {literals.emailNotSent1}<br />
                    {literals.emailNotSent2}<br />
                    {literals.emailNotSent3}
                  </p>
              }
            </div>
            <Link to='/Home'><button className={'button is-link '}>Ok</button></Link>
          </div>
        </div>
      </div>
    const FIRSTNAME =
      <div className='field' id='firstName'>
        <label className={styles.labelAlign + ' label'}>{literals.firstName}</label>
        <div className='control'>
          <input className={'input' + (error.firstNameEmpty ? ' is-danger' : '')} type='text' placeholder={literals.firstName} name='firstName' onChange={this.handleChange} onBlur={this.handleBlur} />
        </div>
        <p id='firstNameReqMess' className='help is-danger'>{error.firstNameEmpty && literals.firstNameRequired}</p>
      </div>
    const SURNAME =
      <div className='field' id='surname'>
        <label className={styles.labelAlign + ' label'}>{literals.surname}</label>
        <div className='control'>
          <input className={'input' + (error.surnameEmpty ? ' is-danger' : '')} type='text' placeholder={literals.surname} name='surname' onChange={this.handleChange} onBlur={this.handleBlur} />
        </div>
        <p id='surnameReqMess' className='help is-danger'>{error.surnameEmpty && literals.surnameRequired}</p>
      </div>
    const GENDER =
      <div className='field' id='gender'>
        <label className={styles.labelAlign + ' label'}>{literals.gender}</label>
        <div className="control" onChange={this.handleChange}>
          <label className={styles.radioBlock}>
            <input type="radio" name="gender" value="male"/>
            <span className={styles.radioLabel}>{literals.male}</span>
          </label>
          <label className={styles.radioBlock}>
            <input type="radio" name="gender" value="female"/>
            <span className={styles.radioLabel}>{literals.female}</span>
          </label>
        </div>
      </div>
    const LANG_PREF =
      <div className={'field ' + styles.langPref} id='langPref'>
        <label className={styles.labelAlign + ' label'}>{literals.langPref}</label>
        <div className={'dropdown' + (this.state.isLocaleDropdownOpen ? ' is-active' : '')}>
          <div className="dropdown-trigger" onClick={this.toggleLocaleDropdown}>
            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
              <span>{this.state.locale.text}</span>
              <span className="icon is-small">
                <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {supportedLocales.map(locale =>
                <a key={locale.code} className="dropdown-item" onClick={this.selectLocale.bind(this, locale)}>{locale.text}</a>
              )}
            </div>
          </div> 
        </div>
      </div>
    const EMAIL =
      <div className='field' id='email'>
        <label className={styles.labelAlign + ' label'}>{literals.email}</label>
        <div className='control'>
          <input className={'input' + (error.emailEmpty ? ' is-danger' : '')} type='text' placeholder={literals.email} name='email' onChange={this.handleChange} onBlur={this.handleBlur} />
        </div>
        <p id='emailReqMess' className='help is-danger'>{error.emailEmpty && literals.emailRequired}</p>
      </div>
    const PASSWORD =
      <div className='field' id='password'>
        <label className={styles.labelAlign + ' label'}>{literals.password}</label>
        <div className='control'>
          <input className={'input' + (error.passwordEmpty ? ' is-danger' : '')} type='password' name='password' onChange={this.handleChange} onBlur={this.handleBlur} />
        </div>
        <p id='passReqMess' className='help is-danger'>{error.passwordEmpty && literals.passwordRequired}</p>
      </div>
    const PASSWORD_REPEAT =
      <div className='field' id='passwordRepeat'>
        <label className={styles.labelAlign + ' label'}>{literals.passwordRepeat}</label>
        <div className='control'>
          <input className={'input' + ((this.state.passwordRepeat && this.state.password !== this.state.passwordRepeat) ? ' is-danger' : '')} type='password' name='passwordRepeat' onChange={this.handleChange} onBlur={this.handleBlur} />
        </div>
        <p id='passRepeatReqMess' className='help is-danger'>{error.passwordRepeatEmpty && literals.passwordRepeatRequired}</p>
        <p id='samePassMess' className='help is-danger'>{this.state.password !== this.state.passwordRepeat && this.state.passwordRepeat && literals.samePasswordsRequired}</p>
      </div>
    const SIGNUP_BUTTON =
      <div className='field' id='signUpBtn'>
        <div className={'control' + styles.flexbox}>
          <button id='signUpBtn' className={'button is-link ' + styles.flexitem} disabled={(this.signUpRequest === SIGNUP.REQUESTED)} >
            {this.state.signUpRequest === SIGNUP.REQUESTED ? <img alt='' src={spinner} /> : literals.signUp}
          </button>
        </div>
      </div>
    return (
      <div id='SignUpPage' className={'col-md-6 col-md-offset-3 ' + styles.signUpBox}>
        <h2 id='pageTitle' className={sharedStyles.pageHeading}>{literals.startHere}</h2>
        <div className='columns'>
          <div className='column is-offset-4 is-4'>
            <form id='signUpForm' name='form' onSubmit={this.handleSubmit} className='box'>
              {FIRSTNAME}
              {SURNAME}
              {GENDER}
              {LANG_PREF}
              {EMAIL}
              {PASSWORD}
              {PASSWORD_REPEAT}
              {SIGNUP_BUTTON}
            </form>
          </div>
        </div>
        {SIGNUP_REQUEST_MODAL}
      </div>
    )
  }
}
