const db = require('../db/connection')
const { checkArticleIdExists } = require('../utils/utils')

exports.fetchArticles = () => {

    return db.query('SELECT COUNT (comments.body) AS comment_count, articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url FROM articles FULL OUTER JOIN comments ON comments.article_id = articles.article_id  GROUP BY articles.article_id ORDER BY created_at DESC')
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
    return checkArticleIdExists(articleId)
    .then((result) => {
        if(result === false){
            return Promise.reject({ status: 404, message: 'not found'})
        }else{
            return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [articleId])
            .then(({rows}) => {
                return rows
            })
        }   
    })  
}