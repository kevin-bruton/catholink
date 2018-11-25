/* global describe it expect */
import React from 'react'
import { WidgetPanel } from '@components/WidgetPanel'
import { shallow } from 'enzyme'

describe('The WidgetPanel Component', () => {
  it('renders the navigation menu', () => {
    const component = shallow(<WidgetPanel />)
    expect(component.find('#WidgetPanel')).toHaveLength(1)
    expect(component.find('#WidgetPanel ul li')).toHaveLength(4)
  })
})
