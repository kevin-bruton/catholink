import React, { Component } from 'react'
import styles from './styles.scss'
import { Link } from 'react-router-dom'
import { literals } from './literals'
import brandname from '../../assets/brandname.svg'
import {MessagesBtn, ProfileBtn, SearchBox} from '@components'
import {getStoreValue, storeCategory, subscribeStoreChanges, unsubscribeStoreChanges, loginStatus} from '@store'

export class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      login: loginStatus.FAILURE
    }
    this.loginStatusChange = this.loginStatusChange.bind(this)
  }

  componentDidMount () {
    this.setState({login: getStoreValue(storeCategory.LOGIN)}, () =>
      subscribeStoreChanges(storeCategory.LOGIN, 'Header', this.loginStatusChange)
    )
  }

  componentWillUnmount () {
    unsubscribeStoreChanges(storeCategory.LOGIN, 'Header')
  }

  loginStatusChange (newValue) {
    this.setState({login: newValue})
  }

  render () {
    const loggedIn = (this.state.login === loginStatus.SUCCESSFUL)
    return (
      <header id='Header' className={styles.header}>
        <div className='columns'>
          <div className='column'>
            <span className='field is-grouped'>
              <Link to='/'><img src={brandname} align='left' width='100' alt='Brand name' /></Link>
              {loggedIn && <SearchBox />}
            </span>
          </div>
          <div className='column'>
            <h1 className={styles.descriptiveTitle}>{literals.descriptiveTitle}</h1>
          </div>
          <div className='column is-1'>
            {loggedIn && <MessagesBtn />}
          </div>
          <div className='column'>
            {loggedIn && <ProfileBtn />}
          </div>
          <div className='column is-1' />
        </div>
      </header>
    )
  }
}
