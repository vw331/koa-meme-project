const { Comment } = require('../models')

/**
 * 检测是否是评论拥有者
 */
module.exports = async (ctx, next) => {
  const { user, comment } = ctx.state
  if( user.id !== comment.commentator.toString() ) {
    ctx.throw(403, '没有权限')
  }
  await next()
}