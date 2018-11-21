/* global describe it jest expect beforeEach afterEach beforeAll afterAll __rewire_reset_all__ */
const axios = require('axios')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const vcr = require('./vcr')
const request = require('./request')
const rp = require('request-promise')
const fs = require('fs-extra')
const path = require('path')
const config = require('./config')

describe('VCR Middleware', () => {
  const vcrPort = 5500
  const remotePort = 5000
  const recordingsDir = 'testRecordings'
  config.remoteUrl = `http://localhost:${remotePort}`
  config.vcrUrl = `http://localhost:${vcrPort}`
  config.dir = 'testRecordings'
  config.port = vcrPort
  const testEndpoint = '/my/endpoint'
  let server, resp
  const requestData = {method: 'POST', url: `${config.vcrUrl}${testEndpoint}`, data: {info: 'info'}, headers: {'Content-Type': 'application/json'}}
  const expectedToReturn = {status: 200, statusText: 'OK', data: {info: 'info returned'}}
  request.__Rewire__('axios', jest.fn(() => Promise.resolve(expectedToReturn)))
  const axios = request.__get__('axios')
  const startServer = mode => {
    return new Promise(resolve => {
      config.mode = mode
      const app = express()
      app.use(cors())
      app.use(bodyParser.urlencoded({ extended: false }))
      app.use(bodyParser.json())

      app.use(vcr(config))

      const server = app.listen(config.port, () => resolve(server))
    })
  }
  const stopServer = server => {
    return new Promise(resolve => {
      server.close(() => resolve())
    })
  }

  describe(`Record mode. When a HTTP request is made:`, () => {
    beforeAll(async () => {
      jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
      server = await startServer('record')
      resp = await rp(requestData.url, {method: requestData.method, body: requestData.data, json: true, resolveWithFullResponse: true})
      requestData.url = `${config.remoteUrl}${testEndpoint}`
    })
    afterAll(async () => {
      await stopServer(server)
      requestData.url = `${config.vcrUrl}${testEndpoint}`
      axios.mockClear()
    })
    it(`makes the same request but to the remote URL`, async () => {
      expect(axios).toBeCalledWith(requestData)
    })

    it(`saves the request`, () => {
      const getRecordingFilePath = vcr.__get__('getRecordingFilePath')
      const filepath = getRecordingFilePath(config.dir, config.remoteUrl, testEndpoint, requestData, config.dataFilter4FileHash)
      const recording = JSON.parse(fs.readFileSync(filepath))
      const expectedRecording = {
        request: requestData,
        response: expectedToReturn
      }
      expect(recording).toEqual(expectedRecording)
    })

    it(`returns the response`, () => {
      expect(resp.body).toEqual(expectedToReturn.data)
    })
  })

  describe(`Playback mode. When a HTTP request is made:`, () => {
    beforeAll(async () => {
      jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
      server = await startServer('playback')
      resp = await rp(requestData.url, {method: requestData.method, body: requestData.data, json: true, resolveWithFullResponse: true})
      requestData.url = `${config.remoteUrl}${testEndpoint}`
    })
    afterAll(async () => {
      await stopServer(server)
      axios.mockClear()
      requestData.url = `${config.vcrUrl}${testEndpoint}`
    })
    it(`doesn't make a new request`, () => {
      expect(axios).not.toBeCalled()
    })
    describe(`When there is a recording`, () => {
      it(`returns a recording`, async () => {
        expect(resp.statusCode).toBe(200)
        expect(resp.statusMessage).toBe('OK')
        expect(resp.body).toEqual(expectedToReturn.data)
      })
    })
    describe(`When there is NOT a recording`, () => {
      it(`returns 404`, async () => {
        jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
        requestData.url = `${config.vcrUrl}${testEndpoint}`
        try {
          resp = await rp(requestData.url, {method: 'GET', body: {unknown: 'nonExistant'}, json: true, resolveWithFullResponse: true})
        } catch (err) {
          expect(err.statusCode).toBe(404)
        }
      })
    })
  })

  describe(`Cache mode. When a HTTP request is made:`, () => {
    describe(`When there is a recording saved`, () => {
      beforeAll(async () => {
        jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
        server = await startServer('cache')
        resp = await rp(requestData.url, {method: requestData.method, body: requestData.data, json: true, resolveWithFullResponse: true})
        requestData.url = `${config.remoteUrl}${testEndpoint}`
      })
      afterAll(async () => {
        await stopServer(server)
        axios.mockClear()
        requestData.url = `${config.vcrUrl}${testEndpoint}`
      })
      it(`doesn't make a request to the remote`, () => {
        expect(axios).not.toBeCalled()
      })

      it(`returns that recording`, () => {
        expect(resp.statusCode).toBe(200)
        expect(resp.statusMessage).toBe('OK')
        expect(resp.body).toEqual(expectedToReturn.data)
      })
    })
    
    describe(`When there isn't a recording saved`, () => {
      beforeAll(async () => {
        jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
        requestData.method = 'GET'
        server = await startServer('cache')
        resp = await rp(requestData.url, {method: requestData.method, body: requestData.data, json: true, resolveWithFullResponse: true})
        requestData.url = `${config.remoteUrl}${testEndpoint}`
      })
      afterAll(async () => {
        await stopServer(server)
        axios.mockClear()
        requestData.url = `${config.vcrUrl}${testEndpoint}`
        fs.removeSync(path.join(__dirname, recordingsDir))
      })
      it(`makes the same request but to the remote URL`, () => {
        expect(axios).toBeCalledWith(requestData)
      })

      it(`saves the request`, () => {
        const getRecordingFilePath = vcr.__get__('getRecordingFilePath')
        const filepath = getRecordingFilePath(recordingsDir, config.remoteUrl, testEndpoint, requestData, config.dataFilter4FileHash)
        const recording = JSON.parse(fs.readFileSync(filepath))
        const expectedRecording = {
          request: requestData,
          response: expectedToReturn
        }
        expect(recording).toEqual(expectedRecording)
      })

      it(`returns the response`, () => {
        expect(resp.body).toEqual(expectedToReturn.data)
      })
    })
  })

  describe('config.dataFilter4FileHash: Hash to get filename', () => {
    it(`returns a filename if data is empty`, () => {
      const filename = config.dataFilter4FileHash()
      expect(filename).toBeTruthy()
    })

    it(`returns the same filename if data is the same`, () => {
      const data = {info: 'info'}
      const filename1 = config.dataFilter4FileHash(data)
      const filename2 = config.dataFilter4FileHash(data)
      expect(filename1).toEqual(filename2)
    })

    it(`returns a different filename for different sets of data`, () => {
      const data1 = {info: 'info1'}
      const data2 = {info: 'info2'}
      const filename1 = config.dataFilter4FileHash(data1)
      const filename2 = config.dataFilter4FileHash(data2)
      expect(filename1).not.toEqual(filename2)
    })

    it(`returns the same filename even though data.date is different`, () => {
      const data1 = {info: 'info', date: '123'}
      const data2 = {info: 'info', date: '456'}
      const filename1 = config.dataFilter4FileHash(data1)
      const filename2 = config.dataFilter4FileHash(data2)
      expect(filename1).toEqual(filename2)
    })
  })

  describe(`The Request Module`, () => {
    const requestData = {method: 'GET', url: 'http://localhost/myapi', headers: {'Content-Type': 'application/json'}, data: {data: 'data'}}
    it(`returns the response when the request is successful`, async () => {
      const response = { response: 'this is a response' }
      request.__Rewire__('axios', () => Promise.resolve(response))
      const resp = await request(requestData)
      expect(resp).toEqual(response)
    })

    it(`returns status 500 when error is thrown`, async () => {
      const error = new Error()
      error.code = 'ECONNREFUSED'
      error.address = 1234
      error.port = 5000
      request.__Rewire__('axios', () => Promise.reject(error))
      const resp = await request(requestData)
      expect(resp).toEqual({status: 500, statusText: error.code, data: {error: error.code, address: error.address, port: error.port}})
    })

    it(`returns the status and response info when server responds with a non 200 code`, async () => {
      const error = new Error()
      error.response = {status: 401, statusText: 'forbidden', data: 'data'}
      request.__Rewire__('axios', () => Promise.reject(error))
      const resp = await request(requestData)
      expect(resp).toEqual(error.response)
    })

    it(`returns request info when request made but no response received`, async () => {
      const error = new Error()
      error.request = requestData
      request.__Rewire__('axios', () => Promise.reject(error))
      const resp = await request(requestData)
      expect(resp).toEqual(error.request)
    })

    it(`returns error message when something happened setting up the request`, async () => {
      const generalError = {status: 500, statusText: 'Error setting up request', message: ''}
      const error = new Error()
      request.__Rewire__('axios', () => Promise.reject(error))
      const resp = await request(requestData)
      expect(resp).toEqual(generalError)
    })
  })
})
