/* global describe it expect */
import React from 'react'
import { NavMenu } from '@components/NavMenu'
import { shallow } from 'enzyme'

describe('The NavMenu Component', () => {
  it('renders the navigation menu', () => {
    const component = shallow(<NavMenu />)
    expect(component.find('aside')).toHaveLength(1)
    expect(component.find('NavLink[to="/"]')).toHaveLength(1)
    expect(component.find('NavLink[to="/about"]')).toHaveLength(1)
    expect(component.find('NavLink[to="/login"]')).toHaveLength(1)
  })
})
