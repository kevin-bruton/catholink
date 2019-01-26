import React from 'react'
// import { Link } from 'react-router-dom'
import {get as getRequest} from '@services/request'
import {subscribeStatus, unsubscribeStatus, getStatus, statusType} from '@status'

import { literals } from './literals'

export class SearchResults extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: null,
      searchResults: []
    }
    this.searchTextChange = this.searchTextChange.bind(this)
  }

  componentDidMount () {
    this.setState({searchText: getStatus(statusType.SEARCH_TEXT)}, async () => {
      subscribeStatus(statusType.SEARCH_TEXT, 'SearchResults', this.searchTextChange)
      await this.getSearchResults()
    })
  }

  async getSearchResults () {
    const resp = await getRequest(`search?text=${this.state.searchText}`)
    this.setState({searchResults: resp.searchResults})
  }

  componentWillUnmount () {
    unsubscribeStatus(statusType.SEARCH_TEXT, 'SearchResults')
  }

  searchTextChange (newValue) {
    this.setState({searchText: newValue}, async () => {
      await this.getSearchResults()
    })
  }

  render () {
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
                        {this.state.searchResults.map((person, index) => <tr key={index}><td>{person.firstName}</td><td>{person.surname}</td></tr>)}
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
