import React from 'react'
import { post } from '@services'
import { usersLanguage } from '@helpers/usersLanguage'

export class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gospel: {},
      day: ''
    }
  }
  async componentDidMount () {
    const todaysDate = (new Date()).toLocaleString('en-AU').slice(0, 10).split('/').reverse().join('-')
    if (!this.state.gospel.title || !this.state.gospel.text) {
      this.setState({ gospel: await post('gospel', { lang: usersLanguage, date: todaysDate }) })
    }
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
