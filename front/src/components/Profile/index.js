import styles from './styles.scss'
import React from 'react'
// import { Link } from 'react-router-dom'
import {get as getRequest, post as postRequest} from '@services/request'
import {subscribeStatus, unsubscribeStatus, getStatus, statusType} from '@status'
import {Avatar} from '@components/Avatar'

import { literals } from './literals'

/* 
  THE PROFILE PAGE
  If it is the profile of the current user, he/she can edit it
  If it is another user's profile, he/she can only see the parts of the profile he/she has "permission" to
*/
export class Profile extends React.Component {
  constructor (props) {
    super(props)
    const fields = ['address1', 'address2', 'joinDate', 'telephone', 'mobile', 'workPlace']
    this.state = {
      currentUser: getStatus(statusType.USER),
      profileId: this.props.match.params.profileId,
      userProfile: {address1: '', address2: '', telephone: '', mobile: '', workPlace: ''},
      editable: false,
      changed: false
    }
    this.state.isCurrentUsersProfile = this.state.currentUser.profileId === this.state.profileId

    this.toggleEditable = this.toggleEditable.bind(this)
    this.changed = this.changed.bind(this)
    this.save = this.save.bind(this)
  }

  async componentDidMount () {
    const resp = await getRequest(`profile/${this.state.profileId}`)
    resp.error && console.log('ERROR RETRIEVING PROFILE DATA with profileId:', this.state.profileId, resp.err)
    const userProfile = resp.error
      ? false
      : Object.keys(this.state.userProfile).reduce((acc, cur) => Object.assign(acc, {[cur]: resp[cur]}), {})
      console.log(userProfile)
    this.setState({userProfile}) 
  }

  toggleEditable () {
    this.setState({editable: !this.state.editable})
  }

  changed (e) {
    this.setState({changed: true, userProfile: Object.assign(this.state.userProfile,{[e.target.name]: e.target.value})},
      console.log(this.state.userProfile))
  }

  async save () {
    this.setState({changed: false, editable: false})
    // get values from update fields
    console.log(this.state.userProfile)
    await postRequest('profile/update', {email: this.state.currentUser.email, profile: this.state.userProfile})
  }

  render () {
    const fields = Object.keys(this.state.userProfile)
    const userProfile = this.state.userProfile
    const CURRENT_USER_DATA = <div>
        <h2 className='title is-4'>{literals.myProfile}</h2>
        <Avatar />
        <table className='table'>
          <tbody>
            <tr>
              <td>{literals.photo}:</td>
              <td><div className="file has-name">
                <label className="file-label">
                  <input className="file-input" type="file" name="resume" />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">
                      Choose a file…
                    </span>
                  </span>
                  <span className="file-name">
                    Filename
                  </span>
                </label>
              </div></td>
            </tr>
            {fields.map(field =>
              <tr key={field}>
                <td>{literals[field]}:</td>
                <td>
                  <input className='input' type='text' name={field}
                    value={userProfile[field]}
                    disabled={!this.state.editable} onChange={this.changed} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button className='button is-link' onClick={this.toggleEditable}>{literals.edit}</button> 
        <button className={`button is-link ${styles.separate} ${(this.state.changed ? '' : styles.hide)}`} onClick={this.save} >{literals.save}</button>
      </div>
    const OTHER_USER_DATA = <div>
        <h2 className='title is-4'>{literals.profileOf(`${userProfile.firstName} ${userProfile.surname}`)}</h2>
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
