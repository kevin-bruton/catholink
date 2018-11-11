/* global describe beforeAll it expect */
/* eslint no-unused-expressions: "off" */
const axios = require('axios')

describe('API TESTS', function () {
  let token

  beforeAll(async function () {
  })

  describe('Invoke GET /api without token and get error message', function () {
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

  describe('Invoke GET /api with invalid token and get "Unauthorized" error message', function () {
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

  describe('Invoke GET /api with valid token and get API version', function () {
    let resp
    beforeAll(async function () {
      try {
        resp = await axios.post('http://localhost:5000/auth', { username: 'kevin', password: 'kevin' })
        token = resp.data.token
      } catch (err) {
        resp = err.response
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
