const Topic = require('../models/topics')

/**
 * 话题是否存在
 */
const checkTopicExist = async (ctx, next) => {
  const topic = await Topic.findById(ctx.params.id)
  if(!topic) {
    ctx.throw(404, '话题不存在')
  }
  await next()
}

module.exports = checkTopicExist