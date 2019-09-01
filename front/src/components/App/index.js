import React, { Component } from 'react'
import styles from './styles.scss'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Home, Login, Messages, Header, /* NavMenu, WidgetPanel, PublicityPanel,  */SignUp, SearchResults, Profile } from '@components'
import { PrivateRoute } from './PrivateRoute'
import { SignUpValidate } from '../SignUpValidate'

export class CathApp extends Component {
  render () {
    return (
      <div id='CathApp' className={styles.app}>
        <Header />
        <div className='columns'>
          <div className='column'>
            <Switch>
              <PrivateRoute exact path='/' component={Home} />
              <PrivateRoute path='/home' component={Home} />
              <PrivateRoute path='/messages' component={Messages} />
              <PrivateRoute path='/searchresults' component={SearchResults} />
              <PrivateRoute path='/profile/:profileId' component={Profile} />
              <Route path='/login' component={Login} />
              <Route path='/signup' component={SignUp} />
              <Route path='/signupvalidate' component={SignUpValidate} />
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
