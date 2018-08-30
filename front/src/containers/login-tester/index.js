import { connect } from 'react-redux'
import Login from '@components/login'
import { withRouter } from 'react-router-dom'

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  }
}

const LoginTester = connect(
  mapStateToProps
)(Login)

export default withRouter(LoginTester)
