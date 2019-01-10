/* global describe it beforeAll afterAll expect */
/* eslint no-unused-expressions: "off" */
const axios = require('axios')
const db = require('@db')
const password = require('../../../catholink')

const newUser = {
    firstName: 'Joe',
    surname: 'Blow',
    email: 'catholink@mail.com',
    password
}

describe('signup/init endpoint', () => {
  beforeAll(async () => {
    await db.init()
  })

  describe('signup/init for first time', async () => {
    let res
    beforeAll(async () => {
      res = await axios.post('http://localhost:5000/signup/init', newUser)
    })

    it('adds new user in signup collection with firstName, surname, email, hashedPassword, and validation code', async () => {
      const found = (await db.signup.find({email: newUser.email})).toArray()
      const userAdded = (await found)[0]
      //console.log(userAdded)
      expect(userAdded.firstName).toEqual(newUser.firstName)
      expect(userAdded.surname).toEqual(newUser.surname)
      expect(userAdded.email).toEqual(newUser.email)
      expect(userAdded.hashedPassword).toBeTruthy()
      expect(userAdded.code).toBeTruthy()
      expect(userAdded.status).toEqual('emailSent')
      expect(userAdded.numEmailsSent).toEqual(1)
    })

    it('sends and email with the validation link to the user', async () => {
      const cursor = await db.signup.find({email: newUser.email})
      const data = await cursor.toArray()
      expect(data[0].status).toEqual('emailSent')
    })

    it('returns status 200, with message "Validation email sent"', () => {
      expect(res.status).toEqual(200)
      expect(res.data.message).toEqual('Validation email sent')
    })

    afterAll(async () => {
      return db.signup.deleteOne({email: newUser.email})
    })
  })

  describe('signup/init for registered user', async () => {
    let res
    beforeAll(async () => {
      await db.users.insertOne(newUser)
      try {
        res = await axios.post('http://localhost:5000/signup/init', newUser)
      } catch (err) {
        res = err.response
      }
    })

    it('returns status 409 with error "User is already registered"', () => {
      expect(res.status).toEqual(409)
      expect(res.data.error).toEqual('User is already registered')
    })

    afterAll(async () => {
      await db.users.deleteOne({email: newUser.email})
      await db.signup.deleteOne({email: newUser.email})
    })
  })

  describe('signup/init unregistered user who has already attempted signup', () => {
    let res
    beforeAll(async () => {
      await db.signup.insertOne(Object.assign(newUser, {status: 'failed', numEmailsSent: 1}))
      res = await axios.post('http://localhost:5000/signup/init', newUser)
    })

    it('sends new email', async () => {
      const data = await (await db.signup.find({email: newUser.email})).toArray()
      expect(data[0].status).toEqual('emailSent')
      expect(data[0].numEmailsSent).toEqual(2)
    })

    it('returns status 200, with message "Validation email sent"', () => {
      expect(res.status).toEqual(200)
      expect(res.data.message).toEqual('Validation email sent')
    })

    afterAll(async () => {
      await db.signup.deleteOne({email: newUser.email})
    })
  })

  afterAll(async () => {
    await db.close()
  })
})
