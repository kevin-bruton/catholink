import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

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
Object.defineProperty(window, 'localStorage', { value: localStorageMock })
