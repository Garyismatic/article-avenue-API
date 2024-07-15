const express = require('express')
const { getTopics } = require('./controllers/topics.controllers')
const { getEndpointList } = require('./controllers/endpoint-list.controller')


const app = express()

app.get('/api', getEndpointList)
app.get('/api/topics', getTopics)


module.exports = app