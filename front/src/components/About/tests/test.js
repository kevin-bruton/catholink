/* global describe it expect */
import React from 'react'
import ReactDOM from 'react-dom'
import { About } from '@components/About'
import renderer from 'react-test-renderer'

describe('The About Component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<About />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  it('Snapshot matches', () => {
    const component = renderer.create(<About />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
