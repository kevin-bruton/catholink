import React from 'react'
import AvatarEdit from 'react-avatar-edit'
import {post as postRequest} from '@services/request'
import { literals } from './literals';
import styles from './styles.scss'
const resizeBase64 = require('resize-base64')
 
export class AvatarEditor extends React.Component {
  constructor(props) {
    super(props)
    this.email = props.email
    this.state = {
      preview: props.photo || null,
      saveSuccessful: false
    }
    this.onCrop = this.onCrop.bind(this)
    this.onClose = this.onClose.bind(this)
    this.upload = this.upload.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.photo !== prevProps.photo) {
      this.setState({preview: this.props.photo})
    }
  }
  
  onClose(preview) {
    // console.log('onClose preview:', preview)
    this.props.closeEvent(preview)
  }
  
  onCrop(preview) {
    this.setState({preview})
  }

  async upload () {
    console.log('upload image. Before resize:', this.state.preview.length)
    const img = resizeBase64(this.state.preview, 128, 128)
    console.log('After resize:', img.length)
    await postRequest('profile/avatar', {email: this.email, avatar: this.state.preview})
    this.onClose(this.state.preview)
  }
  
  render () {
    return ( 
      <div className='modal is-active'>
        <div className='modal-background'></div>
        <div className='modal-content'>
          <div className='box'>
            <h2 className='title is-4'>{literals.title}</h2>
            <div className='columns'>
              <div id='avatarEdit' className={'column ' + styles.selectFileBox}>
                <AvatarEdit
                  width={200}
                  height={200}
                  onCrop={this.onCrop}
                  onClose={this.onClose}
                  label={literals.chooseFile}
                />
              </div>
              <div className={'column' + (this.state.preview ? ' ' + styles.editBox : '')}>
                <div>{literals.preview}:</div>
                {this.state.preview && <img id='avatarPreview' src={this.state.preview} alt="Preview" />}
              </div>
            </div>
            <div>
              <button className='button is-link' onClick={this.upload}>{literals.save}</button>
              <button className={'button is-link ' + styles.separate} onClick={this.onClose}>{literals.cancel}</button>
              {this.state.saveSuccessful && <p>{literals.saveSuccessful}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
