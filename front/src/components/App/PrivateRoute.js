import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import {validateSession} from '@services'
import {setStatus, subscribeStatus, unsubscribeStatus, statusType, loginStatus} from '@status'

export class PrivateRoute extends React.Component {
  constructor (props) {
    super(props)
    this.state = {loggedIn: undefined}
    this.loginStatusChange = this.loginStatusChange.bind(this)
  }

  async componentDidMount () {
    const loggedIn = await validateSession()
    this.setState({loggedIn})
    loggedIn === true
      ? setStatus(statusType.LOGIN, loginStatus.SUCCESSFUL, () => subscribeStatus(statusType.LOGIN, 'PrivateRoute', this.loginStatusChange))
      : setStatus(statusType.LOGIN, loginStatus.FAILURE, () => subscribeStatus(statusType.LOGIN, 'PrivateRoute', this.loginStatusChange))
  }

  componentWillUnmount () {
    unsubscribeStatus(statusType.LOGIN, 'PrivateRoute')
  }

  loginStatusChange (newLoginStatus) {
    newLoginStatus === loginStatus.SUCCESSFUL
      ? this.setState({loggedIn: true})
      : this.setState({loggedIn: false})
  }

  render () {
    const {component: Component, ...rest} = this.props

    return (
      <Route {...rest} render={props => (
        this.state.loggedIn !== undefined &&
          (this.state.loggedIn === true
            ? (<Component {...props} />)
            : (<Redirect to={{pathname: '/login', state: {from: props.location}}} />)
          )
      )} />
    )
  }
}
