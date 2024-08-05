const express = require('express')
const { customErrors, psqlCodeErrors } = require('./error-handlers')
const  apiRouter  = require('./routers/api-router')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api', apiRouter)

app.use(customErrors)
app.use(psqlCodeErrors)

module.exports = app