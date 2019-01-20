/* global describe it beforeAll afterAll expect */
/* eslint no-unused-expressions: "off" */
const axios = require('axios')
const db = require('@db')
const password = require('../../../catholink')

const newUser = {
    firstName: 'Joe',
    surname: 'Blow',
    email: 'catholink@mail.com',
    password: '123456'
}
const code = '1234'

 
describe('signup/validate endpoint', async () => {
  let res
   beforeAll(async () => {
    await db.init()
    await db.signup.insertOne(Object.assign(newUser, {status: 'emailSent', code}))
  })

  it('when a valid code is sent: it returns status 200 and no errors', async () => {
    try {
      res = await axios.get(`http://localhost:5000/signup/validate?code=${code}`)
    } catch (err) {
      console.log('ERROR test axios signup/validate', err)
    }
    expect(res.status).toEqual(200)
    expect(res.data.error).not.toBeDefined()
  })

  it('when a valid code is sent: it adds user to registered users collection', async () => {
    const found = await (await db.users.find({email: newUser.email})).toArray()
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

  afterAll(async () => {
    // await db.signup.deleteOne({email: newUser.email})
    // await db.users.deleteOne({email: newUser.email})
    await db.close()
  })
})
