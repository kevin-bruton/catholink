import React, { Component } from 'react'
import styles from './styles.scss'
import {storeCategory, getStoreValue, subscribeStoreChanges} from '@store'
import {connectSocket} from '@services/socket'

export class MessagesIcon extends Component {
  constructor (props) {
    super(props)
    this.state = {
      numMessages: getStoreValue(storeCategory.MESSAGES).reduce((acc, cur) => cur.status === 'read' ? acc : acc + 1, 0)
    }
    this.updateNumMessages = this.updateNumMessages.bind(this)
    const currentUser = getStoreValue(storeCategory.USER)
    connectSocket(currentUser.profileId)
    subscribeStoreChanges(storeCategory.MESSAGES, 'MessageIcon', this.updateNumMessages)
  }

  updateNumMessages (messages) {
    const numMessages = Object.keys(messages).reduce((acc, cur) => acc + messages[cur].reduce((acc, cur) => cur.status === 'read' ? acc : acc + 1, 0), 0)
    this.setState({numMessages})
  }

  render () {
    const numMessages = this.state.numMessages
    const jsx = numMessages ? <div className={styles.messagesIcon}>{numMessages}</div> : ''
    return (jsx)
  }
}
