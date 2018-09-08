/* eslint-env mocha */
/* eslint no-unused-expressions: "off" */
const expect = require('chai').expect
const axios = require('axios')
const db = require('@db')
const users = [
  { _id: '8888888', email: 'kev@mail.com', password: 'rocker', testDoc: true },
  { _id: '999999', email: 'joker', password: 'joker', testDoc: true }
]

describe('AUTH TESTS', function () {
  before(async function () {
    await db.init()
    await db.users.insertMany(users)
  })

  describe('Invoke POST /auth with invalid credentials and get error message', function () {
    let resp
    before(async function () {
      try {
        resp = await axios.post('http://localhost:5000/auth', { email: 'dummy', password: 'dummy' })
      } catch (err) {
        resp = err.response
      }
    })
    it('should recieve status 401 Unauthorized', function () {
      expect(resp.status).to.equal(401)
    })
    it('should receive error message "Invalid credentials"', function () {
      expect(resp.data.error).to.be.equal('Invalid credentials')
    })
  })

  describe('Invoke POST /auth with email and password to get authorization token', function () {
    let resp
    before(async function () {
      try {
        resp = await axios.post('http://localhost:5000/auth', { email: users[0].email, password: users[0].password })
      } catch (err) {
        resp = err.response
      }
    })
    it('should recieve OK', function () {
      expect(resp.status).to.be.equal(200)
    })
    it('should return user data', function () {
      expect(resp.data.user).to.be.ok
    })
    it('should return an authorization token', function () {
      expect(resp.data.token).to.be.ok
    })
  })

  after(async function () {
    await db.users.deleteMany({ testDoc: true })
    await db.close()
  })
})
