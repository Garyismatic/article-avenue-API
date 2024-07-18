const { removeComment, updateCommentsVotes } = require("../models/comments.model")

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

exports.patchCommentsVotes = (request, response, next) => {
    const { comment_id } = request.params
    const { inc_votes } = request.body
    return updateCommentsVotes(comment_id, inc_votes).then((comment) => {
        response.status(200).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}