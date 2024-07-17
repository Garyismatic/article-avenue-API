const { removeComment } = require("../models/comments.model")

exports.deleteComment = (request, response, next) => {
    const {comment_id} = request.params
    return removeComment(comment_id)
    .then(() => {
        response.status(204).send({})
    })
    .catch((err) => {
        next(err)
    })
}