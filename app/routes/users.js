const Router = require('koa-router')
const jwt = require('koa-jwt')
const userCtrl = require('../controllers/UserController')
const { secret } = require('../config')
const User = require('../models/users')

const router = new Router({ 
  prefix: '/users'
})


const auth = jwt({ secret })

/**
 * 是否是数据持有者
 * @param {*} ctx 
 * @param {*} next 
 */
const checkOwner = async (ctx, next) => {
  if(ctx.params.id !== ctx.state.user.id) {
    ctx.throw(403, '没有权限')
  }
  await next()
}

/**
 * 用户是否存在
 * @param {*} ctx 
 * @param {*} next 
 */
const checkUserExist = async (ctx, next) => {
  console.log( ctx.params.id )
  const user = await User.findById(ctx.params.id)
  if(!user) {
    ctx.throw(404, '用户不存在2')
  }
  await next()
}


router.get('/', auth, userCtrl.find)
router.get('/:id', auth, userCtrl.findById)
router.post('/', auth, userCtrl.create)
router.patch('/:id', auth, checkOwner,userCtrl.update)
router.delete('/:id', auth, checkOwner, userCtrl.delete)
router.post('/login', userCtrl.login)
router.get('/:id/following', userCtrl.listFollowing)
router.get('/:id/followers', userCtrl.listFollowers)
router.put('/following/:id', auth, checkUserExist, userCtrl.follow)
router.delete('/following/:id', auth, checkUserExist, userCtrl.unfollow)

module.exports = router