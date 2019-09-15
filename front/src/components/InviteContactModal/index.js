import React from 'react'
import {getStoreValue, setStoreValue, storeCategory} from '@store'
import {inviteContact as inviteContactService} from '@services/request'
import { spinner } from '../../assets/spinner'
import { literals } from './literals'

const SEND_INVITE = {
  REQUESTED: 'REQUESTED',
  FAILED: 'FAILED',
  SUCCESSFUL: 'SUCCESSFUL'
}

export class InviteContactModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contactInvite: SEND_INVITE.REQUESTED
    }
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount () {
    this.sendContactRequest()
  }

  async sendContactRequest () {
    try {
      const sendInvitationResult = await inviteContactService(this.props.inviter, this.props.invitee, this.props.message)
      this.setState({contactInvite: sendInvitationResult ? SEND_INVITE.SUCCESSFUL : SEND_INVITE.FAILED})
      const invitationsSent = getStoreValue(storeCategory.USER).invitationsSent
      invitationsSent.push(this.props.invitee)
      setStoreValue(storeCategory.USER, {...getStoreValue(storeCategory.USER), ...{invitationsSent}})
    } catch (err) {
      this.setState({contactInvite: SEND_INVITE.FAILED})
    }
  }

  closeModal () {
    this.props.close({modalActive: false})
  }

  render () {
    const INVITE_REQUESTED =
      <div>
        {literals.sendingInvite}
        <img alt='' src={spinner} />
      </div>
    const INVITE_SUCCESSFUL = 
      <div>
        {literals.inviteSucessful}
      </div>
    const INVITE_FAILED =
      <div>
        {literals.inviteFailed}
      </div>
    const getInviteResult = () => {
      return {
        [SEND_INVITE.REQUESTED]: INVITE_REQUESTED,
        [SEND_INVITE.SUCCESSFUL]: INVITE_SUCCESSFUL,
        [SEND_INVITE.FAILED]: INVITE_FAILED
      }[this.state.contactInvite]
    }
    return (
      <div id='signUpResultModal'
        className='modal is-active'>
        <div className='modal-background' />
        <div className='modal-content'>
          <div className='box'>
            <div className='content'>
              {getInviteResult()}
            </div>
            <button className={'button is-link '} onClick={this.props.closeModal}>Ok</button>
          </div>
        </div>
      </div>
    )
  }
}
