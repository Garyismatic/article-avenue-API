const db = require('../db/connection')
const { checkUserExists } = require('../utils/utils')
const format = require('pg-format')
const { fetchTopics } = require('./topics.model')

exports.fetchArticles = (sort_by = 'created_at', order = 'DESC', topic, limit = 10, p = 1) => {

    const orderGreenList = ['asc', 'ASC', 'desc', 'DESC' ]
    const topicsGreenlist = []
    let addTopicSqlString = ''
    const promiseArray = []

    return fetchTopics()
    .then((topics) => {
        topics.forEach(({slug}) => { topicsGreenlist.push(slug) })
            if(topic !== undefined && !topicsGreenlist.includes(topic)){
                return Promise.reject({status: 404, message: 'not found'})
            }
            else{
                addTopicSqlString = format(' WHERE topic = %L', topic) 
            }
    })
    .then(() => {
        
        if(!orderGreenList.includes(order)){
            return Promise.reject({status: 400, message: 'invalid request'})
        }
        
        let sqlString ='SELECT CAST(COUNT (comments.body) AS int) AS comment_count, articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url FROM articles FULL OUTER JOIN comments ON comments.article_id = articles.article_id'

        if(topic){
            sqlString += addTopicSqlString
        }

        sqlString += format(' GROUP BY articles.article_id ORDER BY %I', sort_by)
        
        sqlString += ` ${order}`

        return Promise.all([db.query(sqlString), sqlString])
    })
    .then(([{rows},sqlString]) => {

        const total_count = rows.length

        sqlString += ' LIMIT $1 OFFSET $2'
        
        p = (p - 1) * limit

        return Promise.all([db.query(sqlString, [limit, p]),total_count])
    })
    .then(([{rows},total_count]) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, message: 'not found'})
        }
        return [rows, total_count]
    })
}

exports.fetchArticleById = (articleId) => {
    return db.query('SELECT CAST(COUNT (comments.article_id) AS int) AS comment_count, articles.body, articles.article_id, articles.author, articles.votes, articles.created_at, title, topic, article_img_url FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;', [articleId])
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

exports.addNewArticle = (article) => {
   
    const { author, title, body, topic, article_img_url } = article
    const articleGreenlist = [ author, title, body, topic, article_img_url ]
    let articleImage = article_img_url

    for(const key in article){
        if(!articleGreenlist.includes(article[key])){
            return Promise.reject({status: 400, message: 'invalid request'})
        }
    }

    if(articleImage === undefined){
        articleImage = 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
    }
    
    return db.query('INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *', [title, topic, author, body, articleImage])
    .then(({rows}) => {
        const newArticleId = rows[0].article_id
        return this.fetchArticleById(newArticleId)
    })

}