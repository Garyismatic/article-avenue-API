const db = require('../db/connection')

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

