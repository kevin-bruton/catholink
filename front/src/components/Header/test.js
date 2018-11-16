/* global describe it expect */
import React from 'react'
import { Header } from '@components/Header'
import { shallow } from 'enzyme'

describe('The Header Component', () => {
  it('Renders the header', () => {
    const component = shallow(<Header />)
    expect(component.find('header')).toHaveLength(1)
    expect(component.find('header > div > div img')).toHaveLength(1)
    expect(component.find('header > div > div > h1')).toHaveLength(1)
    expect(component.find('header > div > div > h4')).toHaveLength(1)
  })
})
