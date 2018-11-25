import React from 'react'
import { Redirect } from 'react-router-dom'

import * as session from '@services/session'
import { spinner } from './spinner'
import { literals } from './literals'
import * as status from '@status'

export class Login extends React.Component {
  constructor (props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.loginUpdated = this.loginUpdated.bind(this)

    this.state = { username: '', password: '', login: status.login.LOGOUT }
    status.subscribe(status.type.LOGIN, this.loginUpdated)
    session.logout()
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit (e) {
    e && e.preventDefault()

    const { username, password } = this.state
    this.setState({ login: status.login.REQUESTED })
    if (username && password) {
      this.loginRequest(username, password)
    }
  }

  async loginRequest (username, password) {
    try {
      await session.login(username, password)
      status.update(status.type.LOGIN, status.login.SUCCESSFUL)
      this.setState({ login: status.login.SUCCESSFUL })
    } catch (err) {
      status.update(status.type.LOGIN, status.login.FAILED, err)
      this.setState({ login: status.login.FAILED })
    }
  }

  loginUpdated (newLoginState) {
    newLoginState === status.login.LOGOUT && session.logout()
    this.setState({ login: newLoginState })
  }

  render () {
    const { username, password, login } = this.state
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (login === status.login.SUCCESSFUL) {
      return <Redirect to={from} />
    }
    return (
      <div id='LoginPage' className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle'>Login</h2>
        <form id='loginForm' name='form' onSubmit={this.handleSubmit}>
          <div className={'form-group' + (login === status.login.FAILED ? ' has-error' : '')}>
            <label htmlFor='username'>{literals.username}</label>
            <input type='text' className='form-control' name='username' value={username} onChange={this.handleChange} />
            {login === status.login.REQUESTED && !username &&
            <div id='usernameReqMess' className='help-block'>{literals.usernameRequired}</div>
            }
          </div>
          <div className={'form-group' + (login === status.login.REQUESTED && !password ? ' has-error' : '')}>
            <label htmlFor='password'>{literals.password}</label>
            <input type='password' className='form-control' name='password' value={password} onChange={this.handleChange} />
            {login === status.login.REQUESTED && !password &&
              <div id='passReqMess' className='help-block'>{literals.passwordRequired}</div>
            }
            {(login === status.login.FAILED) && <div>{literals.incorrectCredentials}</div>}
          </div>
          <div className='form-group'>
            <button id='loginBtn' className='btn btn-primary'>Login</button>
            {(login === status.login.REQUESTED) &&
              <img alt='' src={spinner} />
            }
            {(login === status.login.FAILED) && <p>Login failed</p>}
          </div>
        </form>
      </div>
    )
  }
}
