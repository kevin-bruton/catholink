import styles from './styles.scss'
import React from 'react'
import {get as getRequest, post as postRequest} from '@services/request'
import {getStatus, statusType} from '@status'
import {AvatarEditor} from '@components/AvatarEditor'

import { literals } from './literals'

export class MyProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentUser: getStatus(statusType.USER),
      userProfile: this.props.userProfile,
      avatar: this.props.avatar,
      visibility: this.props.visibility,
      editable: false,
      dataChanged: false,
      visibilityChanged: false,
      showAvatarEditorModal: false,
      tab: 'info'
    }
    this.toggleEditable = this.toggleEditable.bind(this)
    this.textFieldChanged = this.textFieldChanged.bind(this)
    this.saveData = this.saveData.bind(this)
    this.saveVisibility = this.saveVisibility.bind(this)
    this.toggleShowAvatarEditorModal = this.toggleShowAvatarEditorModal.bind(this)
    this.radioSelected = this.radioSelected.bind(this)
    this.selectTab = this.selectTab.bind(this)
  }
  
  componentDidUpdate(prevProps) {
    ;(this.props.avatar !== prevProps.avatar) && this.setState({avatar: this.props.avatar})
    ;(this.props.visibility !== prevProps.visibility) && this.setState({visibility: this.props.visibility})
    ;(this.props.userProfile !== prevProps.userProfile) && this.setState({userProfile: this.props.userProfile})
  }

  toggleEditable () {
    this.setState({editable: !this.state.editable})
  }

  textFieldChanged (e) {
    this.setState({dataChanged: true, userProfile: Object.assign(this.state.userProfile,{[e.target.name]: e.target.value})})
  }

  radioSelected (e) {
    this.setState({visibilityChanged: true, visibility: Object.assign({}, this.state.visibility, {[e.target.name]: e.target.value})})
  }

  async saveData () {
    this.setState({dataChanged: false, editable: false})
    await postRequest('profile/update', {email: this.state.currentUser.email, profile: this.state.userProfile})
  }

  async saveVisibility () {
    this.setState({visibilityChanged: false})
    await postRequest('visibility/update', {email: this.state.currentUser.email, visibility: this.state.visibility})
  }

  toggleShowAvatarEditorModal (preview) {
    (typeof preview === 'string')
      ? this.setState({showAvatarEditorModal: !this.state.showAvatarEditorModal, avatar: preview})
      : this.setState({showAvatarEditorModal: !this.state.showAvatarEditorModal})
  }

  selectTab (e) {
    this.setState({tab: e.currentTarget.dataset.tab})
  }

  render () {
    const privacyOptions = ['public', 'members', 'contacts', 'private']
    const fields = Object.keys(this.state.userProfile)
    const visibilityFields = Object.keys(this.state.visibility)
    const AVATAR_EDITOR_MODAL =
      <AvatarEditor email={this.state.currentUser.email} photo={this.state.avatar} closeEvent={this.toggleShowAvatarEditorModal} />
    const SHOW_AVATAR =
      <a id='showAvatar' onClick={this.toggleShowAvatarEditorModal}>
        <div className={'box ' + styles.limitWidth}>
          {this.state.avatar ? <img src={this.state.avatar} alt='avatar' /> : <i className='fas fa-user fa-4x' alt='users foto' />}
        </div>
        <i className={'far fa-edit ' + styles.separate} />
      </a>
    const AVATAR = this.state.showAvatarEditorModal ? AVATAR_EDITOR_MODAL : SHOW_AVATAR
    const INFO_TAB =
      <div id='InfoTab'>
        <table className='table is-fullwidth'>
          <tbody>
            {fields.map(field =>
              <tr key={field}>
                <td>{literals[field]}:</td>
                <td>
                  <input className='input' type='text' name={field}
                    value={this.state.userProfile[field]}
                    disabled={!this.state.editable} onChange={this.textFieldChanged} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <button className='button is-link' onClick={this.toggleEditable}>{literals.edit}</button> 
        <button className={`button is-link ${styles.separate} ${(this.state.dataChanged ? '' : styles.hide)}`} onClick={this.saveData} >{literals.save}</button>
      </div>
    const VISIBILITY_TAB =  
      <div id='VisibilityTab'>
        <div className='columns'>
          <div className='column is-half is-offset-one-quarter'>
            {literals.privacyOptions}
            <table className='table' align='center'>
              <thead>
                <tr>
                  <th></th>
                  {privacyOptions.map(privacyOption => <th key={privacyOption} className='is-size-7'>{literals[privacyOption]}</th>)}
                </tr>
              </thead>
              <tbody>
                {visibilityFields.map(field =>
                  <tr key={field}>
                    <td>{literals[field]}:</td>
                    {privacyOptions.map(privacyOption =>
                      <td key={privacyOption}>
                        <input checked={this.state.visibility[field] === privacyOption} onChange={this.radioSelected} id={`${field}-${privacyOption}`} type='radio' name={field} value={privacyOption} />
                      </td>)}
                  </tr>)}
              </tbody>
            </table>
            <button id='saveVisibilityBtn' className={`button is-link ${styles.separate} ${(this.state.visibilityChanged ? '' : styles.hide)}`} onClick={this.saveVisibility} >{literals.save}</button>
          </div>
        </div>
      </div>
    return (
      <div id='MyProfile'>
        <h2 className='title is-4'>{literals.myProfile}</h2>
        {AVATAR}
        <div className='tabs is-centered'>
          <ul>
            <li className={this.state.tab === 'info' ? 'is-active' : ''} onClick={this.selectTab} data-tab='info'><a>{literals.myInfo}</a></li>
            <li className={this.state.tab === 'visibility' ? 'is-active' : ''} onClick={this.selectTab} data-tab='visibility'><a>{literals.visibilitySettings}</a></li>
          </ul>
        </div>
        {(this.state.tab === 'info' && INFO_TAB) || VISIBILITY_TAB}
      </div>
    )
  }
}
