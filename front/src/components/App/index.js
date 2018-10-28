import React, { Component } from 'react'
import styles from './styles.scss'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom'
import { Home, Login, About, Header } from '@components'
import { PrivateRoute } from './PrivateRoute'
import { literals } from './literals'

export class CathApp extends Component {
  render () {
    return (
      <div className={styles.app}>
        <Header />
        <div className='columns'>
          <div className='column is-narrow'>
            <aside className='menu'>
              <ul className='menu-list'>
                <li><NavLink activeClassName='is-active' exact to='/'>{literals.home}</NavLink></li>
                <li><NavLink activeClassName='is-active' to='/about'>{literals.about}</NavLink></li>
                <li><NavLink activeClassName='is-active' to='/login'>{literals.logout}</NavLink></li>
              </ul>
            </aside>
          </div>
          <div className='column'>
            <Switch>
              <PrivateRoute exact path='/' component={Home} />
              <PrivateRoute path='/home' component={Home} />
              <PrivateRoute path='/about' component={About} />
              <Route path='/login' component={Login} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

export const App = withRouter(CathApp)
