import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import {validateSession} from '@services'
import {setStoreValue, subscribeStoreChanges, unsubscribeStoreChanges, storeCategory, loginStatus} from '@store'

export class PrivateRoute extends React.Component {
  constructor (props) {
    super(props)
    this.state = {loggedIn: undefined}
    this.loginStoreChange = this.loginStoreChange.bind(this)
  }

  async componentDidMount () {
    const loggedIn = await validateSession()
    this.setState({loggedIn})
    loggedIn === true
      ? setStoreValue(storeCategory.LOGIN, loginStatus.SUCCESSFUL)
      : setStoreValue(storeCategory.LOGIN, loginStatus.FAILURE)
    subscribeStoreChanges(storeCategory.LOGIN, 'PrivateRoute', this.loginStoreChange)
  }

  componentWillUnmount () {
    unsubscribeStoreChanges(storeCategory.LOGIN, 'PrivateRoute')
  }

  loginStoreChange (newLoginStatus) {
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
