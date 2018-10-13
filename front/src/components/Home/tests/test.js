/* global describe it expect */
import React from 'react'
import ReactDOM from 'react-dom'
import { Home } from '@components/Home'
import renderer from 'react-test-renderer'

describe('The Home Component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Home />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  it('Snapshot matches', () => {
    const component = renderer.create(<Home />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
