const { Comment } = require('../models')

class CommentController {

  constructor() {
    this.selectFields = [].map(f => ' +'+ f).join('')
  }

  /**
   * 评论列表
   * @param {*} ctx 
   */
  async find(ctx) {
    let { page_size = 10, page_num = 1 } = ctx.query
    page_size = Math.max(page_size*1, 1)
    page_num = Math.max(page_num*1, 0)
    const { questionId, answerId } = ctx.params
    const q = new RegExp(ctx.query.q)
    ctx.body = await Comment
      .find({ content: q, questionId, answerId,  })
      .limit(page_size)
      .skip(page_size*(page_num-1))
      .populate('commentator')
  }

  /**
   * 根据ID查询评论
   * @param {*} ctx 
   */
  async findById(ctx) {
    const comment = await Comment.findById(ctx.params.id).select(this.selectFields).populate('commentator')
    ctx.body = comment
  }

  /**
   * 创建评论
   * @param {} ctx 
   */
  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false }
    })
    const commentator = ctx.state.user.id 
    const { questionId, answerId } = ctx.params
    const comment = await new Comment({
      ...ctx.request.body,
      answerId,
      commentator,
      questionId
    }).save()
    ctx.body = comment
  }

  /**
   * 修改评论
   * @param {*} ctx 
   */
  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const answer = await Comment.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = answer
  }

  /**
   * 删除评论
   * @param {*} ctx 
   */
  async delete(ctx) {
    await Comment.findByIdAndDelete(ctx.params.id)
    ctx.status = 204
  }
}

module.exports = new CommentController()