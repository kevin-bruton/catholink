import React, { Component } from 'react'
import { getStoreValue, storeCategory, subscribeStoreChanges, sendStoreEvent, eventType } from '@store'
import { get as getRequest } from '@services/request'
import styles from './styles.scss'
import literals from './literals'

export class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contacts: null,
      contactFilterText: '',
      selectedContact: null,
      messageText: '',
      messages: getStoreValue(storeCategory.MESSAGES)
    }

    this.sendMsg = this.sendMsg.bind(this)
    this.contactSearch = this.contactSearch.bind(this)
    this.contactSelect = this.contactSelect.bind(this)
    this.messageTextUpdate = this.messageTextUpdate.bind(this)
    this.messagesUpdated = this.messagesUpdated.bind(this)

    this.currentUser = getStoreValue(storeCategory.USER)
    subscribeStoreChanges(storeCategory.MESSAGES, 'messagesComponent', this.messagesUpdated)
    console.log('messages:', this.state.messages)
  }

  async componentDidMount () {
    const contacts = await getRequest('/profile/contacts')
    Array.isArray(contacts) && this.setState({ contacts })
  }

  messagesUpdated (messages) {
    console.log('RECEIVED CHANGES IN MESSAGES IN MESSAGES COMPONENT FROM STORE. MESSAGES:', messages)
    // send status update to server if there are any messages not read yet
    this.updateReadMessages()
    this.setState({messages})
  }

  updateReadMessages () {
    sendStoreEvent(eventType.MSGS_STATUS_READ, this.state.selectedContact)
    /* const selectedContact = this.state.selectedContact
    messages[selectedContact] && (messages = messages[selectedContact].map(message => {
      if (message.from === selectedContact && message.status !== messageStatus.READ) {
        console.log('SENDING MSG_STATUS_UPDATE_TO_SERVER WITH MESSAGE WITH STATUS READ:', message)
        message.status = messageStatus.READ
        getSocket().emit('MSG_STATUS_UPDATE_TO_SERVER', JSON.stringify(message), serverResp => serverResp === 'OK' || console.log(`ERROR: server didn't update message status to 'read'`))
        sendStoreEvent(eventType.MSG_STATUS_UPDATE, message)
      }
      return message
    }))
    return messages */
  }

  sendMsg (e) {
    e.preventDefault()
    sendStoreEvent(eventType.MSG_TO_SERVER, {
      to: this.state.selectedContact,
      from: this.currentUser.profileId,
      text: this.state.messageText
    })
    this.setState({messageText: ''})
  }

  messageTextUpdate (e) {
    this.setState({ messageText: e.target.value })
  }

  contactSearch (e) {
    this.setState({ contactFilterText: e.target.value })
  }

  contactSelect (e) {
    console.log('contactSelect:', e.target.name)
    this.setState({ selectedContact: e.target.name }, this.updateReadMessages)
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
      <div id='ContactMessages'>
        Messages with the contact {selectedContact} appear here
        <div className={styles.messagesView}>
          {messages[selectedContact] && messages[selectedContact].map(message =>
            <div key={message._id} className={`${styles.message} ${message.to === selectedContact ? styles.myMessage : styles.othersMessage}`}>{message.text} <small>{message.status}</small></div>)}
        </div>
        <form onSubmit={this.sendMsg}>
          <div className={'field has-addons ' + styles.messageTyper}>
            <div className={'control ' + styles.inputter}>
              <input className={'input is-rounded '} type='text' placeholder={literals.typeMessage} onChange={this.messageTextUpdate} value={this.state.messageText} />
            </div>
            <div className='control'>
              <a className='button is-link is-rounded' onClick={this.sendMsg}>{literals.send}</a>
            </div>
          </div>
        </form>
      </div>
    // Show the messages with the contact selected or a generic message if none is selected
    const MESSAGE_BOX =
      <div id='MessageBox'>
        {selectedContact ? CONTACT_MESSAGES : literals.noContactSelected}
      </div>
    return (
      <div id='Messages' className={styles.Messages}>
        <div className={styles.title}>
          {literals.title}
        </div>
        <div className={'columns is-variable is-5 ' + styles.MessagesPage}>
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
