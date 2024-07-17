const { fetchArticleById, fetchArticles, fetchCommentsOnArticle, addCommentToArticle, updateVotesOnArticle } = require("../models/articles.model")

exports.getArticles = (request, response, next) => {
    const {sort_by} = request.query
    const {order} = request.query
    return fetchArticles(sort_by, order)
    .then((articles) => {
        articles.forEach((article) => {
            article.comment_count = parseInt(article.comment_count) //<< change comment_count to number from string
        })
        response.status(200).send({articles})
    })
    .catch((err) => {
        console.log(err)
        next(err)
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

exports.getCommentsFromArticleId = (request, response, next) => {
    const { article_id } = request.params
    return fetchCommentsOnArticle(article_id)
    .then((comments) => {
        response.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

exports.postCommentToArticle = (request, response, next) => {
    const {article_id} = request.params
    const {username} = request.body
    const {body} = request.body
    return addCommentToArticle(article_id, username, body)
    .then(({body}) => {  
        response.status(201).send({commentPosted: body})
    }).catch((err) => {
        next(err)
    })
    
}

exports.patchArticleVotes = (request, response, next) => {
    const {inc_votes} = request.body
    const {article_id} = request.params
    return updateVotesOnArticle( inc_votes, article_id )
    .then((updatedArticle) => {
        response.status(200).send({updatedArticle})
    }).catch((err) => {
        next(err)
    })
}