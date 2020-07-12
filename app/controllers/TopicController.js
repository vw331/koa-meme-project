const Topic = require('../models/topics')
const User = require('../models/users')
const Question = require('../models/questions')

class TopicController {
  /**
   * 查询话题列表
   */
  async find(ctx) {
    let { page_size = 10, page_num = 1 } = ctx.query
    page_size = Math.max(page_size*1, 1)
    page_num = Math.max(page_num*1, 0)
    ctx.body = await Topic
      .find({name: new RegExp(ctx.query.q)})
      .limit(page_size)
      .skip(page_size*(page_num-1))
  }
  /**
   *  查询话题
   * @param {*} ctx 
   */
  async findById(ctx) {
    const fields = ['introduction', 'avatar_url'].map(f => ' +'+f).join('')
    const topic = await Topic.findById(ctx.params.id).select(fields)
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
  
  /**
   *  话题关注者
   */
  async listTopicFollowers(ctx) {
    const users = await User.find({ followingTopics: ctx.params.id }) 
    ctx.body = users
  }

  /**
   *  话题 =》问题
   */
  async listQuestions(ctx) {
    const questions = await Question.find({ topics: ctx.params.id })
    ctx.body = questions
  }
}

module.exports = new TopicController()