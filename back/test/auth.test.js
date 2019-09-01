/* global describe it beforeAll afterAll expect */
/* eslint no-unused-expressions: "off" */
const axios = require('axios')
const db = require('../db')
const server = require('./spawn-server')

describe('AUTH TESTS', function () {
  const testUserEmail = 'testing@mail.com'
  let validUser
  beforeAll(async function () {
    await db.open()
    await server.start()
  })

  afterAll(async function () {
    await db.users().deleteMany({ testDoc: true })
    server.stop()
    await db.close()
  })

  it('there is already a test user registered (gone through signup-init and signup-validate)', async () => {
    validUser = (await (await db.users().find({email: testUserEmail})).toArray())[0]
    expect(validUser).toBeTruthy()
  })

  describe('Invoke POST /auth with invalid credentials and get error message', function () {
    let resp
    beforeAll(async function () {
      try {
        resp = await axios.post(`${process.env.CAT_DOMAIN}/auth`, { email: 'dummy@mail.com', password: 'dummy' })
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

  describe('Invoke POST /auth with email and password to get authorization token', function () {
    let resp
    beforeAll(async function () {
      try {
        resp = await axios.post(`${process.env.CAT_DOMAIN}/auth`, { email: validUser.email, password: validUser.password })
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
})
