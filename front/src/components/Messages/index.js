import React, {Component} from 'react'
import {getSocket} from '@services/socket'
import {getStatus, statusType} from '@status'
import {get as getRequest} from '@services/request'
import styles from './styles.scss'
import literals from './literals'

export class Messages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contacts: null
    }
    this.currentUser = getStatus(statusType.USER)
    this.sendMsg = this.sendMsg.bind(this)
  }

  async componentDidMount () {
    const contacts = await getRequest('/profile/contacts')
    Array.isArray(contacts) && this.setState({contacts})
  }

  sendMsg () {
    console.log('trying to send message...')
    getSocket().emit('PRIVATE MESSAGE', this.currentUser.profileId, 'MY MSG')
  }

  render () {
    const contacts = this.state.contacts
    console.log(contacts)
    return (
      <div>
        <div className={styles.gridContainer}>
          <div className={styles.contactSearch}>Contact search</div><div className={styles.contactMessagingTitle}>Message with Contact X</div>
          <div className={styles.messagesView} style={{gridRowEnd: contacts ? contacts.length + 2 : 2}}>
            <div>Messages</div>
            <div className={'field has-addons ' + styles.messageTyper}>
              <div className={'control ' + styles.inputter}>
                <input className={'input is-rounded '} type='text' placeholder={literals.typeMessage} />
              </div>
              <div className='control'>
                <a className='button is-link is-rounded' onClick={this.sendMsg}>{literals.send}</a>
              </div>
            </div>
          </div>
          {contacts && contacts.map(contact => <div className={styles.contact} key={contact.profileId}>{contact.firstName} {contact.surname}</div>)}
        </div>
      </div>
    )
  }
}
