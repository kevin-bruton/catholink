import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { literals } from './literals'
import {getStoreValue, storeCategory, subscribeStoreChanges, unsubscribeStoreChanges, loginStatus} from '@store'

export class SearchBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: loginStatus.LOGOUT,
      searchText: '',
      startSearch: false
    }
    this.loginStatusChange = this.loginStatusChange.bind(this)
    this.searchTextChange = this.searchTextChange.bind(this)
    this.searchClicked = this.searchClicked.bind(this)
    this.searchSubmit = this.searchSubmit.bind(this)
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

  searchSubmit (e) {
    e && e.preventDefault()
    this.setState({startSearch: true})
    this.searchClicked();
  }

  searchClicked () {
    document.querySelector('body').dispatchEvent(new window.CustomEvent('search', {detail: this.state.searchText}))
  }
  
  componentDidUpdate () {
    if (this.state.startSearch) {
      this.setState({startSearch: false})
    }
  }

  render () {
    if (this.state.startSearch) {
      return (<Redirect to={`/searchresults?text=${this.state.searchText}`} push={true} />)
    }
    return (
      <div className='field has-addons'>
        <div className='control'>
          <form onSubmit={this.searchSubmit}>
            <input className='input' type='text' name='searchText' placeholder={literals.search} onChange={this.searchTextChange} />
          </form>
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
