import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.scss'
import LoginTester from './containers/login-tester'
import registerServiceWorker from './registerServiceWorker'
import store from './store'

ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <LoginTester />
    </BrowserRouter>
  </Provider>
), document.getElementById('root'))

registerServiceWorker()
