import React from 'react'
import { NavLink } from 'react-router-dom'
import { literals } from './literals'
import styles from './styles.scss'

export class NavMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false
    }
    this.toggleOpenMenu = this.toggleOpenMenu.bind(this)
  }

  toggleOpenMenu () {
    const newOpenMenuVal = this.state.menuOpen ? false : true
    this.setState({menuOpen: newOpenMenuVal})
  }
  render () {
    const navIcon = <nav className={styles['nav-icon'] + (this.state.menuOpen ? ' ' + styles['nav-menu-open'] : '')} onClick={this.toggleOpenMenu}>
        <div className={styles['nav-icon-bar'] + ' ' + styles['nav-icon-bar1']}></div>
        <div className={styles['nav-icon-bar'] + ' ' + styles['nav-icon-bar2']}></div>
        <div className={styles['nav-icon-bar'] + ' ' + styles['nav-icon-bar3']}></div>
      </nav>
    const navMenu = <aside id='NavMenu' role="navigation" className={styles['nav-menu'] + (this.state.menuOpen ? ' ' + styles['nav-menu-open'] : '')}>
        <strong>Menu</strong>
        <ul>
          <li onClick={this.toggleOpenMenu}><NavLink activeClassName='is-active' exact to='/'>{literals.home}</NavLink></li>
          <li onClick={this.toggleOpenMenu}><NavLink activeClassName='is-active' to='/messages'>{literals.messages}</NavLink></li>
        </ul>
      </aside>
    return (
      <div>
        {navIcon}
        {navMenu}
      </div>
      )
  }
}
