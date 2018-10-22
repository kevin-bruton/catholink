import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

var localStorageMock = (() => {
  var store = {}
  return {
    getItem: (key) => {
      return store[key]
    },
    setItem: (key, value) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    },
    removeItem: (key) => {
      delete store[key]
    }
  }
})()

global.window = global.window || {}
global.document = global.document || {}

Object.defineProperty(global.window, 'localStorage', { value: localStorageMock })

