const Question = require('../models/questions')

class QuestionsController {

  constructor() {
    this.selectFields = ['topics', 'questioner'].map(f => ' +'+ f).join('')
  }

  /**
   * 问题列表
   * @param {} 
   */
  async find(ctx) {
    let { page_size = 10, page_num = 1 } = ctx.query
    page_size = Math.max(page_size*1, 1)
    page_num = Math.max(page_num*1, 0)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Question
      .find({ $or: [{title: q}, {description: q}] })
      .limit(page_size)
      .skip(page_size*(page_num-1)) 
      .populate('questioner topics')
  }

  /**
   * 查询问题
   */
  async findById(ctx) {
    const question = await Question.findById(ctx.params.id).select().populate('questioner topics')
    ctx.body = question
  }

  /**
   * 新增问题
   * @param {} ctx 
   */
  async create(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false }
    })
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user.id
    })
    question.save()
    ctx.body = question
  }

  /**
   * 修改问题
   * @param {*} ctx 
   */
  async update(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false }
    })
    const question = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = question
  }

  /**
   * 删除问题
   * @param {} ctx 
   */
  async delete(ctx) {
    await Question.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }

}


module.exports = new QuestionsController()