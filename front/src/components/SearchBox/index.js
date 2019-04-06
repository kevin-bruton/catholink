import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { literals } from './literals'
import {getStoreValue, storeCategory, subscribeStoreChanges, unsubscribeStoreChanges, loginStatus} from '@store'

export class SearchBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: loginStatus.LOGOUT,
      searchText: ''
    }
    this.loginStatusChange = this.loginStatusChange.bind(this)
    this.searchTextChange = this.searchTextChange.bind(this)
    this.searchClicked = this.searchClicked.bind(this)
  }

  componentDidMount () {
    this.setState({login: getStoreValue(storeCategory.LOGIN)}, () =>
      subscribeStoreChanges(storeCategory.LOGIN, 'SearchBox', this.loginStatusChange)
    )
  }

  componentWillUnmount () {
    unsubscribeStoreChanges(storeCategory.LOGIN, 'SearchBox')
  }

  loginStatusChange (newValue) {
    this.setState({login: newValue})
  }

  searchTextChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  searchClicked () {
    document.querySelector('body').dispatchEvent(new window.CustomEvent('search', {detail: this.state.searchText}))
  }

  render () {
    return (
      <div className='field has-addons'>
        <div className='control'>
          <input className='input' type='text' name='searchText' placeholder={literals.search} onChange={this.searchTextChange} />
        </div>
        <div className='control'>
          <Link to={'/searchresults?text=' + this.state.searchText}>
            <span className='button is-link is-dark' onClick={this.searchClicked}>
              <i className='fas fa-search' />
            </span>
          </Link>
        </div>
      </div>
    )
  }
}
