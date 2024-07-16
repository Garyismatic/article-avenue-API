const { fetchArticleById, fetchArticles } = require("../models/articles.model")

exports.getArticles = (request, response, next) => {
    return fetchArticles()
    .then((articles) => {
        articles.forEach((article) => {
            article.comment_count = parseInt(article.comment_count) //<< change comment_count to number from string
        })
        response.status(200).send({articles})
    })
}

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params
    return fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}