const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const vcr = require('./vcr')
const config = require('./config')

const app = express()

config.mode = process.argv[2] || config.defaultMode

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(vcr(config))

app.listen(config.port,
  () => console.log(`VCR is running on PORT ${config.port} in ${config.mode} mode...`))
