import React from 'react'
import AvatarEdit from 'react-avatar-edit'
import {post as postRequest} from '@services/request'
import { literals } from './literals';
import styles from './styles.scss'
 
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
    this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this)
    this.upload = this.upload.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.photo !== prevProps.photo) {
      this.setState({preview: this.props.photo})
    }
  }
  
  onClose(preview) {
    console.log('onClose preview:', preview)
    this.props.closeEvent(preview)
  }
  
  onCrop(preview) {
    this.setState({preview})
  }
 
  async onBeforeFileLoad(elem) {
    if(elem.target.files[0].size > 144000){
      alert("File is too big!");
      elem.target.value = "";
    }
  }

  async upload () {
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
              <div id='avatarEdit' className='column'>
                <AvatarEdit
                  width={200}
                  height={200}
                  onCrop={this.onCrop}
                  onClose={this.onClose}
                  onBeforeFileLoad={this.onBeforeFileLoad}
                  label={literals.chooseFile}
                />
              </div>
              <div className='column'>
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
