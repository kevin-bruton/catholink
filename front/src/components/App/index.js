import React, { Component } from 'react'
import styles from './styles.scss'
import { Route, Switch, withRouter } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import {
  News,
  SpiritualLife,
  Login,
  Messages,
  Header, /* NavMenu, WidgetPanel, PublicityPanel,  */
  SignUp,
  SearchResults,
  Profile,
  SignUpValidate,
  AcceptContact,
  ForgotPassword
} from '@components'

export class CathApp extends Component {
  render () {
    return (
      <div id='CathApp' className={styles.app}>
        <Header />
        <div className='columns'>
          <div className='column'>
            <Switch>
              <PrivateRoute exact path='/' component={News} />
              <PrivateRoute path='/spiritual' component={SpiritualLife} />
              <PrivateRoute path='/news' component={News} />
              <PrivateRoute path='/messages' component={Messages} />
              <PrivateRoute path='/searchresults' component={SearchResults} />
              <PrivateRoute path='/profile/:profileId' component={Profile} />
              <Route path='/login' component={Login} />
              <Route path='/signup' component={SignUp} />
              <Route path='/forgot-password' component={ForgotPassword}  />
              <Route path='/signupvalidate' component={SignUpValidate} />
              <Route path='/contact/accept' component={AcceptContact} />
            </Switch>
          </div>
          {/* <div className='column is-2'>
            <PublicityPanel />
          </div> */}
        </div>
      </div>
    )
  }
}

export const App = withRouter(CathApp)
