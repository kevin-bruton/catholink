import React, { Component } from 'react'
import styles from './styles.scss'
import { Link } from 'react-router-dom'
import { literals } from './literals'
import brandname from '../../assets/brandname.svg'
import {ProfileBtn} from '@components/ProfileBtn'
import {getStatus, statusType, subscribeStatus, unsubscribeStatus, loginStatus} from '@status'

export class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      login: loginStatus.FAILURE
    }
    this.loginStatusChange = this.loginStatusChange.bind(this)
  }

  componentDidMount () {
    this.setState({login: getStatus(statusType.LOGIN)}, () =>
      subscribeStatus(statusType.LOGIN, 'Header', this.loginStatusChange)
    )
  }

  componentWillUnmount () {
    unsubscribeStatus(statusType.LOGIN, 'Header')
  }

  loginStatusChange (newValue) {
    this.setState({login: newValue})
  }

  render () {
    return (
      <header id='Header' className={styles.header}>
        <div className='columns'>
          <div className='column'>
            <Link to='/'><img src={brandname} align='left' width='100' alt='Brand name' /></Link>
          </div>
          <div className='column'>
            <h1 className={styles.descriptiveTitle}>{literals.descriptiveTitle}</h1>
          </div>
          <div className='column'>
            {(this.state.login === loginStatus.SUCCESSFUL) && <ProfileBtn />}
          </div>
        </div>
      </header>
    )
  }
}
