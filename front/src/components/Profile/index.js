import React from 'react'
import {get as getRequest, post as postRequest} from '@services/request'
import {getStatus, statusType} from '@status'
import {AnothersProfile} from '@components/AnothersProfile'
import {MyProfile} from '@components/MyProfile'

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
      firstName: '',
      surname: '',
      userProfile: {address1: '', address2: '', telephone: '', mobile: '', workPlace: ''},
      avatar: false,
      visibility: {}
    }
    this.state.isCurrentUsersProfile = this.state.currentUser.profileId === this.state.profileId
  }

  async componentDidMount () {
    const resp = await getRequest(`profile/${this.state.profileId}`)
    resp.error && console.log('ERROR RETRIEVING PROFILE DATA with profileId:', this.state.profileId, resp.err)
    if (resp.error) {
      return
    } else {
      const userProfile = Object.keys(this.state.userProfile).reduce((acc, cur) => Object.assign(acc, {[cur]: resp[cur]}), {})
      this.setState({firstName: resp.firstName, surname: resp.surname, userProfile, avatar: resp.avatar, visibility: resp.visibility})
    }
  }

  render () {
    return (
      <div id='ProfilePage'><br></br>
        <div className='columns'>
          <div className='column is-10'>
            <div className='box'>
              <div className='has-text-centered'>
                <div>
                  {this.state.isCurrentUsersProfile
                    ? <MyProfile userProfile={this.state.userProfile} visibility={this.state.visibility} avatar={this.state.avatar} />
                    : <AnothersProfile userProfile={this.state.userProfile} avatar={this.state.avatar} fullname={`${this.state.firstName} ${this.state.surname}`} />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
