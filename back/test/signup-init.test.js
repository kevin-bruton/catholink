/* global describe it beforeAll afterAll expect */
/* eslint no-unused-expressions: "off" */
const axios = require('axios')
const db = require('../db')
const { initUser } = require('./users')
const server = require('./spawn-server')

describe('signup/init endpoint', () => {
  beforeAll(async () => {
    await db.open()
    await server.start()
    await db.signUp().deleteOne({email: initUser.email})
  })

  afterAll(async () => {
    await db.close()
    server.stop()
  })

  it(`the test user doesn't exist in the signup collection`, async () => {
    const testUsers = await (await db.signUp().find({email: initUser.email})).toArray()
    expect(testUsers.length).toEqual(0)
  })

  describe('signup/init for first time', () => {
    let userAdded
    beforeAll(async () => {
    })

    afterAll(async () => {
      // await db.signUp().deleteOne({email: initUser.email})
    })

    it('adds new user in signup collection with firstName, surname, email, hashedPassword, and validation code', async () => {
      try {
        await axios.post(`${process.env.CAT_DOMAIN}/signup/init`, initUser)
      } catch (err) {
        console.log('AXIOS ERROR:', err)
      }
      userAdded = (await (await db.signUp().find({email: initUser.email})).toArray())[0]
      expect(userAdded.firstName).toEqual(initUser.firstName)
      expect(userAdded.surname).toEqual(initUser.surname)
      expect(userAdded.email).toEqual(initUser.email)
      expect(userAdded.hashedPassword).toBeTruthy()
      expect(userAdded.code).toBeTruthy()
      expect(userAdded.status).toEqual('emailSent')
      expect(userAdded.numEmailsSent).toEqual(1)
    })
    /*
    it('sends and email with the validation link to the user', async () => {
      expect(userAdded.status).toEqual('emailSent')
    })

    it('returns status 200, with message "Validation email sent"', () => {
      expect(res.status).toEqual(200)
      expect(res.data.message).toEqual('Validation email sent')
    }) */
  })
/*
  describe('signup/init for registered user', () => {
    let res
    beforeAll(async () => {
      await db.users().insertOne(initUser)
      try {
        res = await axios.post('http://localhost:5000/signup/init', initUser)
      } catch (err) {
        res = err.response
      }
    })

    afterAll(async () => {
      await db.users().deleteOne({email: initUser.email})
      await db.signUp().deleteOne({email: initUser.email})
    })

    it('returns status 409 with error "User is already registered"', () => {
      expect(res.status).toEqual(409)
      expect(res.data.error).toEqual('User is already registered')
    })
  }) */
/*
  describe('signup/init unregistered user who has already attempted signup', () => {
    let res
    beforeAll(async () => {
      await db.signUp().insertOne(Object.assign(initUser, {status: 'failed', numEmailsSent: 1}))
      res = await axios.post('http://localhost:5000/signup/init', initUser)
    })

    afterAll(async () => {
      // await db.signUp().deleteOne({email: initUser.email})
    })

    it('sends new email', async () => {
      const data = await (await db.signUp().find({email: initUser.email})).toArray()
      expect(data[0].status).toEqual('emailSent')
      expect(data[0].numEmailsSent).toEqual(2)
    })

    it('returns status 200, with message "Validation email sent"', () => {
      expect(res.status).toEqual(200)
      expect(res.data.message).toEqual('Validation email sent')
    })
  }) */
})
