export {
  logIn,
  logOut,
};

function logIn() {
  return {
    type: 'LOG_IN',
  }
}

function logOut() {
  return {
      type: 'LOG_OUT',
    };
}
