const { deleteComment, patchCommentsVotes } = require('../controllers/comments.controller')


const commentsRouter = require('express').Router()

commentsRouter.route('/:comment_id')
.patch(patchCommentsVotes)
.delete(deleteComment)


module.exports = commentsRouter