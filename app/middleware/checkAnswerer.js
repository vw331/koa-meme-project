const { Answer } = require('../models')

/**
 * 检测当前用户是否是答题者
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports = async (ctx, next) => {
  const { user, answer } = ctx.state
  if( user.id !== answer.answerer.toString() ) {
    ctx.throw(403, '没有权限')
  }
  await next()
}