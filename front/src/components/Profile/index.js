import styles from './styles.scss'
import React from 'react'
// import { Link } from 'react-router-dom'
import {get as getRequest, post as postRequest} from '@services/request'
import {subscribeStatus, unsubscribeStatus, getStatus, statusType} from '@status'
import {AvatarEditor} from '@components/AvatarEditor'

import { literals } from './literals'

/* 
  THE PROFILE PAGE
  If it is the profile of the current user, he/she can edit it
  If it is another user's profile, he/she can only see the parts of the profile he/she has "permission" to
*/
export class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentUser: getStatus(statusType.USER),
      profileId: this.props.match.params.profileId,
      userProfile: {address1: '', address2: '', telephone: '', mobile: '', workPlace: ''},
      avatar: false,
      editable: false,
      changed: false,
      showAvatarEditorModal: false
    }
    this.state.isCurrentUsersProfile = this.state.currentUser.profileId === this.state.profileId

    this.toggleEditable = this.toggleEditable.bind(this)
    this.changed = this.changed.bind(this)
    this.save = this.save.bind(this)
    this.toggleShowAvatarEditorModal = this.toggleShowAvatarEditorModal.bind(this)
  }

  async componentDidMount () {
    const resp = await getRequest(`profile/${this.state.profileId}`)
    resp.error && console.log('ERROR RETRIEVING PROFILE DATA with profileId:', this.state.profileId, resp.err)
    if (resp.error) {
      return
    } else {
      const userProfile = Object.keys(this.state.userProfile).reduce((acc, cur) => Object.assign(acc, {[cur]: resp[cur]}), {})
      this.setState({userProfile, avatar: resp.avatar})
    }
  }

  toggleEditable () {
    this.setState({editable: !this.state.editable})
  }

  changed (e) {
    this.setState({changed: true, userProfile: Object.assign(this.state.userProfile,{[e.target.name]: e.target.value})})
  }

  async save () {
    this.setState({changed: false, editable: false})
    await postRequest('profile/update', {email: this.state.currentUser.email, profile: this.state.userProfile})
  }

  toggleShowAvatarEditorModal (preview) {
    (typeof preview === 'string')
      ? this.setState({showAvatarEditorModal: !this.state.showAvatarEditorModal, avatar: preview})
      : this.setState({showAvatarEditorModal: !this.state.showAvatarEditorModal})
  }

  render () {
    console.log('Profile render. Avatar:', this.state.avatar)
    const fields = Object.keys(this.state.userProfile)
    const AVATAR_EDITOR_MODAL =
      <AvatarEditor email={this.state.currentUser.email} photo={this.state.avatar} closeEvent={this.toggleShowAvatarEditorModal} />
    const SHOW_AVATAR =
      <a onClick={this.toggleShowAvatarEditorModal}>
        <div className={'box ' + styles.limitWidth}>
          <img src={this.state.avatar} />
        </div>
        <i className={'far fa-edit ' + styles.separate} />
      </a>
    const ADD_AVATAR =
      <div onClick={this.toggleShowAvatarEditorModal}>
        <div className={'box ' + styles.limitWidth}>
          <i className='fas fa-user fa-4x' alt='users foto' />
        </div>
        <i className={'fas fa-edit ' + styles.separate} />
      </div>
    const CURRENT_USER_DATA =
      <div>
        <h2 className='title is-4'>{literals.myProfile}</h2>
        { this.state.showAvatarEditorModal ? AVATAR_EDITOR_MODAL : this.state.avatar ? SHOW_AVATAR : ADD_AVATAR }
        <table className='table'>
          <tbody>
            {fields.map(field =>
              <tr key={field}>
                <td>{literals[field]}:</td>
                <td>
                  <input className='input' type='text' name={field}
                    value={this.state.userProfile[field]}
                    disabled={!this.state.editable} onChange={this.changed} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button className='button is-link' onClick={this.toggleEditable}>{literals.edit}</button> 
        <button className={`button is-link ${styles.separate} ${(this.state.changed ? '' : styles.hide)}`} onClick={this.save} >{literals.save}</button>
      </div>
    const OTHER_USER_DATA =
      <div>
        <h2 className='title is-4'>{literals.profileOf(`${this.state.userProfile.firstName} ${this.state.userProfile.surname}`)}</h2>
        <p>---- Have to display other user data here ----</p>
      </div>
    return (
      <div id='ProfilePage' className='col-md-6 col-md-offset-3'><br></br>
        <div className='columns'>
          <div className='column is-offset-2 is-8'>
            <div className='box'>
              <div className='has-text-centered'>
                <div>{this.state.isCurrentUsersProfile ? CURRENT_USER_DATA : OTHER_USER_DATA}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
