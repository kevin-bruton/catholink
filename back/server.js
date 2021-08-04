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

const log = require('./log')
;(function checkEnvVariablesAreDefined () {
  const {CAT_JWT, CAT_MONGO, CAT_GOOGLE_CREDENTIALS, CAT_GOOGLE_TOKEN, CAT_DOMAIN} = process.env
  if (!CAT_JWT || !CAT_MONGO || !CAT_GOOGLE_CREDENTIALS || !CAT_GOOGLE_TOKEN || !CAT_DOMAIN) {
    log('One or more environment variables are missing')
    const envVars = {CAT_JWT, CAT_MONGO, CAT_GOOGLE_CREDENTIALS, CAT_GOOGLE_TOKEN, CAT_DOMAIN}
    Object.keys(envVars).forEach(envVarName => log(envVarName, envVars[envVarName]))
    process.exit()
  }
})()

const app = require('express')()
const bodyParser = require('body-parser')
const db = require('./db')
const apiRouter = require('./routes/api')
const authRouter = require('./routes/auth')
const signUpRouter = require('./routes/signup')
const passwordRouter = require('./routes/password')
const acceptContactRouter = require('./routes/acceptContact')
const socket = require('./socket')

if (process.env.CAT_SERVER_MODE === 'DEV') {
  console.log('\nIn DEV mode... CORS enabled!\n')
  const cors = require('cors')
  app.use(cors())
}

const server = require('http').createServer(app)
socket(server)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '1mb'}))

// routers
app.use('/signup', signUpRouter)
app.use('/accept-contact', acceptContactRouter)
app.use('/password', passwordRouter)
app.use('/auth', authRouter)
app.use('/api', apiRouter)

;(async (server) => {
  await db.open()
  log('DB connection open')
  const PORT = process.env.PORT || 5000

  const listeningServer = server.listen(PORT, () => log(`Server is running on PORT ${PORT}...`))

  process.on('SIGINT', function () {
    log('DB connection closed')
    db.close()
    listeningServer.close()
  })
  process.once('SIGUSR2', function () {
    db.close()
    log('DB connection closed')
    listeningServer.close(function () {
      process.kill(process.pid, 'SIGUSR2')
    })
  })

  process.title = 'catholink'
})(server)
