const express = require('express')
const { getTopics } = require('./controllers/topics.controllers')
const { getEndpointList } = require('./controllers/endpoint-list.controller')
const { getArticleById, getArticles, getCommentsFromArticleId } = require('./controllers/articles.controller')
const { customErrors, psqlCodeErrors } = require('./error-handlers')


const app = express()

app.get('/api', getEndpointList)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsFromArticleId)

app.use(customErrors)
app.use(psqlCodeErrors)

module.exports = app