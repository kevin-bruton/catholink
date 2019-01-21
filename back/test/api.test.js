/* global describe beforeAll it expect */
/* eslint no-unused-expressions: "off" */
const axios = require('axios')

describe('API TESTS', function () {
  describe('GET /api', function () {
    describe('Invoke without token and get error message', function () {
      let resp
      beforeAll(async function () {
        try {
          resp = await axios.get('http://localhost:5000/api')
        } catch (err) { resp = err.response }
      })
      it('should return status 401 Unauthorized', function () {
        expect(resp.status).toEqual(401)
      })
      it('should return an error message: "Unauthorized"', function () {
        expect(resp.data.error).toEqual('Unauthorized')
      })
    })

    describe('Invoke with invalid token and get "Unauthorized" error message', function () {
      let resp
      beforeAll(async function () {
        try {
          resp = await axios.get('http://localhost:5000/api', { headers: { Authorization: 'Bearer 123456' } })
          console.log(resp)
        } catch (err) { resp = err.response }
      })
      it('should return status 401 Unauthorized', function () {
        expect(resp.status).toEqual(401)
      })
      it('should return an error message: "Unauthorized"', function () {
        expect(resp.data.error).toEqual('Unauthorized')
      })
    })

    describe('Invoke with valid token and get API version', function () {
      let resp, token
      beforeAll(async function () {
        try {
          resp = await axios.post('http://localhost:5000/auth', { email: 'kevin@mail.com', password: 'secret' })
          token = resp.data.token
        } catch (err) {
          resp = err.response
          return
        }
        try {
          resp = await axios.get('http://localhost:5000/api', { headers: { Authorization: `Bearer ${token}` } })
        } catch (err) { resp = err.response }
      })
      it('should return status 200 ok', function () {
        expect(resp.status).toEqual(200)
      })
      it('should return an API version', function () {
        expect(resp.data.apiVersion).toBeTruthy()
      })
    })
  })
  describe('GET /api/validate', function () {
    describe('Invoke with invalid token and get 401 "Unauthorized" returned', function () {
      let resp
      beforeAll(async function () {
        try {
          resp = await axios.get('http://localhost:5000/api', { headers: { Authorization: 'Bearer 123456' } })
          console.log(resp)
        } catch (err) { resp = err.response }
      })
      it('should return status 401 Unauthorized', function () {
        expect(resp.status).toEqual(401)
      })
      it('should return an error message: "Unauthorized"', function () {
        expect(resp.data.error).toEqual('Unauthorized')
      })
    })

    describe('Invoke with valid token and get status 200', function () {
      let resp, token
      beforeAll(async function () {
        // jest.setTimeout(30000)
        try {
          resp = await axios.post('http://localhost:5000/auth/', { email: 'kevin@mail.com', password: 'secret' })
          token = resp.data.token
        } catch (err) {
          resp = err.response
        }
        try {
          resp = await axios.get('http://localhost:5000/api/validate', { headers: { Authorization: `Bearer ${token}` } })
        } catch (err) { resp = err.response }
      })
      it('should return status 200 ok', function () {
        expect(resp.status).toEqual(200)
      })
    })
  })
})
