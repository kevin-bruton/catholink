const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
require('./passport')
const db = require('./db')
const apiRouter = require('./routes/api')
const frontRouter = require('./routes/front')
const authRouter = require('./routes/auth')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routers
app.use('/auth', authRouter)
app.use('/api', passport.authenticate('jwt', {session: false}), apiRouter)
app.use('/', frontRouter)

;(async () => {
  await db.init()
  console.log('DB connection open')
  const PORT = process.env.PORT || 5000

  const server = app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}...`))

  process.on('SIGINT', function () {
    server.close(function () {
      db.close()
      console.log('DB connection closed')
    })
  })
})()
