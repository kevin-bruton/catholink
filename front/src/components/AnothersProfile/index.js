import {get as getRequest} from '@services/request'
import styles from './styles.scss'
import React from 'react'

import { literals } from './literals'

export class AnothersProfile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userProfile: null,
      profileId: this.props.profileId,
      avatar: null
    }
  }

  async componentDidMount () {
    const profile = await getRequest(`profile/${this.state.profileId}`)
    this.setState({avatar: profile.avatar})
    delete profile.avatar
    this.setState({userProfile: profile})
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.profileId !== this.props.profileId) {
      const profile = await getRequest(`profile/${this.props.profileId}`)
      const {avatar, profileId, ...userProfile} = profile
      this.setState({avatar, profileId, userProfile})
    }
  }

  render () {
    const fields = this.state.userProfile && Object.keys(this.state.userProfile)
    const fullname = this.state.userProfile && `${this.state.userProfile.firstName} ${this.state.userProfile.surname}`
    return (
      <div id='AnothersProfile'>
        <h2 className='title is-4'>{literals.profileOf(fullname)}</h2>
        <div id='showAvatar'>
          <div className={'box ' + styles.limitWidth}>
            {this.state.userProfile && (this.state.userProfile.avatar ? <img src={this.state.userProfile.avatar} alt='avatar' /> : <i className='fas fa-user fa-4x' alt='users foto' />)}
          </div>
        </div>
        <table className='table is-fullwidth'>
          <tbody>
            {fields && fields.map(field =>
              <tr key={field}>
                <td>{literals[field]}:</td>
                <td>
                  <input className='input' type='text' name={field}
                    value={this.state.userProfile[field]}
                    disabled />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}
