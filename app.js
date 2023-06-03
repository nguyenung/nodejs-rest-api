const express = require('express')
const bodyParser = require('body-parser')

//Live reload when save file
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
const liveReloadServer = livereload.createServer()
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/")
    }, 100)
})

const app = express()

app.use(connectLiveReload())

app.use(bodyParser.json())

const apiRouter = require('./route/api')

app.use(apiRouter)

app.listen(3001)