const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')
const apiRouter = require('./routes/api')
const frontRouter = require('./routes/front')
const authRouter = require('./routes/auth')
const signUpRouter = require('./routes/signup')

const app = express()

// For development:
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routers
app.use('/signup', signUpRouter)
app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/', frontRouter)

;(async () => {
  await db.init()
  console.log('DB connection open')
  const PORT = 5000

  const server = app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}...`))

  process.on('SIGINT', function () {
    console.log('DB connection closed')
    db.close()
    server.close()
  })
  process.once('SIGUSR2', function () {
    db.close()
    console.log('DB connection closed')
    server.close(function () {
      process.kill(process.pid, 'SIGUSR2')
    })
  })
})()
