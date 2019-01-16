import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'

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

    this.state = {
      firstName: '',
      surname: '',
      email: '',
      password: '',
      passwordRepeat: '',
      signUpRequest: SIGNUP.NOT_SENT,
      canSubmit: false,
      error: {
        firstNameEmpty: false,
        surnameEmpty: false,
        emailEmpty: false,
        passwordEmpty: false,
        passwordRepeatEmpty: false,
        passwordsNotEqual: false
      }
    }
  }

  handleChange (e) {
    this.setState(e.target)
  }

  handleBlur (e) {
    const [name, value] = Object.keys(e.target)
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
    const { firstName, surname, email, password, passwordRepeat, error } = this.state
    error.firstNameEmpty = !firstName
    error.surnameEmpty = !surname
    error.emailEmpty = !email
    error.passwordEmpty = !password
    error.passwordRepeatEmpty =!passwordRepeat
    error.passwordsNotEqual = (password !== passwordRepeat)
    this.setState({error})
    return (!error.firstNameEmpty && !error.surnameEmpty && !error.emailEmpty && !error.passwordEmpty && !error.passwordRepeatEmpty && !error.passwordsNotEqual)
  }

  async signUpRequest () {
    const {firstName, surname, email, password} = this.state
    this.setState({signUpRequest: SIGNUP.REQUESTED}, async () => {
      try {
        await signUpService({firstName, surname, email, password})
        this.setState({signUpRequest: SIGNUP.SUCCESSFUL})
      } catch (err) {
        this.setState({signUpRequest: SIGNUP.FAILED})
      }
    })
  }

  render () {
    const { error } = this.state
    return (
      <div id='SignUpPage' className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle' className={'title is-3 ' + styles.separateTop}>{literals.startHere}</h2>
        <div className='columns'>
          <div className='column is-offset-4 is-4'>
            <form id='signUpForm' name='form' onSubmit={this.handleSubmit} className='box'>
              <div className='field' id='firstName'>
                <label className={styles.labelAlign + ' label'}>{literals.firstName}</label>
                <div className='control'>
                  <input className={'input' + (error.firstNameEmpty ? ' is-danger' : '')} type='text' placeholder={literals.firstName} name='firstName' onChange={this.handleChange} onBlur={this.handleBlur} />
                </div>
                <p id='firstNameReqMess' className='help is-danger'>{error.firstNameEmpty && literals.firstNameRequired}</p>
              </div>
              <div className='field' id='surname'>
                <label className={styles.labelAlign + ' label'}>{literals.surname}</label>
                <div className='control'>
                  <input className={'input' + (error.surnameEmpty ? ' is-danger' : '')} type='text' placeholder={literals.surname} name='surname' onChange={this.handleChange} onBlur={this.handleBlur} />
                </div>
                <p id='surnameReqMess' className='help is-danger'>{error.surnameEmpty && literals.surnameRequired}</p>
              </div>
              <div className='field' id='email'>
                <label className={styles.labelAlign + ' label'}>{literals.email}</label>
                <div className='control'>
                  <input className={'input' + (error.emailEmpty ? ' is-danger' : '')} type='text' placeholder={literals.email} name='email' onChange={this.handleChange} onBlur={this.handleBlur} />
                </div>
                <p id='emailReqMess' className='help is-danger'>{error.emailEmpty && literals.emailRequired}</p>
              </div>
              <div className='field' id='password'>
                <label className={styles.labelAlign + ' label'}>{literals.password}</label>
                <div className='control'>
                  <input className={'input' + (error.passwordEmpty ? ' is-danger' : '')} type='password' name='password' onChange={this.handleChange} onBlur={this.handleBlur} />
                </div>
                <p id='passReqMess' className='help is-danger'>{error.passwordEmpty && literals.passwordRequired}</p>
              </div>
              <div className='field' id='passwordRepeat'>
                <label className={styles.labelAlign + ' label'}>{literals.passwordRepeat}</label>
                <div className='control'>
                  <input className={'input' + ((error.passwordRepeatEmpty || error.passwordsNotEqual) ? ' is-danger' : '')} type='password' name='passwordRepeat' onChange={this.handleChange} onBlur={this.handleBlur} />
                </div>
                <p id='passRepeatReqMess' className='help is-danger'>{error.passwordRepeatEmpty && literals.passwordRepeatRequired}</p>
                <p id='samePassMess' className='help is-danger'>{error.passwordsNotEqual && literals.samePasswordsRequired}</p>
              </div>
              <div className='field' id='signUpBtn'>
                <div className={'control' + styles.flexbox}>
                  <button id='loginBtn' className={'button is-link ' + styles.flexitem} disabled={(this.signUpRequest === SIGNUP.REQUESTED)} >
                    {this.state.signUpRequest === SIGNUP.REQUESTED ? <img alt='' src={spinner} /> : literals.signUp}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div id="signUpResultModal" className={'modal' + (this.state.signUpRequest === SIGNUP.SUCCESSFUL ? ' is-active' : '')}>
          <div className='modal-background'></div>
          <div className='modal-content'>
            <div className='box'>
              <div className='content'>
                <p className='centre'>
                  {literals.emailSent1}<br />
                  {literals.emailSent2}<br />
                  {literals.emailSent3}
                </p>
              </div>
              <Link to='/Home'><button className={'button is-link '}>Ok</button></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
