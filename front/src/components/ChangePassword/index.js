/**
 * THIS COMPONENT IS INCOMPLETE
 * IT WAS INITIALLY CREATED TO IMPLEMENT
 * THE CHANGE PASSWORD OPTION FOR AN AUTHENTICATED USER
 */
import React from 'react'
/* import { Link } from 'react-router-dom' */
import styles from './styles.scss'

/* import {changePassword, validate} from '@services/request' */
import {validateSession} from '@services/session'
import { spinner } from '../../assets/spinner'
import { literals } from './literals'

const status = {
  PAGE_LOADING: 'PAGE_LOADING',
  AUTHENTICATED_RESET: 'AUTHENTICATED_RESET',
  CODE_RESET: 'CODE_RESET',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  VERIFY_EMAIL_SENT: 'VERIFY_EMAIL_SENT',
  CHANGE_REQUESTED: 'CHANGE_REQUESTED',
  CHANGE_FAILED: 'CHANGE_FAILED',
  CHANGE_SUCCESSFUL: 'CHANGE_SUCCESSFUL'
}

export class ChangePassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pageStatus: status.PAGE_LOADING,
      code: undefined,
      userAuthenticated: undefined
    }
  }

  async componentDidMount () {
    const userAuthenticated = await validateSession()
    const path = window.location.pathname
    const lastStrAfterForwardSlash = path.substring(path.lastIndexOf('/') + 1)
    const code = lastStrAfterForwardSlash === 'change-password' ? undefined : lastStrAfterForwardSlash
    const pageStatus = userAuthenticated
      ? status.AUTHENTICATED_FORM
      : code
        ? status.CODE_FORM
        : status.VERIFY_EMAIL
    this.setState({code, userAuthenticated, pageStatus})
  }
  
  render () {
    const PAGE_LOADING_VIEW =
      <span id='contactAcceptRequested'>
        <h1 className='is-size-3'>{literals.accepting}</h1>
        <img alt='' src={spinner} />
      </span>/* 
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
      </span> */
    return (
      <div id='AcceptContactPage' className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle' className={'title is-3 ' + styles.separateTop}>{literals.startHere}</h2>
        <div className='columns'>
          <div className='column is-offset-2 is-8'>
            <div className='box'>
              <div className='has-text-centered'>
                {{
                  [status.PAGE_LOADING]: PAGE_LOADING_VIEW/* ,
                  [status.AUTHENTICATED_RESET]: AUTHENTICATED_FORM,
                  [status.CODE_RESET]: CODE_FORM,
                  [status.VERIFY_EMAIL]: SEND_EMAIL_FORM,
                  [status.VERIFY_EMAIL_SENT]: SENT_EMAIL_VIEW,
                  [status.CHANGE_REQUESTED]: CHANGE_REQUESTED_VIEW,
                  [status.CHANGE_FAILED]: CHANGE_FAILED_VIEW,
                  [status.CHANGE_SUCCESSFUL]: CHANGE_SUCCESSFUL_VIEW */
                }[this.state.pageStatus]}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
