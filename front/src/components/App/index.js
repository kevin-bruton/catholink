import React, { Component } from 'react'
import styles from './styles.scss'
import { Route, Switch, withRouter } from 'react-router-dom'
import { Home, Login, About, Header, NavMenu, WidgetPanel, PublicityPanel } from '@components'
import { PrivateRoute } from './PrivateRoute'

export class CathApp extends Component {
  render () {
    return (
      <div id='CathApp' className={styles.app}>
        <Header />
        <div className='columns'>
          <div className='column is-2'>
            <NavMenu />
            <WidgetPanel />
          </div>
          <div className='column'>
            <Switch>
              <PrivateRoute exact path='/' component={Home} />
              <PrivateRoute path='/home' component={Home} />
              <PrivateRoute path='/about' component={About} />
              <Route path='/login' component={Login} />
            </Switch>
          </div>
          <div className='column is-2'>
            <PublicityPanel />
          </div>
        </div>
      </div>
    )
  }
}

export const App = withRouter(CathApp)
