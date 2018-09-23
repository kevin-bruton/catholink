import { connect } from 'react-redux'
import { LoginPage } from './Login'

function mapStateToProps (state) {
  const { loggingIn, loggedIn, loginFailure } = state.auth
  return {
    loggingIn,
    loggedIn,
    loginFailure
  }
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage)
export { connectedLoginPage as Login }
