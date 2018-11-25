import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { literals } from './literals'

export class NavMenu extends Component {
  render () {
    return (
      <aside id='NavMenu' className='menu'>
        <ul className='menu-list'>
          <li><NavLink activeClassName='is-active' exact to='/'>{literals.home}</NavLink></li>
          <li><NavLink activeClassName='is-active' to='/about'>{literals.about}</NavLink></li>
          <li><NavLink activeClassName='is-active' to='/login'>{literals.logout}</NavLink></li>
        </ul>
      </aside>
    )
  }
}
