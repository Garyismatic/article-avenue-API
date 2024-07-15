const app = require('./app')

exports.customErrors = (err, request, response, next) => {
    if(err.status && err.message){
        response.status(err.status).send({message: err.message})
    }
    next(err)
}