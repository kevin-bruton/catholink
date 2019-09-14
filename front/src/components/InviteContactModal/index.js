import React from 'react'

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
      this.setState({
        contactInvite: sendInvitationResult ? SEND_INVITE.SUCCESSFUL : SEND_INVITE.FAILED
      })
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
      switch (this.state.contactInvite) {
        case SEND_INVITE.REQUESTED: return INVITE_REQUESTED
        case SEND_INVITE.SUCCESSFUL: return INVITE_SUCCESSFUL
        case SEND_INVITE.FAILED: return INVITE_FAILED
      }
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
