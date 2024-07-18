const { articlesRouter, topicsRouter, usersRouter, commentsRouter } = require('.')
const { getEndpointList } = require('../controllers/endpoint-list.controller')

const apiRouter = require('express').Router()

apiRouter.get('/', getEndpointList)

apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter