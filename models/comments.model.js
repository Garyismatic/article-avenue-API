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
