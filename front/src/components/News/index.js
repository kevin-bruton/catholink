import React from 'react'
import { post as postRequest} from '@request'
import { literals } from './literals'
import {getStoreValue, storeCategory} from '@store'
import styles from './styles.scss'
import sharedStyles from '@sharedStyles'

export class News extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showPostModal: false,
      currentUser: getStoreValue(storeCategory.USER)
    }
    this.toggleShowPostModal = this.toggleShowPostModal.bind(this)
    this.adjustAddPostTextareaSize = this.adjustAddPostTextareaSize.bind(this)
    this.publish = this.publish.bind(this)
  }

  async componentDidMount () {
  }

  async publish () {
    const {profileId, firstName, surname, contacts} = this.state.currentUser
    const post = {
      "author": {profileId, firstName, surname},
      "audience": contacts,
      "content": "This is my post",
      "timestamp": Math.round((new Date()).getTime() /1000)
    }
    console.log('this is what we are going to post:', post)
    await postRequest('/post', post)
  }

  toggleShowPostModal () {
    this.setState({showPostModal: !this.state.showPostModal}, () => {
      console.log('init tiny', this.state.showPostModal)
      if (this.state.showPostModal) {
        // eslint-disable-next-line no-undef
        tinymce.init({
          selector: 'textarea#tinymce',
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
          content_css: [
            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
            '//www.tiny.cloud/css/codepen.min.css'
          ]
        });
      }
    })
  }

  adjustAddPostTextareaSize (e) {
    e.target.style.height = ''
    e.target.style.height = e.target.scrollHeight + 3 + 'px'
    console.log(e.target.value)
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
            <textarea id='tinymce' autoFocus /* className={styles.postInput}  */onInput={this.adjustAddPostTextareaSize}></textarea>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-link" onClick={this.publish}>{literals.postModalPublish}</button>
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
