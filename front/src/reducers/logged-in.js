export default loggedIn;

const initialState = {
  loggedIn: true,
};

function loggedIn(state = initialState, action) {
  switch(action.type) {
    case 'LOG_IN': return { ...state, loggedIn: true };
    case 'LOG_OUT': return { ...state, loggedIn: false };
    default: return state;
  }
}
