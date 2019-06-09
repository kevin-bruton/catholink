const HookRequirePath = require('hook-require-path')
const hookRequirePath = new HookRequirePath()
hookRequirePath.addRule('@', '.')
hookRequirePath.addRule('@routers', './routers')
hookRequirePath.addRule('@config', './config')
hookRequirePath.addRule('@auth', './auth')
hookRequirePath.addRule('@db', './db')
hookRequirePath.addRule('@request', './request')
hookRequirePath.addRule('@gospel', './gospel')
hookRequirePath.addRule('@helpers', './helpers')
hookRequirePath.install()

const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')
const apiRouter = require('./routes/api')
const frontRouter = require('./routes/front')
const authRouter = require('./routes/auth')
const signUpRouter = require('./routes/signup')
const socket = require('./socket')

// For development:
app.use(cors())
const http = socket(app)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routers
app.use('/signup', signUpRouter)
app.use('/auth', authRouter)
app.use('/api', apiRouter)
app.use('/', frontRouter)

;(async () => {
  await db.open()
  console.log('DB connection open')
  const PORT = 5000

  const server = http.listen(PORT, () => console.log(`Server is running on PORT ${PORT}...`))

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

  process.title = 'catholink'
})()
