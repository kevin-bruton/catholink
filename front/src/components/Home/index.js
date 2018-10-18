import React from 'react'
import { post } from '@services'
import { usersLanguage } from '@helpers/usersLanguage'
import { literals } from './literals'

export class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gospel: {},
      day: ''
    }
    this._isMounted = false
  }
  async componentDidMount () {
    this._isMounted = true
    if (!this.state.gospel.title || !this.state.gospel.text) {
      const gospel = this.getGospel()
      this._isMounted && this.setState({ gospel })
    }
  }
  componentWillUnmount () {
    this._isMounted = false
  }
  async getGospel() {
    const todaysDate = (new Date()).toLocaleString('en-AU').slice(0, 10).split('/').reverse().join('-')
    let gospel = {}
    try {
      gospel = await post('gospel', { lang: usersLanguage, date: todaysDate })
    } catch (err) {
      gospel.title = literals.noGospel
      gospel.text = literals.noGospel
    }
    return gospel
  }
  render () {
    return (
      <div>
        <h1>Home Page</h1>
        <h1 id='date'>{this.state.day}</h1>
        <h1 id='gospelTitle'>{this.state.gospel.title}</h1>
        <small id='gospelText'>{this.state.gospel.text}</small>
      </div>
    )
  }
}
