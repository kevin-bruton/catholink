/* global describe it expect */
import React from 'react'
import { Header } from '@components/Header'
import { shallow } from 'enzyme'

describe('The Header Component', () => {
  it('Renders the header', () => {
    const component = shallow(<Header />)
    expect(component.find('header')).toHaveLength(1)
    expect(component.find('header > .columns > .column img')).toHaveLength(1)
    expect(component.find('header > .columns > .column > h1')).toHaveLength(1)
  })
})
