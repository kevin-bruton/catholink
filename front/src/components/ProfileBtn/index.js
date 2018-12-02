import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import styles from './styles.scss'
import {literals} from './literals'

export class ProfileBtn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showProfileMenu: false
    }
    this.toggleShowProfileMenu = this.toggleShowProfileMenu.bind(this)
  }

  toggleShowProfileMenu () {
    this.setState({showProfileMenu: !this.state.showProfileMenu})
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
                  <img src='https://bulma.io/images/placeholders/96x96.png' alt='Users foto' />
                </figure>
              </div>
              <div className='media-content'>
                <p className='title is-4'>John Smith</p>
                <p className='subtitle is-6'>@johnsmith</p>
              </div>
            </div>

            <div className='content'>
              <div className='menu'>
                <div className={'menu-list ' + styles.profileMenuItems}>
                  <div><a>Settings</a></div>
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
