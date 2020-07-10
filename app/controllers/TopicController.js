const Topic = require('../models/topics')

class TopicController {
  /**
   * 查询话题列表
   */
  async find(ctx) {
    ctx.body = await Topic.find()
  }
  /**
   *  查询话题
   * @param {*} ctx 
   */
  async findById(ctx) {
    const fields = ['introduction'].map(f => ' +'+f).join('')
    const topic = await toppic.findById(ctx.params.id).select(fields)
    ctx.body = topic
  }
  /**
   * 创建话题
   * @param {*} ctx 
   */
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      intrdouction: { type: 'string', required: false },
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  /**
   * 修改话题
   * @param {} ctx 
   */
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      intrdouction: { type: 'string', required: false },
    })
    console.log( ctx.request.body )
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = topic
  }

}

module.exports = new TopicController()