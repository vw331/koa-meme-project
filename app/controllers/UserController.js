const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const { secret } = require('../config')


class UserController {
  
  async find(ctx) {
    ctx.body = await User.find()
  }

  async findById(ctx) {
    const user = await User.findById(ctx.params.id)
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

}

module.exports = new UserController()