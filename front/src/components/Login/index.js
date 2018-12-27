import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import styles from './styles.scss'

import * as session from '@services/session'
import { spinner } from './spinner'
import { literals } from './literals'
import {loginStatus, statusType, subscribeStatus, unsubscribeStatus, setStatus} from '@status'

export class Login extends React.Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.loginUpdated = this.loginUpdated.bind(this)
    this.handleBlur = this.handleBlur.bind(this)

    this.state = {
      email: '',
      password: '',
      login: loginStatus.LOGOUT,
      error: {
        emailEmpty: false,
        passwordEmpty: false
      }
    }
  }

  componentDidMount () {
    session.logout()
    setStatus(statusType.LOGIN, loginStatus.LOGOUT, () => 
      subscribeStatus(statusType.LOGIN, 'LoginPage', this.loginUpdated)
    )
  }

  componentWillUnmount () {   
    unsubscribeStatus(statusType.LOGIN, 'LoginPage')
  }

  handleBlur (e) {
    const {name, value} = e.target
    const error = this.state.error
    error[name + 'Empty'] = !value
    this.setState({error})
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit (e) {
    e && e.preventDefault()

    if (this.inputValidated()) {
      this.setState({ login: loginStatus.REQUESTED })
      this.loginRequest()
    }
  }

  inputValidated () {
    const {email, password, error} = this.state
    
    if (!email) {
      error.emailEmpty = true
      this.setState({error})
    }
    if (!password) {
      error.passwordEmpty = true
      this.setState({error})
    }
    return !!(email && password)
  }

  async loginRequest () {
    const {email, password} = this.state
    try {
      await session.login(email, password)
      setStatus(statusType.LOGIN, loginStatus.SUCCESSFUL)
      this.setState({login: loginStatus.SUCCESSFUL})
    } catch (err) {
      setStatus(statusType.LOGIN, loginStatus.FAILED, err)
      this.setState({login: loginStatus.FAILED})
    }
  }

  loginUpdated (newLoginState) {
    if (newLoginState === loginStatus.LOGOUT) {
      session.logout()
      this.setState({login: newLoginState})
    } else if (newLoginState === loginStatus.SUCCESSFUL)
      this.setState({ login: newLoginState })
  }

  render () {
    const { login, error } = this.state
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (login === loginStatus.SUCCESSFUL) {
      return <Redirect to={from} />
    }
    return (
      <div id='LoginPage' className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle' className={'title is-3 ' + styles.separateTop}>{literals.startHere}</h2>
        <div className='columns'>
          <div className='column is-offset-4 is-4'>
            <form id='loginForm' name='form' onSubmit={this.handleSubmit} className='box'>
              <div className='help is-danger'>{(login === loginStatus.FAILED) && literals.incorrectCredentials} </div>
              <div className='field'>
                <label className={styles.labelAlign + ' label'}>{literals.email}</label>
                <div className='control'>
                  <input className={'input' + (error.emailEmpty ? ' is-danger' : '')} type='text' placeholder={literals.email} name='email' onChange={this.handleChange} onBlur={this.handleBlur} />
                </div>
                <p id='emailReqMess' className='help is-danger'>{error.emailEmpty && literals.emailRequired}</p>
              </div>
              <div className='field'>
                <label className={styles.labelAlign + ' label'}>{literals.password}</label>
                <div className='control'>
                  <input className={'input' + (error.passwordEmpty ? ' is-danger' : '')} type='password' name='password' onChange={this.handleChange} onBlur={this.handleBlur} />
                </div>
                <p id='passReqMess' className='help is-danger'>{error.passwordEmpty && literals.passwordRequired}</p>
              </div>
              <div className='field'>
                <div className={'control' + styles.flexbox}>
                  <button id='loginBtn' className={'button is-link ' + styles.flexitem} disabled={(login === loginStatus.REQUESTED)}>
                    {login === loginStatus.REQUESTED ? <img alt='' src={spinner} /> : literals.signIn}
                  </button>
                </div>
              </div>
            </form>
            <div className={'box ' + styles.separateTop}>
              <h2 className='subtitle is 5'>{literals.cathNotMember}</h2>
              <Link to='/SignUp'><button id='signUpBtn' className={'button is-link ' + styles.flexitem}>{literals.signUp}</button></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
