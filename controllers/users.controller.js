const { fetchUsername } = require("../models/comments.model")
const { fetchUsers } = require("../models/users.model")

exports.getUsers = (request, response, next) => {
    return fetchUsers()
    .then((users) => {
        response.status(200).send({users})
    })
}

exports.getUsername = (request, response, next) => {
    const { username } = request.params
    return fetchUsername(username)
    .then((user) => {
        response.status(200).send({user})
    })
    .catch((err) => {
        next(err)
    })
}