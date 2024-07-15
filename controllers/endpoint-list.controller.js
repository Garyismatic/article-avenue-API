const fs = require('fs/promises')

exports.getEndpointList = (request, response, next) => {
    return fs.readFile('./endpoints.json', 'utf8').then((data) => {
        const endpointList = JSON.parse(data)
        return endpointList
    }).then((endpoints) => {
        response.status(200).send({endpoints})
    })
}