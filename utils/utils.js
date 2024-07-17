const db = require('../db/connection')

exports.checkArticleIdExists = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({rows}) => {
        return rows.length === 1
    })
}

exports.checkUserExists = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1',[username])
    .then(({rows}) => {
        return rows.length === 1
    })
}

exports.checkCommentExists = (comment_id) => {
    return db.query('SELECT * FROM comments WHERE comment_id = $1',[comment_id])
    .then(({rows}) => {
        return rows.length === 1
    })
}

//could potentially turn these 3 functions into one by inserting more parameters would require an overhaul of other modules in models