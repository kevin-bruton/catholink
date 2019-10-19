import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { MessagesIcon } from '../MessagesIcon'
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
    (document.querySelector('#NavMenu') && document.querySelector('#NavMenu').contains(e.target))
      || (document.querySelector('#NavIcon') && document.querySelector('#NavIcon').contains(e.target))
      || this.toggleOpenMenu()
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
    const navMenuBackground = <div id="NavMenuBackground" className={styles.navMenuBackground + (this.state.menuOpen ? ' ' + styles.menuOpen : '')}></div>
    const navIcon =
      <div className={styles.navIconBox}>
        <nav id="NavIcon" className={styles.navIcon} onClick={this.toggleOpenMenu}>
          <div className={styles.navIconBar + ' ' + styles.navIconBar1}></div>
          <div className={styles.navIconBar + ' ' + styles.navIconBar2}></div>
          <div className={styles.navIconBar + ' ' + styles.navIconBar3}></div>
        </nav>
        <MessagesIcon />
      </div>
    const closeMenuIcon =
      <div className={styles.closeIcon} onClick={this.toggleOpenMenu}>
        <div className={styles.closeIconBar + ' ' + styles.closeIconBar1}></div>
        <div className={styles.closeIconBar + ' ' + styles.closeIconBar2}></div>
      </div>
    const navMenuHeader = <div className={styles.navMenuTitle}>
        <div></div>
        <img className={styles.navMenuTitleImg} src="/static/media/brandname.8add5242.svg" alt="Catholink title"/>
        {closeMenuIcon}
      </div>
    const userInfoHeader =
      <div className={'media ' + styles.userInfoHeader}>
        <div className='media-left'>
          <figure className='image is-48x48'>
            {this.state.user.avatar ? <img src={this.state.user.avatar} alt='avatar' /> : <i className='fas fa-user fa-3x' alt='users foto' />}
          </figure>
        </div>
        <div className={'media-content ' + styles.userInfoHeaderContent}>
          <p className='title is-4'>{this.state.user.firstName} {this.state.user.surname}</p>
          <p className='subtitle is-6'>{this.state.user.email}</p>
        </div>
      </div>
    const navMenu = <aside id='NavMenu' role="navigation" className={styles.navMenu + (this.state.menuOpen ? ' ' + styles.navMenuOpen : '')}>
        {navMenuHeader}
        {userInfoHeader}
        <ul className={styles.linkItems}>
          <li onClick={this.toggleOpenMenu}><NavLink activeClassName='is-active' exact to='/'>{literals.news}</NavLink></li>
          <li onClick={this.toggleOpenMenu}><NavLink activeClassName='is-active' to='/messages'>{literals.messages}</NavLink></li>
          <li onClick={this.toggleOpenMenu}><NavLink activeClassName='is-active' exact to='/spiritual'>{literals.spiritual}</NavLink></li>
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
