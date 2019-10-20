import React from 'react'
import { Link } from 'react-router-dom'
import sharedStyles from '@sharedStyles'

import {acceptContact as acceptContactService} from '@services/request'
import { spinner } from '../../assets/spinner'
import { literals } from './literals'

const CONTACT_ACCEPTED = {
  REQUESTED: 'REQUESTED',
  FAILED: 'FAILED',
  SUCCESSFUL: 'SUCCESSFUL'
}

export class AcceptContact extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contactAccepted: CONTACT_ACCEPTED.REQUESTED,
      invitersName: null
    }
  }

  componentDidMount () {
    this.acceptContactRequest()
  }

  async acceptContactRequest () {
    const path = window.location.pathname
    const code = path.substring(path.lastIndexOf('/') + 1)
    try {
      const inviter = await acceptContactService(code)
      this.setState({
        contactAccepted: (inviter.fullname ? CONTACT_ACCEPTED.SUCCESSFUL : CONTACT_ACCEPTED.FAILED),
        inviter
      })
    } catch (err) {
      this.setState({contactAccepted: CONTACT_ACCEPTED.FAILED})
    }
  }

  render () {
    const REQUESTED_ACCEPT_CONTACT =
      <span id='contactAcceptRequested'>
        <h1 className='is-size-3'>{literals.accepting}</h1>
        <img alt='' src={spinner} />
      </span>
    const SUCCESSFUL_ACCEPT_CONTACT =
      this.state.inviter ? (<span id='contactAcceptValidated'>
        <h1 className='is-size-3'>{literals.newContactHeading(this.state.inviter.fullname)}</h1>
        <p>{literals.acceptedContactLine1}</p>
        <p>{literals.acceptedContactLine2(this.state.inviter.fullname)}</p>
        <p>{literals.acceptedContactLine3(this.state.inviter.gender)}</p>
        <p>{literals.acceptedContactLine4(this.state.inviter.gender)}</p>
        <br /><Link to={`/profile/${this.state.inviter.profileId}`}><button className='button is-link is-small'>{literals.viewInvitersProfile(this.state.inviter.fullname)}</button></Link>
      </span>)
      : <span></span>
    const FAILED_ACCEPT_CONTACT =
      <span id='contactAcceptFailed'>
        <h1 className='is-size-3'>{literals.failedHeading}</h1>
        <p>{literals.failedLine1}</p>
        <p>{literals.failedLine2}</p>
      </span>
    const getContent = () => {
      switch (this.state.contactAccepted) {
        case CONTACT_ACCEPTED.REQUESTED: return REQUESTED_ACCEPT_CONTACT
        case CONTACT_ACCEPTED.SUCCESSFUL: return SUCCESSFUL_ACCEPT_CONTACT
        case CONTACT_ACCEPTED.FAILED: return FAILED_ACCEPT_CONTACT
      }
    }
    return (
      <div id='AcceptContactPage' className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle' className={sharedStyles.pageHeading}>{literals.startHere}</h2>
        <div className='columns'>
          <div className='column is-offset-2 is-8'>
            <div className='box'>
              <div className='has-text-centered'>
                {getContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
