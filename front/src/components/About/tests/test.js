/* global describe it expect */
import React from 'react'
import {shallow} from 'enzyme'
import {About} from '@components/About'

describe('The About Component', () => {
  it('Renders the page title', () => {
    const wrapper = shallow(<About />)
    expect(wrapper.find('#pageTitle')).toHaveLength(1)
  })
})
