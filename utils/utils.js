const db = require('../db/connection')

exports.checkArticleIdExists = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return false
        }else{
            return true
        }
    })
}

exports.checkUserExists = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1',[username])
    .then(({rows}) => {
        return rows.length === 1
    })
}