const { Comment } = require('../models')

/**
 * 检测评论是否存在
 */
module.exports = async (ctx, next) => {
  const comment = await Comment.findById(ctx.params.id)
  if(!answer) {
    ctx.throw(404, '评论不存在')
  }
  ctx.state.comment = comment
  await next()
}