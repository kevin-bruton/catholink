import { connect } from 'react-redux';
import Login from '../../components/login';

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn
  }
};

const LoginTester = connect(
  mapStateToProps
)(Login);

export default LoginTester;
