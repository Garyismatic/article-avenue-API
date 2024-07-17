const app = require('./app')

exports.customErrors = (err, request, response, next) => {
    if(err.status && err.message){
        response.status(err.status).send({message: err.message})
    }
    next(err)
}

exports.psqlCodeErrors = (err, request, response, next) => {
    if(err.code === '22P02'){
        response.status(400).send({message: 'invalid request'})
    }
    if(err.code === '42703'){
        response.status(404).send({message: 'column does not exist'})
    }
    next(err)
}