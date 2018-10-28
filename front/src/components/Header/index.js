import React, { Component } from 'react'
import styles from './styles.scss'
import { Link } from 'react-router-dom'

export class Header extends Component {
  render () {
    return (
      <header className={styles.header}>
        <Link to='/'><h1 className={styles.title}>Catholink</h1></Link>
      </header>
    )
  }
}
