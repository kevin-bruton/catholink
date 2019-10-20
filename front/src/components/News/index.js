import React from 'react'
/* import { post } from '@request' */
import { literals } from './literals'
/* import {getStoreValue, setStoreValue, storeCategory} from '@store' */
import styles from './styles.scss'
import sharedStyles from '@sharedStyles'

export class News extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  async componentDidMount () {
  }
  render () {
    const ADD_POST_BOX =
      <div id='AddPostBox' className={styles.AddPostBox}>
        <div className='tile is-ancestor'><div className='tile is-vertical'>
          <button className="button is-link">{literals.post}</button>
        </div></div>
      </div>
    return (
      <div id='NewsPage'>
        <h1 className={sharedStyles.pageHeading}>{literals.pageHeading}</h1>
        {ADD_POST_BOX}
      </div>
    )
  }
}
