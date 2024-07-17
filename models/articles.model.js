const db = require('../db/connection')
const { checkUserExists } = require('../utils/utils')
const format = require('pg-format')

exports.fetchArticles = (sort_by = 'created_at', order = 'DESC') => {

    const orderGreenList = ['asc', 'ASC', 'desc', 'DESC' ]

    if(!orderGreenList.includes(order)){
        return Promise.reject({status: 400, message: 'invalid request'})
    }

    let sqlString = format('SELECT COUNT (comments.body) AS comment_count, articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url FROM articles FULL OUTER JOIN comments ON comments.article_id = articles.article_id  GROUP BY articles.article_id ORDER BY %I', sort_by)

    sqlString += ` ${order}`

    return db.query(sqlString)
    .then(({rows}) => {
        return rows
    })
}

exports.fetchArticleById = (articleId) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [articleId])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, message: 'not found' })
        }
        return rows[0]
    })
}

exports.fetchCommentsOnArticle = (articleId) => {
    return this.fetchArticleById(articleId)
    .then((result) => {
        return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [articleId])
    })
    .then(({rows}) => {
        return rows
    }) 
}

exports.addCommentToArticle = (articleId, author, comment) => {
    if(comment.length === 0){
        return Promise.reject({status: 400, message: 'Comment body can not be empty'})
    }
    return checkUserExists(author)
    .then((result) => {
        if(!result){
            return Promise.reject({status: 401, message: 'unknown username'})
        }
        else{
            return this.fetchArticleById(articleId)
        }
    })
    .then(() => {
            return db.query('INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *', [articleId, author, comment])          
    })
    .then(({rows}) => {
        return rows[0]
    })    
}

exports.updateVotesOnArticle = (voteCount, articleId) => {
    return this.fetchArticleById(articleId)
    .then(() => {
        return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *', [voteCount,articleId])
    .then(({rows}) => {
        return rows[0]
    })   
    }) 
}