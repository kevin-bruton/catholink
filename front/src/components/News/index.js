import React from 'react'
import { post as postRequest, get as getRequest} from '@request'
import { literals } from './literals'
import {getStoreValue, storeCategory} from '@store'
import styles from './styles.scss'
import sharedStyles from '@sharedStyles'
import Quill from 'quill'
import {format} from 'date-fns'

export class News extends React.Component {
  dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  
  constructor (props) {
    super(props)
    this.state = {
      showPostModal: false,
      currentUser: getStoreValue(storeCategory.USER),
      news: []
    }
    this.toggleShowPostModal = this.toggleShowPostModal.bind(this)
    this.adjustAddPostTextareaSize = this.adjustAddPostTextareaSize.bind(this)
    this.publish = this.publish.bind(this)
  }

  componentDidMount () {
    this.updateNews();
  }

  async updateNews () {
    const news = await getRequest('/news?page=1')
    this.setState({news})
    console.log('CURRENT USER:', this.state.currentUser)
  }

  getFormattedPostDate (timestamp) {
    // 14 de noviembre a las 16:05
    return format(new Date(timestamp), 'PPPPpppp', )
  }

  async publish (e) {
    const {profileId, firstName, surname, contacts} = this.state.currentUser
    const post = {
      "author": {profileId, firstName, surname},
      "audience": contacts,
      "content": e.target.parentNode.parentElement.querySelector('#textEditor > .ql-editor').innerHTML,
      "timestamp": Math.round((new Date()).getTime() /1000)
    }
    const resp = await postRequest('post', post)
    resp.success && this.toggleShowPostModal()
    this.updateNews()
  }

  toggleShowPostModal () {
    this.setState({showPostModal: !this.state.showPostModal}, () => {
      if (this.state.showPostModal) {
        new Quill('#textEditor', {
          bounds: '#textEditor',
          modules: {
            'toolbar': [
              [{ 'font': []  }, { 'size': [] }],
              [ 'bold', 'italic', 'underline', 'strike' ],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'script': 'super' }, { 'script': 'sub' }],
              [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
              [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
              [ {'direction': 'rtl'}, { 'align': [] }],
              [ 'link', 'image', 'video', 'formula' ],
              [ 'clean' ]
            ],
          },
          theme: 'snow'
        });
      }
    })
  }

  adjustAddPostTextareaSize (e) {
    e.target.style.height = ''
    e.target.style.height = e.target.scrollHeight + 3 + 'px'
  }
  render () {
    const NEWS_BOX =
      <div className={styles.newsContainer}>
        <div className={'box ' + styles.newsBox}>
          {this.state.news.map(newsItem =>
            <div id="newsItem" key={newsItem._id} className={styles.newsItem}>
              <div className={styles.postDateBox}>
                {this.state.currentUser.locale}
                <div className={styles.postDate}>{(new Date(newsItem.timestamp)).toLocaleDateString(this.state.currentUser.locale, this.dateOptions)}</div>
              </div>
              <div dangerouslySetInnerHTML={{__html: newsItem.content}}></div>
            </div>
          )}
        </div>
      </div>
    const POST_MODAL =
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className={'modal-card ' + styles.postModalBox}>
          <header className="modal-card-head">
            <p className="modal-card-title">{literals.postModalHeading}</p>
            <button className="delete" aria-label="close" onClick={this.toggleShowPostModal}></button>
          </header>
          <section className="modal-card-body">
            <div id="textEditor" className={styles.textEditor}>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-link" onClick={this.publish}>{literals.postModalPublish}</button>
            <button className="button" onClick={this.toggleShowPostModal}>{literals.postModalCancel}</button>
          </footer>
        </div>
      </div>
    const ADD_POST_BOX =
      <div id='AddPostBox' className={styles.addPostBox}>
        <div className='tile is-ancestor'>
          <div className='tile is-vertical is-child'>
            <button className="button is-link" onClick={this.toggleShowPostModal}>{literals.post}</button>
          </div>
        </div>
      </div>
    return (
      <div id='NewsPage'>
        <h1 className={sharedStyles.pageHeading}>{literals.pageHeading}</h1>
        {ADD_POST_BOX}
        {NEWS_BOX}
        {this.state.showPostModal && POST_MODAL}
      </div>
    )
  }
}
