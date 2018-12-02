import React, { Component } from 'react'
import styles from './styles.scss'
import { Link } from 'react-router-dom'
import { literals } from './literals'
import brandname from '../../assets/brandname.svg'
import {ProfileBtn} from '@components'
import * as status from '@status'

export class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      login: status.getState(status.type.LOGIN)
    }
    status.subscribe(status.type.LOGIN, this.loginStatusChange)
  }

  loginStatusChange (newValue) {
    this.setState({login: newValue})
    console.log(this.state.login)
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
            {(this.state.login === status.login.SUCCESSFUL) && <ProfileBtn />}
          </div>
        </div>
      </header>
    )
  }
}
