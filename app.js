const express = require('express')
const { customErrors, psqlCodeErrors } = require('./error-handlers')
const  apiRouter  = require('./routers/api-router')

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.use(customErrors)
app.use(psqlCodeErrors)

module.exports = app