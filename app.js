const express = require('express')
const { getTopics } = require('./controllers/topics.controllers')
const { getEndpointList } = require('./controllers/endpoint-list.controller')
const { getArticleById } = require('./controllers/articles.controller')


const app = express()

app.get('/api', getEndpointList)
app.get('/api/topics', getTopics)
app.get('/api/articles/:article_id', getArticleById)


module.exports = app