import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { App as AppComp } from './App'

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  }
}

export const App = withRouter(connect(mapStateToProps)(AppComp))
