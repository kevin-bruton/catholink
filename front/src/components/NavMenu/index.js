import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { literals } from './literals'
import styles from './styles.scss'
import {storeCategory, getStoreValue} from '@store'

export class NavMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false,
      user: getStoreValue(storeCategory.USER)
    }
    this.toggleOpenMenu = this.toggleOpenMenu.bind(this)
    this.clickEv = this.clickEv.bind(this)
  }

  clickEv (e) {
    document.querySelector('#NavMenu').contains(e.target) || document.querySelector('#NavIcon').contains(e.target) || this.toggleOpenMenu()
  }

  toggleOpenMenu () {
    const body = document.querySelector('body')
    if (this.state.menuOpen) {
      this.setState({menuOpen: false})
      body.removeEventListener('mousedown', this.clickEv, true)
    } else {
      body.addEventListener('mousedown', this.clickEv, true)
      this.setState({menuOpen: true})
    }
  }
  render () {
    const navMenuBackground = <div id="NavMenuBackground" className={styles['nav-menu-background'] + (this.state.menuOpen ? ' ' + styles['menu-open'] : '')}></div>
    const navIcon = <nav id="NavIcon" className={styles['nav-icon'] + (this.state.menuOpen ? ' ' + styles['nav-menu-open'] : '')} onClick={this.toggleOpenMenu}>
        <div className={styles['nav-icon-bar'] + ' ' + styles['nav-icon-bar1']}></div>
        <div className={styles['nav-icon-bar'] + ' ' + styles['nav-icon-bar2']}></div>
        <div className={styles['nav-icon-bar'] + ' ' + styles['nav-icon-bar3']}></div>
      </nav>
    const navMenuHeader = <div className={styles['nav-menu-title']}>
        <div></div>
        <img className={styles['nav-menu-title-img']} src="/static/media/brandname.8add5242.svg" alt="Catholink title"/>
        {navIcon}
      </div>
    const userInfoHeader =
      <div className={'media ' + styles.userInfoHeader}>
        <div className='media-left'>
          <figure className='image is-48x48'>
            <i className='fas fa-user fa-3x' alt='users foto' />
          </figure>
        </div>
        <div className={'media-content ' + styles.userInfoHeaderContent}>
          <p className='title is-4'>{this.state.user.firstName} {this.state.user.surname}</p>
          <p className='subtitle is-6'>{this.state.user.email}</p>
        </div>
      </div>
    const navMenu = <aside id='NavMenu' role="navigation" className={styles['nav-menu'] + (this.state.menuOpen ? ' ' + styles['nav-menu-open'] : '')}>
        {navMenuHeader}
        {userInfoHeader}
        <ul className={styles.linkItems}>
          <li onClick={this.toggleOpenMenu}><NavLink activeClassName='is-active' exact to='/'>{literals.home}</NavLink></li>
          <li onClick={this.toggleOpenMenu}><NavLink activeClassName='is-active' to='/messages'>{literals.messages}</NavLink></li>
          <li onClick={this.toggleOpenMenu}><Link id='ViewMyProfileMenuOpt' to={`/profile/${this.state.user.profileId}`}>{literals.viewProfile}</Link></li>
          <li onClick={this.toogleOpenMenu}><Link id='LogoutMenuOpt' to='/login'>{literals.logout}</Link></li>
        </ul>
      </aside>
    return (
      <div>
        {navMenuBackground}
        {navIcon}
        {navMenu}
      </div>
      )
  }
}
