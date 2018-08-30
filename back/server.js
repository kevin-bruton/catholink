const express = require('express')
const bodyParser = require('body-parser')
// const passport = require('passport')
const dbConfig = require('./config/db')
// const apiRouter = require('./routers/api')
const frontRouter = require('./routers/front')
// const authRouter = require('./router/auth')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// routers
// app.post('/auth', authRouter)
// app.use('/api', apiRouter)
app.use('/', frontRouter)

;(async () => {
  const mongoConnection = await dbConfig.connect()
  const collections = await dbConfig.init(mongoConnection)
  collections.map(collection => {
    const collectionName = `db${collection.s.name.charAt(0).toUpperCase()}${collection.s.name.substr(1)}`
    app.set(collectionName, collection)
  })

  const PORT = process.env.PORT || 5000

  const server = app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}...`))

  process.on('SIGINT', function () {
    server.close(function () {
      mongoConnection.close()
      console.log('DB connection closed')
    })
  })
})()
