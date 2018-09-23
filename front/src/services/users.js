import { authHeader } from '@helpers/authHeader'

export const userService = {
  login,
  logout,
  getAll
}

const baseUrl = 'http://localhost:5000'

function login (username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ username, password })
  }

  return window.fetch(`${baseUrl}/auth`, requestOptions)
    .then(handleResponse)
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        window.localStorage.setItem('user', JSON.stringify(user))
        return user
      } else {
        return Promise.reject(new Error('Login failure'))
      }
    })
}

function logout () {
  // remove user from local storage to log user out
  window.localStorage.removeItem('user')
}

function getAll () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }

  return window.fetch(`/users`, requestOptions).then(handleResponse)
}

function handleResponse (response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout()
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
