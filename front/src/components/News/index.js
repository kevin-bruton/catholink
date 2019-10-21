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
      showPostModal: false
    }
    this.toggleShowPostModal = this.toggleShowPostModal.bind(this)
    this.adjustAddPostTextareaSize = this.adjustAddPostTextareaSize.bind(this)
  }

  async componentDidMount () {
  }

  toggleShowPostModal () {
    this.setState({showPostModal: !this.state.showPostModal})
  }

  adjustAddPostTextareaSize (e) {
    e.target.style.height = ''
    e.target.style.height = e.target.scrollHeight + 3 + 'px'
  }

  render () {
    const POST_MODAL =
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{literals.postModalHeading}</p>
            <button className="delete" aria-label="close" onClick={this.toggleShowPostModal}></button>
          </header>
          <section className="modal-card-body">
            <textarea autoFocus className={styles.postInput} onInput={this.adjustAddPostTextareaSize}></textarea>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-link">{literals.postModalPublish}</button>
            <button className="button" onClick={this.toggleShowPostModal}>{literals.postModalCancel}</button>
          </footer>
        </div>
      </div>
    const ADD_POST_BOX =
      <div id='AddPostBox' className={styles.addPostBox}>
        <div className='tile is-ancestor'><div className='tile is-vertical'>
          <button className="button is-link" onClick={this.toggleShowPostModal}>{literals.post}</button>
        </div></div>
      </div>
    return (
      <div id='NewsPage'>
        <h1 className={sharedStyles.pageHeading}>{literals.pageHeading}</h1>
        {ADD_POST_BOX}
        {this.state.showPostModal && POST_MODAL}
      </div>
    )
  }
}
