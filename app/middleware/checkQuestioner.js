/**
 * 检测是否是拥有者
 * @param {*} ctx 
 * @param {*} next 
 */
module.exports = async (ctx, next) => {
  const {user, question } = ctx.state
  if(user.id !== question.questioner.toString()) {
    ctx.throw(403, '无权操作')
  }
  await next()
}