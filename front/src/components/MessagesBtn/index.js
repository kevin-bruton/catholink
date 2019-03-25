import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import styles from './styles.scss'
import {literals} from './literals'
import {statusType, getStatus, subscribeStatus} from '@status'
import {connectSocket} from '@services/socket'

export class MessagesBtn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      numMessages: getStatus(statusType.MESSAGES).reduce((acc, cur) => cur.status === 'read' ? acc : acc + 1, 0)
    }
    this.updateNumMessages = this.updateNumMessages.bind(this)
    const currentUser = getStatus(statusType.USER)
    connectSocket(currentUser.profileId)
    subscribeStatus(statusType.MESSAGES, 'MessageBtn', this.updateNumMessages)
  }

  updateNumMessages (messages) {
    console.log(messages)
    const numMessages = Object.keys(messages).reduce((acc, cur) => acc + messages[cur].reduce((acc, cur) => cur.status === 'read' ? acc : acc + 1, 0), 0)
    console.log(`numMessages=${numMessages}`)
    this.setState({numMessages})
  }

  componentDidMount () {
    // getSocket().on('MESSAGE_TO_CLIENT', () => {
    //   this.setState({numMessages: this.state.numMessages + 1})
    // })
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
