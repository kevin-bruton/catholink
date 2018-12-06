import React, { Component } from 'react'
import styles from './styles.scss'
import { Link } from 'react-router-dom'
import { literals } from './literals'
import brandname from '../../assets/brandname.svg'
import {ProfileBtn} from '@components/ProfileBtn'
import * as status from '@status'

export class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      login: 'SUCCESSFUL'
    }
    this.loginStatusChange = this.loginStatusChange.bind(this)
    this.printStatus = this.printStatus.bind(this)
  }

  componentDidMount () {
    status.subscribe(status.type.LOGIN, this.loginStatusChange)
    // this.setState({login: status.getState(status.type.LOGIN)})
  }

  componentWillUnmount () {
    status.unsubscribe(status.type.LOGIN)
  }

  loginStatusChange (newValue) {
    this.setState({login: newValue})
    console.log('loginStatusChange', this.state.login)
  }

  printStatus () {
    const loginStatus = status.getState(status.type.LOGIN)
    console.log('printStatus', loginStatus)
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
            {(this.state.login === status.login.SUCCESSFUL) && <ProfileBtn />}<button onClick={this.printStatus()}>Login</button>
          </div>
        </div>
      </header>
    )
  }
}
