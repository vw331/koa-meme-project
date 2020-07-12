const { Answer } = require('../models')

/**
 * 检测答案是否存在
 */
module.exports = async (ctx, next) => {
  const answer = await Answer.findById(ctx.params.id).select('+answerer')
  if(!answer) {
    ctx.throw(404, '回答不存在')
  }
  ctx.state.answer = answer
  await next()
}