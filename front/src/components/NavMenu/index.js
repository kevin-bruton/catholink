import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { literals } from './literals'

export class NavMenu extends Component {
  render () {
    return (
      <aside id='NavMenu' className='menu'>
        <ul className='menu-list'>
          <li><NavLink activeClassName='is-active' exact to='/'>{literals.home}</NavLink></li>
          <li><NavLink activeClassName='is-active' to='/messages'>{literals.messages}</NavLink></li>
        </ul>
      </aside>
    )
  }
}
