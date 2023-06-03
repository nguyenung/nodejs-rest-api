const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const apiRouter = require('./routes/api')

app.use('/api', apiRouter)

app.listen(3001)
