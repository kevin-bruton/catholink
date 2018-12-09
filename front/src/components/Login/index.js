import React from 'react'
import { Redirect } from 'react-router-dom'

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

    this.state = {
      username: '',
      password: '',
      login: loginStatus.LOGOUT,
      redirecting: false
    }
  }

  componentDidMount () {
    session.logout()
    setStatus(statusType.LOGIN, loginStatus.LOGOUT)
    subscribeStatus(statusType.LOGIN, this.constructor.name, this.loginUpdated)
  }

  componentWillUnmount () {
    unsubscribeStatus(statusType.LOGIN, this.constructor.name)
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit (e) {
    e && e.preventDefault()

    const { username, password } = this.state
    this.setState({ login: loginStatus.REQUESTED })
    if (username && password) {
      this.loginRequest(username, password)
    }
  }

  async loginRequest (username, password) {
    try {
      await session.login(username, password)
      setStatus(statusType.LOGIN, loginStatus.SUCCESSFUL)
      this.setState({redirecting: true})
      this.setState({login: loginStatus.SUCCESSFUL})
    } catch (err) {
      setStatus(statusType.LOGIN, loginStatus.FAILED, err)
      this.setState({login: loginStatus.FAILED})
    }
  }

  loginUpdated (newLoginState) {
    newLoginState === loginStatus.LOGOUT && session.logout()
    ;(newLoginState === loginStatus.SUCCESSFUL && this.state.redirecting) &&
      this.setState({ login: newLoginState })
  }

  render () {
    const { username, password, login } = this.state
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (login === loginStatus.SUCCESSFUL) {
      return <Redirect to={from} />
    }
    return (
      <div id='LoginPage' className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle'>Login</h2>
        <form id='loginForm' name='form' onSubmit={this.handleSubmit}>
          <div className={'form-group' + (login === loginStatus.FAILED ? ' has-error' : '')}>
            <label htmlFor='username'>{literals.username}</label>
            <input type='text' className='form-control' name='username' value={username} onChange={this.handleChange} />
            {login === loginStatus.REQUESTED && !username &&
            <div id='usernameReqMess' className='help-block'>{literals.usernameRequired}</div>
            }
          </div>
          <div className={'form-group' + (login === loginStatus.REQUESTED && !password ? ' has-error' : '')}>
            <label htmlFor='password'>{literals.password}</label>
            <input type='password' className='form-control' name='password' value={password} onChange={this.handleChange} />
            {login === loginStatus.REQUESTED && !password &&
              <div id='passReqMess' className='help-block'>{literals.passwordRequired}</div>
            }
            {(login === loginStatus.FAILED) && <div>{literals.incorrectCredentials}</div>}
          </div>
          <div className='form-group'>
            <button id='loginBtn' className='btn btn-primary'>Login</button>
            {(login === loginStatus.REQUESTED) &&
              <img alt='' src={spinner} />
            }
            {(login === loginStatus.FAILED) && <p>Login failed</p>}
          </div>
        </form>
      </div>
    )
  }
}
