const User = require('../models/users')

/**
 * 用户是否存在
 * @param {*} ctx 
 * @param {*} next 
 */
const checkUserExist = async (ctx, next) => {
  const user = await User.findById(ctx.params.id)
  if(!user) {
    ctx.throw(404, '用户不存在2')
  }
  await next()
}

module.exports = checkUserExist