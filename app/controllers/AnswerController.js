const { Answer } = require('../models')

class AnswerController {

  constructor() {
    this.selectFields = [].map(f => ' +'+ f).join('')
  }

  /**
   * 答案列表
   * @param {*} ctx 
   */
  async find(ctx) {
    let { page_size = 10, page_num = 1 } = ctx.query
    page_size = Math.max(page_size*1, 1)
    page_num = Math.max(page_num*1, 0)
    const q = new RegExp(ctx.query.q)
    ctx.body = await Answer
      .find({ content: q, questionId: ctx.params.questionId })
      .limit(page_size)
      .skip(page_size*(page_num-1))
      .populate('answerer')
  }

  /**
   * 根据ID查询答案
   * @param {*} ctx 
   */
  async findById(ctx) {
    const answer = await Answer.findById(ctx.params.id).select(this.selectFields).populate('answerer')
    ctx.body = answer
  }

  /**
   * 创建答案
   * @param {} ctx 
   */
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const answerer = ctx.state.user.id 
    const { questionId } = ctx.params
    const answer = await new Answer({
      ...ctx.request.body,
      answerer,
      questionId
    }).save()
    ctx.body = answer
  }

  /**
   * 修改答案
   * @param {*} ctx 
   */
  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    console.log( ctx.params.id, ctx.request.body )
    const answer = await Answer.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = answer
  }

  /**
   * 删除答案
   * @param {*} ctx 
   */
  async delete(ctx) {
    await Answer.findByIdAndDelete(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new AnswerController()