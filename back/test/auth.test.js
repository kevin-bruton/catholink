/* global describe it beforeAll afterAll expect */
/* eslint no-unused-expressions: "off" */
const axios = require('axios')
const db = require('@db')
const users = [
  { _id: '8888888', username: 'kev@mail.com', password: 'rocker', testDoc: true },
  { _id: '999999', username: 'joker', password: 'joker', testDoc: true }
]

describe('AUTH TESTS', function () {
  beforeAll(async function () {
    await db.init()
    await db.users.insertMany(users)
  })

  describe('Invoke POST /auth with invalid credentials and get error message', function () {
    let resp
    beforeAll(async function () {
      try {
        resp = await axios.post('http://localhost:5000/auth', { username: 'dummy', password: 'dummy' })
      } catch (err) {
        resp = err.response
      }
    })
    it('should recieve status 401 Unauthorized', function () {
      expect(resp.status).toEqual(401)
    })
    it('should receive error message "Invalid credentials"', function () {
      expect(resp.data.error).toEqual('Invalid credentials')
    })
  })

  describe('Invoke POST /auth with username and password to get authorization token', function () {
    let resp
    beforeAll(async function () {
      try {
        resp = await axios.post('http://localhost:5000/auth', { username: users[0].username, password: users[0].password })
      } catch (err) {
        resp = err.response
      }
    })
    it('should recieve OK', function () {
      expect(resp.status).toEqual(200)
    })
    it('should return user data', function () {
      expect(resp.data.user).toBeTruthy()
    })
    it('should return an authorization token', function () {
      expect(resp.data.token).toBeTruthy()
    })
  })

  afterAll(async function () {
    await db.users.deleteMany({ testDoc: true })
    await db.close()
  })
})
