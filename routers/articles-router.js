const { getArticles, getArticleById, getCommentsFromArticleId, postCommentToArticle, patchArticleVotes, postArticle } = require("../controllers/articles.controller")

const articlesRouter = require("express").Router()

articlesRouter.route('/')
.get(getArticles)
.post(postArticle)

articlesRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleVotes)

articlesRouter.route('/:article_id/comments')
.get(getCommentsFromArticleId)
.post(postCommentToArticle)

module.exports = articlesRouter