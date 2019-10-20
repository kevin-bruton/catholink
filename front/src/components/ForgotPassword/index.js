import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import sharedStyles from '@sharedStyles'

import {requestSendForgotEmail, requestValidatePwdResetCode} from '@services/request'
import { spinner } from '../../assets/spinner'
import { literals } from './literals'

const MODE = {
  EMAIL_NOT_REQUESTED: 'SEND_EMAIL_NOT_REQUESTED',
  EMAIL_REQUESTED: 'SEND_EMAIL_REQUESTED',
  EMAIL_FAILED: 'SEND_EMAIL_FAILED',
  EMAIL_SUCCESSFUL: 'SEND_EMAIL_SUCCESSFUL',
  VALIDATE_ASK_PWD: 'VALIDATE_ASK_PWD',
  VALIDATE_REQUESTED: 'VALIDATE_REQUESTED',
  VALIDATE_SUCCESSFUL: 'VALIDATE_SUCCESSFUL',
  VALIDATE_FAILED: 'VALIDATE_FAILED'
}

export class ForgotPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: undefined,
      emailAddress: undefined,
      canSend: false,
      code: undefined,
      newPassword: undefined,
      showPassword: false,
      errorMsg: undefined
    }
    this.emailEntryChanged = this.emailEntryChanged.bind(this)
    this.requestSendEmail = this.requestSendEmail.bind(this)
    this.requestSaveNewPassword = this.requestSaveNewPassword.bind(this)
    this.passwordEntryChanged = this.passwordEntryChanged.bind(this)
    this.toggleShowPassword = this.toggleShowPassword.bind(this)
  }

  async componentDidMount () {
    const urlQuery = window.location.search
    const key = urlQuery.substring(urlQuery.indexOf('=') + 1)
    this.setState({mode: key ? MODE.VALIDATE_ASK_PWD : MODE.EMAIL_NOT_REQUESTED})
    if (key) {
      try {
        const {code, email} = JSON.parse(atob(key))
        this.setState({code, emailAddress: email})
      } catch (err) {
        this.setState({mode: MODE.VALIDATE_FAILED})
      }
    }
  }

  async requestSendEmail () {
    this.setState({mode: MODE.EMAIL_REQUESTED})
    try {
      const sent = await requestSendForgotEmail(this.state.emailAddress)
      console.log('result send fogot pwd email:', sent)
      this.setState({mode: sent ? MODE.EMAIL_SUCCESSFUL : MODE.EMAIL_FAILED})
    } catch (err) {
      this.setState({mode: MODE.EMAIL_FAILED})
    }
  }

  async requestSaveNewPassword () {
    this.setState({mode: MODE.VALIDATE_REQUESTED})
    const {emailAddress, code, newPassword} = this.state
    try {
      const saved = await requestValidatePwdResetCode(emailAddress, code, newPassword)
      this.setState({mode: saved ? MODE.VALIDATE_SUCCESSFUL : MODE.VALIDATE_FAILED})
    } catch (err) {
      this.setState({mode: MODE.VALIDATE_FAILED})
      this.setState({errorMsg: err.message})
    }
  }

  emailEntryChanged (e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
    const correctEmailFormat = /^[a-zA-Z0-9\\.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
    this.setState({canSend: correctEmailFormat.test(value)})
  }

  passwordEntryChanged (e) {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  toggleShowPassword() {
    console.log(this.state.showPassword)
    this.setState({showPassword: !this.state.showPassword})
  }

  render () {
    const SEND_EMAIL_NOT_REQUESTED_VIEW =
    <span id='sendEmailNotRequested'>
      <h1 className='is-size-3'>{literals.requestEmailHeading}</h1>
      <p>{literals.requestEmailLine1}</p>
      <p>{literals.requestEmailLine2}</p>
      <div className='field'>
        <p className={'control has-icons-left has-icons-right ' + styles.inputEmail}>
          <input className={'input ' + (this.state.canSend ? 'is-success' : 'is-danger')} type='email' placeholder='Email' name='emailAddress' onChange={this.emailEntryChanged}/>
          <span className='icon is-small is-left'>
            <i className='fas fa-envelope'></i>
          </span>
        </p>
      </div>
      <br />
      {this.state.canSend && <button className={'button is-link '} onClick={this.requestSendEmail}>{literals.sendEmailBtn}</button>}
    </span>
    const SEND_EMAIL_REQUESTED_VIEW =
      <span id='requestedEmail'>
        <h1 className='is-size-3'>{literals.emailRequested}</h1>
        <img alt='' src={spinner} />
      </span>
    const EMAIL_SENT_VIEW =
      <span id='emailSent'>
        <h1 className='is-size-3'>{literals.emailSentHeading}</h1>
        <p>{literals.emailSentLine1}</p>
      </span>
    const SEND_EMAIL_FAILED_VIEW =
      <span id='sendEmailFailed'>
        <h1 className='is-size-3'>{literals.sendEmailFailedHeading}</h1>
        <p>{literals.sendEmailFailedLine1}</p>
        <p>{literals.sendEmailFailedLine2}</p>
        <br /><Link to='/Login'><button className={'button is-link '}>{literals.goToLogin}</button></Link>
      </span>
    const VALIDATE_ASK_PWD_VIEW =
    <span id='validateAskPwdView'>
      <h1 className='is-size-3'>{literals.askPwdHeader}</h1>
      <p>{literals.askPwdLine1}</p>
      <p>{literals.askPwdLine2}</p>
      <div className='field'>
        <p className={'control has-icons-right ' + styles.inputEmail}>
          <input
            className={'input ' + ((this.state.newPassword && this.state.newPassword.length > 5) ? 'is-success' : 'is-danger')}
            type={this.state.showPassword ? 'text' : 'password'}
            placeholder={literals.newPasswordPlaceholder}
            name='newPassword'
            onChange={this.passwordEntryChanged} />
          <span className={'icon is-small is-right ' + styles.toggleShowPassword} onClick={this.toggleShowPassword}>
            <i className={'far ' + (this.state.showPassword ? 'fa-eye-slash' : 'fa-eye') + ' ' + styles.toggleShowPassword}></i>
          </span>
        </p>
      </div>
      <br />
      {this.state.newPassword && (this.state.newPassword.length > 5)
        && <button className={'button is-link '} onClick={this.requestSaveNewPassword}>{literals.saveNewPassword}</button>}
    </span>
    const VALIDATE_REQUESTED_VIEW =
      <span id='requestedCodeEmailValidation'>
        <h1 className='is-size-3'>{literals.savingNewPassword}...</h1>
        <img alt='' src={spinner} />
      </span>
    const VALIDATE_SUCCESSFUL_VIEW =
      <span id='setNewPasswordSuccessfulView'>
        <h1 className='is-size-3'>{literals.setNewPasswordSuccessfulHeading}</h1>
        <p>{literals.setNewPasswordSuccessfulLine1}</p>
        <br /><Link to='/Login'><button className={'button is-link '}>{literals.goToLogin}</button></Link>
      </span>
    const VALIDATE_FAILED_VIEW = 
    <span id='setNewPasswordFailedView'>
      <h1 className='is-size-3'>{literals.setNewPasswordFailedHeading}</h1>
        {this.state.errorMsg === 'CODE_OUTDATED' ?
          <p>{literals.sendNewPasswordFailedOutdated}</p>
          : <p>{literals.setNewPasswordFailedLine1}</p>
        }
      <br /><Link to='/Login'><button className={'button is-link '}>{literals.goToLogin}</button></Link>
    </span>
    return (
      <div id='forgotPasswordPage' className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle' className={sharedStyles.pageHeading}>{literals.startHere}</h2>
        <div className='columns'>
          <div className='column is-offset-2 is-8'>
            <div className={'box ' + styles.messageBox}>
              <div className='has-text-centered'>
                {
                  ({
                    [MODE.EMAIL_NOT_REQUESTED]: SEND_EMAIL_NOT_REQUESTED_VIEW,
                    [MODE.EMAIL_REQUESTED]: SEND_EMAIL_REQUESTED_VIEW,
                    [MODE.EMAIL_SUCCESSFUL]: EMAIL_SENT_VIEW,
                    [MODE.EMAIL_FAILED]: SEND_EMAIL_FAILED_VIEW,
                    [MODE.VALIDATE_ASK_PWD]: VALIDATE_ASK_PWD_VIEW,
                    [MODE.VALIDATE_REQUESTED]: VALIDATE_REQUESTED_VIEW,
                    [MODE.VALIDATE_SUCCESSFUL]: VALIDATE_SUCCESSFUL_VIEW,
                    [MODE.VALIDATE_FAILED]: VALIDATE_FAILED_VIEW
                  }[this.state.mode])
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
