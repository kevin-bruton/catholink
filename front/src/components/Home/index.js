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
    const todaysDate = (new Date()).toLocaleString('en-AU').slice(0, 10).split('/').reverse().join('-')
    if (!this.state.gospel.title || !this.state.gospel.text) {
      let gospel = {}
      try {
        gospel = await post('gospel', { lang: usersLanguage, date: todaysDate })
      } catch (err) {
        gospel.title = literals.noGospel
        gospel.text = literals.noGospel
      }
      this._isMounted && this.setState({ gospel })
    }
  }
  componentWillUnmount () {
    this._isMounted = false
  }
  render () {
    return (
      <div>
        <h1>Home Page</h1>
        <h1>{this.state.day}</h1>
        <h1>{this.state.gospel.title}</h1>
        <small>{this.state.gospel.text}</small>
      </div>
    )
  }
}
