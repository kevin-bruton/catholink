import React from 'react'
import { Link } from 'react-router-dom'
import {get as getRequest} from '@services/request'

import { literals } from './literals'

export class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: null,
      searchResults: []
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
    console.log('rerender')
    return (
      <div id='SearchResultsPage' className='col-md-6 col-md-offset-3'>
        <h2 id='pageTitle' className='title is-3 '>{literals.searchResults + (this.state.searchText ? ' "' + this.state.searchText + '"' : '')}</h2>
        <div className='columns'>
          <div className='column is-offset-2 is-8'>
            <div className='box'>
              <div className='has-text-centered'>
                {this.state.searchResults.length
                  ? <table className='table'>
                    <thead><tr><th>{literals.firstName}</th><th>{literals.surname}</th></tr></thead>
                    <tbody>
                      {this.state.searchResults.map((person, index) =>
                        <tr key={index}>
                          <td>{person.firstName}</td>
                          <td>{person.surname}</td>
                          <td><Link to={`/profile/${person.profileId}`}><button className='button is-link is-small'>{literals.viewProfile}</button></Link></td>
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
