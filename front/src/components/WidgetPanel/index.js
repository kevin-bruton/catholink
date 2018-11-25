import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { literals } from './literals'

export class WidgetPanel extends Component {
  render () {
    return (
      <aside id='WidgetPanel'>
        <ul className='menu-list'>
          <li><Link to='/'>{literals.dailyPrayers}</Link></li>
          <li><Link to='/'>{literals.readings}</Link></li>
          <li><Link to='/'>{literals.liturgyHours}</Link></li>
          <li><Link to='/'>{literals.news}</Link></li>
        </ul>
      </aside>
    )
  }
}
