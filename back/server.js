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
hookRequirePath.addRule('@log', './log')
hookRequirePath.install()

;(function checkEnvVariablesAreDefined () {
  if (!process.env.CAT_JWT || !process.env.CAT_MONGO || !process.env.CAT_GOOGLE_CREDENTIALS || !process.env.CAT_GOOGLE_TOKEN) {
    log('One or more environment variables are missing')
    process.exit()
  }
})()

const app = require('express')()
const bodyParser = require('body-parser')
const db = require('./db')
const apiRouter = require('./routes/api')
const frontRouter = require('./routes/front')
const authRouter = require('./routes/auth')
const signUpRouter = require('./routes/signup')
const socket = require('./socket')
const log = require('./log')

if (process.env.CAT_ENV === 'DEV') {
  const cors = require('cors')
  app.use(cors())
}

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
  log('DB connection open')
  const PORT = process.env.PORT || 5000

  const server = http.listen(PORT, () => log(`Server is running on PORT ${PORT}...`))

  process.on('SIGINT', function () {
    log('DB connection closed')
    db.close()
    server.close()
  })
  process.once('SIGUSR2', function () {
    db.close()
    log('DB connection closed')
    server.close(function () {
      process.kill(process.pid, 'SIGUSR2')
    })
  })

  process.title = 'catholink'
})()
