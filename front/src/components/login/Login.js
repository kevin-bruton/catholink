import React from 'react'
import { Redirect } from 'react-router-dom'

import { userActions } from '@actions'
import { spinner } from './spinner'
import { literals } from './literals'

export class LoginPage extends React.Component {
  constructor (props) {
    super(props)

    // reset login status
    this.props.dispatch(userActions.logout())

    this.state = { username: '', password: '', submitted: false }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleSubmit (e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { username, password } = this.state
    const { dispatch } = this.props
    if (username && password) {
      dispatch(userActions.login(username, password))
    }
  }

  render () {
    const { loggingIn, loggedIn, loginFailure } = this.props
    const { username, password, submitted } = this.state
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (loggedIn) {
      return <Redirect to={from} />
    }
    return (
      <div className='col-md-6 col-md-offset-3'>
        <h2>Login</h2>
        <form name='form' onSubmit={this.handleSubmit}>
          <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
            <label htmlFor='username'>{literals.username}</label>
            <input type='text' className='form-control' name='username' value={username} onChange={this.handleChange} />
            {submitted && !username &&
            <div className='help-block'>{literals.usernameRequired}</div>
            }
          </div>
          <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
            <label htmlFor='password'>{literals.password}</label>
            <input type='password' className='form-control' name='password' value={password} onChange={this.handleChange} />
            {submitted && !password &&
              <div className='help-block'>{literals.passwordRequired}</div>
            }
            {loginFailure && <div>{literals.incorrectCredentials}</div>}
          </div>
          <div className='form-group'>
            <button className='btn btn-primary'>Login</button>
            {loggingIn &&
              <img alt='' src={spinner} />
            }
          </div>
        </form>
      </div>
    )
  }
}
