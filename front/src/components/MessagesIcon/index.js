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
      numMessages: messageCount
    }
    this.updateNumMessages = this.updateNumMessages.bind(this)
    const currentUser = getStoreValue(storeCategory.USER)
    connectSocket(currentUser.profileId)
    subscribeStoreChanges(storeCategory.MESSAGES, 'MessageIcon', this.updateNumMessages)
  }

  countMessages (messages) {
    const messageCount = Object.keys(messages).reduce((acc, cur) => cur.reduce((acc, cur) => cur.status === 'read' ? acc : acc + 1, 0), 0)
    console.log('MessageIcon: messageCount=', messageCount)
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
