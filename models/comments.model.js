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

exports.updateCommentsVotes = (commentId, votes) => {
    return db.query('UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *', [votes, commentId])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, message: 'not found'})
        }
        return rows[0]
    })
}
