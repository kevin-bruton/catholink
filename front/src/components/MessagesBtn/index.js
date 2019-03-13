import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import styles from './styles.scss'
import {literals} from './literals'
import {statusType, getStatus} from '@status'
import {connectSocket} from '@services/socket'

export class MessagesBtn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      numMessages: 0
    }
    const currentUser = getStatus(statusType.USER)
    console.log('currentUser for profile: ', currentUser)
    connectSocket(currentUser.profileId)
  }

  render () {
    return (
      <div id='MessagesBtn'>
        <Link to='/messages'><span className={styles.myProfile + ' button is-link is-dark'} onClick={this.toggleShowProfileMenu}>
          <span>{literals.messages}: {this.state.numMessages}</span>
        </span></Link>
      </div>
    )
  }
}
