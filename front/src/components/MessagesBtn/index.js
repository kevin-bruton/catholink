import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import styles from './styles.scss'
import {literals} from './literals'
import {storeCategory, getStoreValue, subscribeStoreChanges} from '@store'
import {connectSocket} from '@services/socket'

export class MessagesBtn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      numMessages: getStoreValue(storeCategory.MESSAGES).reduce((acc, cur) => cur.status === 'read' ? acc : acc + 1, 0)
    }
    this.updateNumMessages = this.updateNumMessages.bind(this)
    const currentUser = getStoreValue(storeCategory.USER)
    connectSocket(currentUser.profileId)
    subscribeStoreChanges(storeCategory.MESSAGES, 'MessageBtn', this.updateNumMessages)
  }

  updateNumMessages (messages) {
    const numMessages = Object.keys(messages).reduce((acc, cur) => acc + messages[cur].reduce((acc, cur) => cur.status === 'read' ? acc : acc + 1, 0), 0)
    this.setState({numMessages})
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
