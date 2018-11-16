import React, { Component } from 'react'
import styles from './styles.scss'
import { Link } from 'react-router-dom'
import { literals } from './literals'
import brandname from '../../assets/brandname.svg'

export class Header extends Component {
  render () {
    return (
      <header className={styles.header}>
        <div className='columns'>
          <div className='column'>
            <Link to='/'><img src={brandname} align='left' width='100' alt='Brand name' /></Link>
          </div>
          <div className='column'>
            <h1 className={styles.descriptiveTitle}>{literals.descriptiveTitle}</h1>
          </div>
          <div className='column'>
            <h4 className={styles.myProfile}>{literals.myProfile}</h4>
          </div>
        </div>
      </header>
    )
  }
}
