/* global describe it expect */
import React from 'react'
import { PublicityPanel } from '@components/PublicityPanel'
import { shallow } from 'enzyme'

describe('The PublicityPanel Component', () => {
  it('renders the navigation menu', () => {
    const component = shallow(<PublicityPanel />)
    expect(component.find('#PublicityPanel')).toHaveLength(1)
  })
})
