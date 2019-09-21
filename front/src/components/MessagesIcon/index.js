import React, { Component } from 'react'
import styles from './styles.scss'
import {storeCategory, getStoreValue, subscribeStoreChanges} from '@store'
import {connectSocket} from '@services/socket'

export class MessagesIcon extends Component {
  constructor (props) {
    super(props)
    const messages = getStoreValue(storeCategory.MESSAGES)
    const messageCount = this.countMessages(messages)
    this.state = {
      numMessages: messageCount,
      currentUser: getStoreValue(storeCategory.USER)
    }
    this.updateNumMessages = this.updateNumMessages.bind(this)
    connectSocket(this.state.currentUser.profileId)
    subscribeStoreChanges(storeCategory.MESSAGES, 'MessageIcon', this.updateNumMessages)
  }

  countMessages (messages) {
    const MSG_READ_STATUS = 3
    const messageCount = Object.keys(messages).reduce((acc, cur, i) =>
      acc + messages[cur].reduce((acc, cur) => 
        cur.status !== MSG_READ_STATUS && cur.to === this.state.currentUser.profileId ? acc + 1: acc, 0), 0)
    console.log('MessageIcon: messageCount =', messageCount)
    return messageCount
  }

  updateNumMessages (messages) {
    this.setState({numMessages: this.countMessages(messages)})
  }

  render () {
    const numMessages = this.state.numMessages
    const jsx = numMessages ? <div className={styles.messagesIcon}>{numMessages}</div> : ''
    return (jsx)
  }
}
