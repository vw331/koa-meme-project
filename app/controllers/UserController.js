const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const { secret } = require('../config')
const { Question, Answer } = require('../models')


class UserController {
  
  async find(ctx) {
    let { page_size = 10, page_num = 1 } = ctx.query
    page_size = Math.max(page_size*1, 1)
    page_num = Math.max(page_num*1, 0)
    ctx.body = await User
      .find({name: new RegExp(ctx.query.q)})
      .limit(page_size)
      .skip(page_size*(page_num-1))
  }

  async findById(ctx) {
    const { fields } = ctx.query
    const selectFields = ['educations', 'employments', 'business', 'locations'].map(f => ' +'+f).join('')
    const user = await User.findById(ctx.params.id).select(selectFields)
      .populate('following locations business employments.company employments.job educations.scholl educations.major')
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const user_exist = await User.findOne({ name: ctx.request.body.name })
    if(user_exist) {
      ctx.throw(409, '用户已存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  async update(ctx) {

    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false }, 
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false},
      educations: { type: 'array', itemType: 'object', required: false }
    })

    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.status = 204
  }

  async login(ctx) {
    console.log(  ctx.request.body)
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if( !user ) {
      ctx.throw(401, '用户不存在或密码错误!')
    }
    const { id, name } = user;
    const token = jsonwebtoken.sign({ id, name }, secret, { expiresIn: '1d' })
    ctx.body = { token }
  }

  /**
   * 获取关注者
   * @ params {id: String}
   */
  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.following
  }

  /**
   *  获取粉丝
   *  @params {id: String}
   */
  async listFollowers(ctx) {
    const users = await User.find({ following: ctx.params.id })
    ctx.body = users
  }

  /**
   * 关注
   * @param {*} ctx 
   */
  async follow(ctx) {
    const me = await User.findById(ctx.state.user.id).select('+following')
    if(!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }

  /**
   * 取消关系
   * @param {*}} ctx 
   */
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user.id).select('+following')
    const index = me.following.map(id => id.toString).indexOf(ctx.params.id)
    if(index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }

  /**
   * 关注话题列表
   */
  async listFollowTopics(ctx) {
    const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.followingTopics
  }


  /**
   * 关注话题
   */
  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user.id).select('+followingTopics')
    console.log(me)
    if(!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id)
      me.save()
    } 
    ctx.status = 204
  }

  /**
   * 取消关注话题
   */
  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user.id).select('+followingTopics')
    const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.followingTopics.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }

  /**
   * 某人所提问题
   */
  async listQuestions(ctx) {
    const questions = await Question.find({questioner: ctx.params.id})
    ctx.body = questions
  }

  /**
   * 点赞某答案
   * @param {*} ctx 
   * @param {*} next 
   */
  async likeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user.id).select('+likingAnswers')
    const toSets = new Set([...me.likingAnswers].map(id => id.toString()))
    if(!toSets.has(ctx.params.id)) {
      toSets.add(ctx.params.id)
      me.likingAnswers = Array.from(toSets)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: {voteCount: 1} }) 
    }
    ctx.status = 204
    await next() 
  }

  /**
   * 取消点赞
   * @param {*} ctx 
   */
  async unlikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user.id).select('+likingAnswers')
    const toSets = new Set([...me.likingAnswers].map(id => id.toString()))
    if(toSets.has(ctx.params.id)) {
      toSets.delete(ctx.params.id)
      me.likingAnswers = Array.from(toSets)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: {voteCount: -1} }) 
    } 
    ctx.status = 204
  }

  /**
   * 点赞记录
   * @param {*} ctx 
   */
  async listLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).populate('likingAnswers')
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.likingAnswers
  }

  /**
   * 踩答案
   */
  async dislikeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user.id).select('+dislikingAnswers')
    const toSets = new Set([...me.dislikingAnswers].map(id => id.toString()))
    if(!toSets.has(ctx.params.id)) {
      toSets.add(ctx.params.id)
      me.dislikingAnswers = Array.from(toSets)
      me.save()
    }
    ctx.status = 204
    await next() 
  }

  /**
   * 取消踩
   * @param {*} ctx 
   */
  async undislikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user.id).select('+dislikingAnswers')
    const toSets = new Set([...me.dislikingAnswers].map(id => id.toString()))
    if(toSets.has(ctx.params.id)) {
      toSets.delete(ctx.params.id)
      me.dislikingAnswers = Array.from(toSets)
      me.save()
    } 
    ctx.status = 204
  }

  /**
   * 踩记录
   * @param {*} ctx 
   */
  async listDislikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).populate('dislikingAnswers')
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.dislikingAnswers
  }

  /**
   * 收藏某答案
   * @param {*} ctx 
   */
  async collectAnswer(ctx) {
    console.log( ctx.params.id )
    const me = await User.findById(ctx.state.user.id).select('+collectingAnswers')
    const toSets = new Set([...me.collectingAnswers].map(id => id.toString()))
    if(!toSets.has(ctx.params.id)) {
      toSets.add(ctx.params.id)
      me.collectingAnswers = Array.from(toSets)
      me.save()
    }
    ctx.status = 204
  }

  /**
   * 取消收藏某答案
   * @param {*} ctx 
   */
  async uncollectAnswer(ctx) {
    const me = await User.findById(ctx.state.user.id).select('+collectingAnswers')
    const toSets = new Set([...me.collectingAnswers].map(id => id.toString()))
    if(toSets.has(ctx.params.id)) {
      toSets.delete(ctx.params.id)
      me.collectingAnswers = Array.from(toSets)
      me.save()
    } 
    ctx.status = 204
  }

  /**
   * 收藏记录
   * @param {*} ctx 
   */
  async listCollectingAnswers(ctx) {
    const user = await User.findById(ctx.params.id).populate('collectingAnswers')
    if(!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.collectingAnswers
  }
}

module.exports = new UserController()