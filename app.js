const express = require('express')
const { getTopics } = require('./controllers/topics.controller')
const { getEndpointList } = require('./controllers/endpoint-list.controller')
const { getArticleById, getArticles, getCommentsFromArticleId, postCommentToArticle, patchArticleVotes } = require('./controllers/articles.controller')
const { customErrors, psqlCodeErrors } = require('./error-handlers')
const { deleteComment } = require('./controllers/comments.controller')
const { getUsers } = require('./controllers/users.controller')

const app = express()

app.use(express.json())

app.get('/api', getEndpointList)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles/:article_id/comments', getCommentsFromArticleId)
app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postCommentToArticle)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.delete('/api/comments/:comment_id', deleteComment)

app.use(customErrors)
app.use(psqlCodeErrors)

module.exports = app