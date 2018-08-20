const port = 3000, directory = 'front/build'

const express = require('express')
const app = express()

app.use(express.static(`../${directory}`))

app.listen(port, () => console.log(`Serving static files in ${directory} on port ${port}...`))
