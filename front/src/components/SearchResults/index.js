import React from 'react'
import { Link } from 'react-router-dom'
import {getStoreValue, storeCategory} from '@store'
import {get as getRequest} from '@services/request'
import styles from './styles.scss'
import { literals } from './literals'
import {InviteContactModal} from '@components'

export class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentUser: getStoreValue(storeCategory.USER),
      searchText: null,
      searchResults: [],
      showInviteContactModal: false
    }
    this.body = document.querySelector('body')
    this.searchTextChange = this.searchTextChange.bind(this)
    this.locationChange = this.locationChange.bind(this)
  }

  componentDidMount () {
    this.body.addEventListener('search', this.locationChange, false)
    this.setState({searchText: window.location.search.split('=')[1]}, this.getSearchResults)
  }

  componentWillUnmount () {
    this.body.removeEventListener('search', this.locationChange)
  }

  contactInvite (invitee) {
    this.setState({showInviteContactModal: invitee})
    console.log('contactInvite', invitee)
  }

  locationChange (e) {
    this.setState({searchText: e.detail}, this.getSearchResults)
  }

  async getSearchResults () {
    const resp = await getRequest(`search?text=${this.state.searchText}`)
    this.setState({searchResults: resp.searchResults})
  }

  searchTextChange (newValue) {
    this.setState({searchText: newValue}, this.getSearchResults)
  }

  render () {
    return (
      <div id='SearchResultsPage' className='col-md-6 col-md-offset-3'>
        {this.state.showInviteContactModal &&
          <InviteContactModal invitee={this.state.showInviteContactModal} inviter={this.state.currentUser.profileId} closeModal={this.contactInvite.bind(this, false)}/>
        }
        <h2 id='pageTitle' className='title is-3 '>{literals.searchResults + (this.state.searchText ? ' "' + this.state.searchText + '"' : '')}</h2>
        <div className='columns'>
          <div className='column is-offset-2 is-8'>
            <div className={'box ' + styles.resultsBox}>
              <div className='has-text-centered'>
                {this.state.searchResults.length
                  ? <table className='table'>
                    <thead><tr><th>{literals.firstName}</th><th>{literals.surname}</th><th></th><th></th></tr></thead>
                    <tbody>
                      {this.state.searchResults.map((person, index) =>
                        <tr key={index}>
                          <td>{person.firstName}</td>
                          <td>{person.surname}</td>
                          <td><Link to={`/profile/${person.profileId}`}><button className='button is-link is-small'>{literals.viewProfile}</button></Link></td>
                          {
                            this.state.currentUser.contacts.includes(person.profileId) ||
                              <td><button className='button is-link is-small' onClick={this.contactInvite.bind(this, person.profileId)}>{literals.addContact}</button></td>
                          }
                        </tr>
                      )}
                    </tbody>
                  </table>
                  : '---- ' + literals.noResultsFound + ' ----'}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
