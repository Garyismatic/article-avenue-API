const { fetchUsers } = require("../models/users.model")

exports.getUsers = (request, response, next) => {
    return fetchUsers()
    .then((users) => {
        response.status(200).send({users})
    })
}