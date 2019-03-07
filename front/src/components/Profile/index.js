import React from 'react'
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
      profileId: this.props.match.params.profileId
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.match.params.profileId !== this.props.match.params.profileId) {
      this.setState({profileId: this.props.match.params.profileId})
    }
  }

  render () {
    return (
      <div id='ProfilePage'><br />
        <div className='columns'>
          <div className='column is-10'>
            <div className='box'>
              <div className='has-text-centered'>
                <div>
                  {this.state.profileId === this.state.currentUser.profileId
                    ? <MyProfile profileId={this.state.profileId} />
                    : <AnothersProfile profileId={this.state.profileId} />
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
