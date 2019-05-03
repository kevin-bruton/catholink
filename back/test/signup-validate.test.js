/* global describe it beforeAll afterAll expect */
/* eslint no-unused-expressions: "off" */
const axios = require('axios')
const db = require('../db')
const server = require('./spawn-server')

describe('signup/validate endpoint', () => {
  const testUserEmail = 'testing@mail.com'
  let res, initUser
  beforeAll(async () => {
    await db.open()
    await server.start()
  })

  afterAll(async () => {
    await db.close()
    server.stop()
  })

  it('there is already a user who has initiated the signup process without validating (signupInit test)', async () => {
    await db.users().deleteOne({email: testUserEmail})
    initUser = (await (await db.signUp().find({email: testUserEmail})).toArray())[0]
    expect(initUser.status).toEqual('emailSent')
  })

  it('when a valid code is sent: it returns status 200 and no errors', async () => {
    try {
      res = await axios.get(`http://localhost:5000/signup/validate?code=${initUser.code}`)
    } catch (err) {
      console.log('ERROR test axios signup/validate', err)
    }
    expect(res.status).toEqual(200)
    expect(res.data.error).not.toBeDefined()
  })

  it('when a valid code is sent: it adds user to registered users collection', async () => {
    const found = await (await db.users().find({email: initUser.email})).toArray()
    expect(found.length).toEqual(1)
  })

  it(`when an invalid code is sent: it returns 200 with an error message`, async () => {
    const invalidCode = '4321'
    try {
      res = await axios.get(`http://localhost:5000/signup/validate?code=${invalidCode}`)
    } catch (err) {
      res = err.response
    }
    expect(res.status).toEqual(200)
    expect(res.data.error).toEqual('Not a valid code')
  })
})
