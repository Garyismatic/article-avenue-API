const { fetchArticleById, fetchArticles, fetchCommentsOnArticle, addCommentToArticle, updateVotesOnArticle, addNewArticle } = require("../models/articles.model")

exports.getArticles = (request, response, next) => {
    const {sort_by, order, topic, limit, p} = request.query
    return fetchArticles(sort_by, order, topic, limit, p)
    .then(([articles,total_count]) => {
        response.status(200).send({articles, total_count})
    })
    .catch((err) => {
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

exports.postArticle = (request, response, next) => {
    const newArticle = request.body
    return addNewArticle(newArticle)
    .then((article) => {
        response.status(201).send({article})
    })
    .catch((err) => {
        next(err)
    })
}