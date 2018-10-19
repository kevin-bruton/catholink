import React from 'react'
import { Redirect } from 'react-router-dom'

import { userService } from '@services'
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
    userService.logout()
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit (e) {
    e.preventDefault()

    this.setState({ login: status.login.REQUESTED })
    const { username, password } = this.state
    if (username && password) {
      this.login(username, password)
    }
  }

  login (username, password) {
    userService.login(username, password)
      .then(
        user => {
          status.update(status.type.LOGIN, status.login.SUCCESSFUL)
          this.setState({ login: status.login.SUCCESSFUL })
        },
        error => {
          status.update(status.type.LOGIN, status.login.FAILED, error)
          this.setState({ login: status.login.FAILED })
        }
      )
  }

  loginUpdated (newLoginState) {
    console.log(newLoginState)
    newLoginState === status.login.LOGOUT && userService.logout()
    this.setState({ login: newLoginState })
  }

  render () {
    const { username, password, login } = this.state
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (login === status.login.SUCCESSFUL) {
      return <Redirect to={from} />
    }
    return (
      <div className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle'>Login</h2>
        <form id='loginForm' name='form' onSubmit={this.handleSubmit}>
          <div className={'form-group' + (login === status.login.FAILED ? ' has-error' : '')}>
            <label htmlFor='username'>{literals.username}</label>
            <input type='text' className='form-control' name='username' value={username} onChange={this.handleChange} />
            {login === status.login.REQUESTED && !username &&
            <div className='help-block'>{literals.usernameRequired}</div>
            }
          </div>
          <div className={'form-group' + (login === status.login.REQUESTED && !password ? ' has-error' : '')}>
            <label htmlFor='password'>{literals.password}</label>
            <input type='password' className='form-control' name='password' value={password} onChange={this.handleChange} />
            {login === status.login.REQUESTED && !password &&
              <div className='help-block'>{literals.passwordRequired}</div>
            }
            {(login === status.login.FAILED) && <div>{literals.incorrectCredentials}</div>}
          </div>
          <div className='form-group'>
            <button id='loginBtn' className='btn btn-primary'>Login</button>
            {(login === status.login.REQUESTED) &&
              <img alt='' src={spinner} />
            }
          </div>
        </form>
      </div>
    )
  }
}
