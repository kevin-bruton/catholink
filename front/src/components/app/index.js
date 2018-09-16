import React, { Component } from 'react'
import styles from './App.scss'
import { createBrowserHistory } from 'history'
import { NavLink, Link, Route, Switch } from 'react-router-dom'
import {Home, Login} from '@components'
import { PrivateRoute } from '@containers'
import { literals } from './literals'
import { alertActions } from '@actions'

const history = createBrowserHistory()

export class App extends Component {
  constructor (props) {
    super(props)

    const { dispatch } = this.props
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear())
    })
  }
  render () {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <Link to='/'><h1 className={styles.title}>Catholink</h1></Link>
        </header>
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
              <Route path='/login' component={Login} />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
