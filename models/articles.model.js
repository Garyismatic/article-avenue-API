const db = require('../db/connection')

exports.fetchArticles = () => {

    return db.query('SELECT COUNT (comments.body) AS comment_count, articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url FROM articles JOIN comments ON comments.article_id = articles.article_id  GROUP BY articles.article_id')
    .then(({rows}) => {
        return rows
    })
}

exports.fetchArticleById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, message: 'not found' })
        }
        return rows[0]
    })
}