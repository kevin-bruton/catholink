import React, {Component} from 'react'
import {getSocket} from '@services/socket'
import {getStatus, statusType, subscribeStatus} from '@status'
import {get as getRequest} from '@services/request'
import styles from './styles.scss'
import literals from './literals'

export class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contacts: null,
      contactFilterText: '',
      selectedContact: null,
      messageText: null,
      messages: getStatus(statusType.MESSAGES)
    }
    this.currentUser = getStatus(statusType.USER)
    subscribeStatus(statusType.MESSAGES, 'messagesComponent', messages => this.setState({messages}))

    this.sendMsg = this.sendMsg.bind(this)
    this.contactSearch = this.contactSearch.bind(this)
    this.contactSelect = this.contactSelect.bind(this)
    this.messageTextUpdate = this.messageTextUpdate.bind(this)
  }

  async componentDidMount () {
    const contacts = await getRequest('/profile/contacts')
    Array.isArray(contacts) && this.setState({contacts})
    getSocket().on('MESSAGE_TO_CLIENT', (messageStr, sendResponse) => {
      console.log(messageStr)
      const messages = this.state.messages
      messages.push(JSON.parse(messageStr))
      this.setState({messages})
      sendResponse('ARRIVED_AT_DESTINATION')
    })
  }

  sendMsg () {
    console.log('trying to send message...')
    const dateTime = (new Date()).getTime()
    const message = {
      _id: `${this.currentUser.profileId}_${this.state.selectedContact}_${dateTime}`,
      text: this.state.messageText,
      status: 'notSent',
      dateTime,
      from: this.currentUser.profileId,
      to: this.state.selectedContact
    }
    getSocket().emit('PRIVATE_MESSAGE', JSON.stringify(message),
      serverResponse => console.log('Server response:', serverResponse))
    // Set messageInput to ''
  }

  messageTextUpdate (e) {
    this.setState({messageText: e.target.value})
  }

  contactSearch (e) {
    this.setState({contactFilterText: e.target.value})
  }

  contactSelect (e) {
    console.log('contactSelect:', e.target.name)
    this.setState({selectedContact: e.target.name})
    // Call messages endpoint to get messages between the two contacts
  }

  render () {
    const contacts = this.state.contacts
    const selectedContact = this.state.selectedContact
    const messages = this.state.messages
    // List of contacts with the conversations held with them
    const CONVERSATIONS_BOX =
      <div id='ConversationsBox' className={styles.ConversationsBox}>
        <div className='tile is-ancestor'><div className='tile is-vertical'>
          <input type='text' className={`input tile ${styles.SearchBox}`} placeholder={literals.contactSearch} onChange={this.contactSearch} />
          {contacts &&
            contacts
              .filter(contact => contact.firstName.includes(this.state.contactFilterText) || contact.surname.includes(this.state.contactFilterText))
              .map(contact =>
                <a key={contact.profileId} className={`tile box ${styles.ContactBox}`} onClick={this.contactSelect} name={contact.profileId}>
                  {contact.firstName} {contact.surname}
                </a>)
          }
        </div></div>
      </div>
    // Messages box where the messages interchanged with the contact are seen
    const CONTACT_MESSAGES =
      <div>
        Messages with the contact {selectedContact} appear here
        <div className={styles.messagesView}>
          {messages[selectedContact] && messages[selectedContact].map(message => <div className={styles.message}>{message.text}</div>)}
        </div>
        <div className={'field has-addons ' + styles.messageTyper}>
          <div className={'control ' + styles.inputter}>
            <input className={'input is-rounded '} type='text' placeholder={literals.typeMessage} onChange={this.messageTextUpdate} />
          </div>
          <div className='control'>
            <a className='button is-link is-rounded' onClick={this.sendMsg}>{literals.send}</a>
          </div>
        </div>
      </div>
    // Show the messages with the contact selected or a generic message if none is selected
    const MESSAGE_BOX =
      <div id='MessageBox'>
        {selectedContact ? CONTACT_MESSAGES : literals.noContactSelected}
      </div>
    return (
      <div id='Messages' className={styles.MessagesPage}>
        <div className='columns is-variable is-5'>
          <div className={`column is-2 box ${styles.ConversationsBox}`}>
            {CONVERSATIONS_BOX}
          </div>
          <div className={`column box ${styles.MessageBox}`}>
            {MESSAGE_BOX}
          </div>
        </div>
      </div>
    )
  }
}
