const db = require('../db/connection')
const { checkCommentExists } = require('../utils/utils')

exports.removeComment = (commentId) => {
    return checkCommentExists(commentId)
    .then((result) => {
        if(!result){
            return Promise.reject({status: 404, message: 'not found'})
        }else{
            return db.query('DELETE FROM comments WHERE comment_id = $1', [commentId])       
        }
    })   
}

exports.fetchUsername = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1', [username])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, message: 'not found'})
        }
        return rows[0]
    })
}
