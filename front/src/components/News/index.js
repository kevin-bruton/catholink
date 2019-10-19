import React from 'react'
import { post } from '@request'
import { usersLanguage } from '@helpers/usersLanguage'
import { literals } from './literals'
import {getStoreValue, setStoreValue, storeCategory} from '@store'

export class News extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gospel: {},
      day: ''
    }
  }
  async componentDidMount () {
    let gospel = getStoreValue(storeCategory.GOSPEL)
    if (gospel === undefined) {
      gospel = await this.getGospel()
      setStoreValue(storeCategory.GOSPEL, gospel)
    }
    this.setState({ gospel })
  }
  async getGospel () {
    const todaysDate = (new Date()).toLocaleString('en-AU').slice(0, 10).split('/').reverse().join('-')
    let gospel = {}
    try {
      gospel = await post('gospel', { lang: usersLanguage(), date: todaysDate })
    } catch (err) {
      gospel.title = literals.noGospel
      gospel.text = literals.noGospel
    }
    return gospel
  }
  render () {
    return (
      <div id='NewsPage'>
        <h1>News Page</h1>
        <h1 id='date'>{this.state.day}</h1>
        <h1 id='gospelTitle'>{this.state.gospel && this.state.gospel.title}</h1>
        <small id='gospelText'>{this.state.gospel && this.state.gospel.text}</small>
      </div>
    )
  }
}
