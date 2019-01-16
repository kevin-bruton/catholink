import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import styles from './styles.scss'
import {literals} from './literals'
import {statusType, getStatus} from '@status'

export class ProfileBtn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showProfileMenu: false,
      user: getStatus(statusType.USER)
    }
    this.toggleShowProfileMenu = this.toggleShowProfileMenu.bind(this)
    this.clickEv = this.clickEv.bind(this)
  }

  componentWillUnmount () {
    document.querySelector('body').removeEventListener('mousedown', this.clickEv, true)
  }

  clickEv (e) {
    document.querySelector('#ProfileBtn').contains(e.target) || this.toggleShowProfileMenu()
  }

  toggleShowProfileMenu () {
    this.setState({showProfileMenu: !this.state.showProfileMenu},
      () => this.state.showProfileMenu
        ? document.querySelector('body').addEventListener('mousedown', this.clickEv, true)
        : document.querySelector('body').removeEventListener('mousedown', this.clickEv, true)
    )
  }

  render () {
    return (
      <div id='ProfileBtn'>
        <span className={styles.myProfile + ' button is-link is-dark'} onClick={this.toggleShowProfileMenu}>
          <span>{literals.myProfile}</span>
          <span className='icon is-small'>
            <i className='fas fa-arrow-circle-down' />
          </span>
        </span>
        <div id='profileMenu' className={'card ' + styles.profileMenu} hidden={!this.state.showProfileMenu}>
          <div className='card-content'>
            <div className='media'>
              <div className='media-left'>
                <figure className='image is-48x48'>
                  <i className='fas fa-user fa-3x' alt='users foto' />
                </figure>
              </div>
              <div className='media-content'>
                <p className='title is-4'>{this.state.user.firstName} {this.state.user.surname}</p>
                <p className='subtitle is-6'>{this.state.user.email}</p>
              </div>
            </div>

            <div className='content'>
              <div className='menu'>
                <div className={'menu-list ' + styles.profileMenuItems}>
                  <div><a>{literals.settings}</a></div>
                  <div><Link to='/login' onClick={this.toggleShowProfileMenu}>{literals.logout}</Link></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
