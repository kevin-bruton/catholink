import React, { Component } from 'react'
import styles from './App.scss'
import { Link, Route } from 'react-router-dom'
import Home from '../content-pages/home'
import About from '../content-pages/about'
import { usersLanguage } from '@helpers/get-users-language'

const literals = require('./literals')[usersLanguage]

class App extends Component {
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
                <li><Link className={window.location.pathname === '/' ? 'is-active' : null} to='/'>{literals.home}</Link></li>
                <li><Link className={window.location.pathname === '/about' ? 'is-active' : null}to='/about'>{literals.about}</Link></li>
              </ul>
            </aside>
          </div>
          <div className='column'>
            <Route exact path='/' component={Home} />
            <Route path='/about' component={About} />
          </div>
        </div>
      </div>
    )
  }
}

export default App
