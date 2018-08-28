export default {
  get,
  set
}

function get (name) {
  return (`; ${document.cookie}`).split(`; ${name}=`).pop().split(';').shift()
}

function set (name, value) {
  document.cookie = `${name}=${value}; expires=0; path=/`
}
